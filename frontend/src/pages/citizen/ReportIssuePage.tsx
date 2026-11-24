import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/layout/Header'
import ValidationResults from '../../components/fraud/ValidationResults'
import SimpleCaptcha from '../../components/security/SimpleCaptcha'
import { validateIssueReport, createIssueReport, FraudCheckResponse } from '../../services/issueApi'
import { detectFraud } from '../../services/fraudDetection'

export default function ReportIssuePage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    description: '',
    address: '',
    photo: null as File | null,
  })
  const [location, setLocation] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [validationResult, setValidationResult] = useState<FraudCheckResponse | null>(null)
  const [showValidationModal, setShowValidationModal] = useState(false)
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const getLocation = () => {
    setIsLoadingLocation(true)
    setError('')

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setIsLoadingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
        setIsLoadingLocation(false)
      },
      (error) => {
        setError('Unable to retrieve your location. Please enable location services.')
        setIsLoadingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Use back camera on mobile
        audio: false,
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setShowCamera(true)
        setError('')
      }
    } catch (err) {
      setError('Unable to access camera. Please check camera permissions.')
      console.error('Camera error:', err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      // Set canvas size to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      // Draw video frame to canvas
      const context = canvas.getContext('2d')
      if (context) {
        context.drawImage(video, 0, 0)
        
        // Convert canvas to blob and create file
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' })
            setFormData({ ...formData, photo: file })
            setPhotoPreview(canvas.toDataURL('image/jpeg'))
            stopCamera()
          }
        }, 'image/jpeg', 0.95)
      }
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      setFormData({ ...formData, photo: file })
      setError('')
    }
  }

  const removePhoto = () => {
    setFormData({ ...formData, photo: null })
    setPhotoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!location) {
      setError('Please capture your location first')
      return
    }

    if (!formData.photo) {
      setError('Please upload a photo of the issue')
      return
    }

    if (!formData.description || formData.description.length < 20) {
      setError('Please provide a detailed description (minimum 20 characters)')
      return
    }

    if (!isCaptchaVerified) {
      setError('Please complete the security verification')
      return
    }

    // Perform validation
    setIsValidating(true)
    
    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('Please login to report an issue')
        navigate('/login')
        return
      }

      // Call backend validation API
      const validationData = {
        description: formData.description,
        latitude: location.lat,
        longitude: location.lng,
        accuracy: location.accuracy,
        hasPhoto: true,
      }

      const result = await validateIssueReport(validationData, token)
      setValidationResult(result)
      setShowValidationModal(true)
      
      // If validation fails, show modal and stop
      if (!result.isValid) {
        setIsValidating(false)
        return
      }
      
      setIsValidating(false)
    } catch (err: any) {
      setIsValidating(false)
      setError(err.response?.data?.message || 'Validation failed. Please try again.')
    }
  }

  const proceedWithSubmission = async () => {
    if (!location || !formData.photo) return
    
    setShowValidationModal(false)
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('Please login to report an issue')
        navigate('/login')
        return
      }

      const data = new FormData()
      data.append('categoryId', '1') // Pothole category
      data.append('description', formData.description)
      data.append('latitude', location.lat.toString())
      data.append('longitude', location.lng.toString())
      data.append('address', formData.address)
      data.append('photo', formData.photo)

      await createIssueReport(data, token)
      
      alert('Issue reported successfully!')
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit report. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <Header />

      {/* Validation Modal */}
      {showValidationModal && validationResult && (
        <ValidationResults
          result={validationResult}
          onClose={() => setShowValidationModal(false)}
          onProceed={validationResult.isValid ? proceedWithSubmission : undefined}
        />
      )}

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-navy-800 shadow-lg sm:rounded-xl border border-navy-200 dark:border-navy-700">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-navy-900 dark:text-white mb-6">
              Report a Civic Issue
            </h1>

            {error && (
              <div className="mb-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-300 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-2">
                  Location *
                </label>
                {location ? (
                  <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-xl p-4">
                    <p className="text-sm text-success-800 dark:text-success-300">
                      ✓ Location captured: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={getLocation}
                    disabled={isLoadingLocation}
                    className="w-full flex justify-center py-3 px-4 border-2 border-navy-300 dark:border-navy-600 rounded-xl shadow-sm text-sm font-medium text-navy-700 dark:text-navy-300 bg-white dark:bg-navy-700 hover:bg-navy-50 dark:hover:bg-navy-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-500 disabled:opacity-50"
                  >
                    {isLoadingLocation ? 'Getting location...' : '📍 Capture Current Location'}
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-2">
                  Photo *
                </label>
                
                {!formData.photo && !showCamera && (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="w-full flex items-center justify-center py-3 px-4 border-2 border-dashed border-navy-300 dark:border-navy-600 rounded-xl shadow-sm text-sm font-medium text-navy-700 dark:text-navy-300 bg-white dark:bg-navy-700 hover:bg-navy-50 dark:hover:bg-navy-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-500"
                    >
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      📷 Open Camera
                    </button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">or</span>
                      </div>
                    </div>
                    
                    <label 
                      htmlFor="photo"
                      className="w-full flex items-center justify-center py-3 px-4 border-2 border-dashed border-navy-300 dark:border-navy-600 rounded-xl shadow-sm text-sm font-medium text-navy-700 dark:text-navy-300 bg-white dark:bg-navy-700 hover:bg-navy-50 dark:hover:bg-navy-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-500"
                    >
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      📁 Choose from Gallery
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="photo"
                      accept="image/jpeg,image/jpg,image/png,image/heic"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </div>
                )}
                
                {showCamera && (
                  <div className="space-y-3">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-auto"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="flex-1 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-royal-600 hover:bg-royal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-500 transition-all"
                      >
                        📸 Capture Photo
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="flex-1 py-3 px-4 border-2 border-navy-300 dark:border-navy-600 rounded-xl shadow-sm text-sm font-medium text-navy-700 dark:text-navy-300 bg-white dark:bg-navy-700 hover:bg-navy-50 dark:hover:bg-navy-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 transition-all"
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                )}
                
                {photoPreview && (
                  <div className="space-y-3">
                    <div className="relative">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        title="Remove photo"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-sm text-green-600 flex items-center">
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Photo ready: {formData.photo?.name || 'Captured from camera'}
                    </p>
                  </div>
                )}
                
                <p className="mt-2 text-xs text-gray-500">
                  Accepted formats: JPG, PNG, HEIC (Max 5MB)
                </p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the issue (size, location details, hazards, etc.)"
                  className="block w-full px-4 py-3 border-2 border-navy-300 dark:border-navy-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-royal-500 focus:border-transparent bg-white dark:bg-navy-700 text-navy-900 dark:text-white transition-all"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-2">
                  Address/Landmark (Optional)
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g., Near City Mall, MG Road"
                  className="block w-full px-4 py-3 border-2 border-navy-300 dark:border-navy-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-royal-500 focus:border-transparent bg-white dark:bg-navy-700 text-navy-900 dark:text-white transition-all"
                />
              </div>

              <SimpleCaptcha 
                onVerify={setIsCaptchaVerified}
                onReset={() => setIsCaptchaVerified(false)}
              />

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex-1 py-3 px-4 border-2 border-navy-300 dark:border-navy-600 rounded-xl shadow-sm text-sm font-medium text-navy-700 dark:text-navy-300 bg-white dark:bg-navy-700 hover:bg-navy-50 dark:hover:bg-navy-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isValidating || isSubmitting || !location || !formData.photo || formData.description.length < 20 || !isCaptchaVerified}
                  className="flex-1 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-royal-600 hover:bg-royal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  {isValidating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Validating...
                    </>
                  ) : isSubmitting ? 'Submitting...' : 'Validate & Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
