import { useState } from 'react'

interface SocialShareProps {
  title: string
  description: string
  url?: string
  imageUrl?: string
}

export default function SocialShare({ title, description, url = window.location.href, imageUrl }: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = encodeURIComponent(url)
  const shareTitle = encodeURIComponent(title)
  const shareDescription = encodeURIComponent(description)

  const socialPlatforms = [
    {
      name: 'WhatsApp',
      icon: '💬',
      color: 'from-green-500 to-green-600',
      url: `https://wa.me/?text=${shareTitle}%20${shareUrl}`
    },
    {
      name: 'Twitter',
      icon: '🐦',
      color: 'from-blue-400 to-blue-500',
      url: `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`
    },
    {
      name: 'Facebook',
      icon: '📘',
      color: 'from-blue-600 to-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      color: 'from-blue-700 to-blue-800',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: 'from-sky-400 to-sky-500',
      url: `https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`
    },
    {
      name: 'Email',
      icon: '📧',
      color: 'from-gray-500 to-gray-600',
      url: `mailto:?subject=${shareTitle}&body=${shareDescription}%20${shareUrl}`
    }
  ]

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    }
  }

  return (
    <>
      {/* Share Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span className="font-medium">Share</span>
      </button>

      {/* Share Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full animate-scale-in">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-2xl text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">📤 Share</h3>
                    <p className="text-blue-100 text-sm mt-1">Spread the word!</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Preview Card */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
                    {title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {description}
                  </p>
                </div>

                {/* Social Platforms */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {socialPlatforms.map((platform) => (
                    <a
                      key={platform.name}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex flex-col items-center gap-2 p-4 bg-gradient-to-br ${platform.color} rounded-xl text-white hover:shadow-lg transform hover:scale-105 transition-all`}
                    >
                      <span className="text-3xl">{platform.icon}</span>
                      <span className="text-xs font-medium">{platform.name}</span>
                    </a>
                  ))}
                </div>

                {/* Copy Link */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Or copy link
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={url}
                      readOnly
                      className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm"
                    />
                    <button
                      onClick={copyToClipboard}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        copied
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {copied ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Native Share (if available) */}
                {navigator.share && (
                  <button
                    onClick={handleNativeShare}
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    📱 More sharing options
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
