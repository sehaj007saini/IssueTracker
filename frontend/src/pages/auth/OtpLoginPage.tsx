import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const OtpLoginPage: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [channel, setChannel] = useState<'sms' | 'whatsapp'>('sms');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expiryMinutes, setExpiryMinutes] = useState(5);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/otp/request-login', {
        phoneNumber,
        channel
      });

      setSuccess(response.data.message);
      setExpiryMinutes(response.data.expiryMinutes || 5);
      setStep('otp');
    } catch (err: any) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/otp/login', {
        phoneNumber,
        otp
      });

      // Login successful
      login(response.data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/otp/request-login', {
        phoneNumber,
        channel
      });

      setSuccess('OTP resent successfully!');
      setExpiryMinutes(response.data.expiryMinutes || 5);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-sky-100 dark:from-navy-950 dark:to-navy-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-xl p-8 w-full max-w-md border border-navy-200 dark:border-navy-700">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-sky-100 dark:bg-sky-900/30 rounded-2xl mb-4">
            <span className="text-5xl">📱</span>
          </div>
          <h2 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">
            {step === 'phone' ? 'Login with OTP' : 'Enter OTP'}
          </h2>
          <p className="text-navy-600 dark:text-navy-300">
            {step === 'phone' 
              ? 'Enter your phone number to receive OTP' 
              : `We sent a code to ${phoneNumber}`}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-300 rounded-xl text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 text-success-700 dark:text-success-300 rounded-xl text-sm">
            {success}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+919876543210"
                className="w-full px-4 py-3 border-2 border-navy-300 dark:border-navy-600 rounded-xl focus:ring-2 focus:ring-royal-500 focus:border-transparent bg-white dark:bg-navy-700 text-navy-900 dark:text-white transition-all"
                required
                pattern="^\+?[1-9]\d{1,14}$"
              />
              <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">
                Include country code (e.g., +91 for India)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-2">
                Receive OTP via
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="sms"
                    checked={channel === 'sms'}
                    onChange={(e) => setChannel(e.target.value as 'sms')}
                    className="mr-2 text-royal-600 focus:ring-royal-500"
                  />
                  <span className="text-navy-700 dark:text-navy-300">📱 SMS</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="whatsapp"
                    checked={channel === 'whatsapp'}
                    onChange={(e) => setChannel(e.target.value as 'whatsapp')}
                    className="mr-2 text-royal-600 focus:ring-royal-500"
                  />
                  <span className="text-navy-700 dark:text-navy-300">💬 WhatsApp</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-royal-600 text-white py-3 rounded-xl font-semibold hover:bg-royal-700 disabled:bg-navy-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 dark:text-navy-300 mb-2">
                Enter 6-digit OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full px-4 py-3 border-2 border-navy-300 dark:border-navy-600 rounded-xl text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-royal-500 focus:border-transparent bg-white dark:bg-navy-700 text-navy-900 dark:text-white transition-all"
                required
                maxLength={6}
                pattern="\d{6}"
              />
              <p className="mt-2 text-xs text-navy-500 dark:text-navy-400 text-center">
                Code expires in {expiryMinutes} minutes
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-royal-600 text-white py-3 rounded-xl font-semibold hover:bg-royal-700 disabled:bg-navy-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-royal-600 dark:text-royal-400 hover:text-royal-700 dark:hover:text-royal-300 text-sm font-medium"
              >
                Resend OTP
              </button>
              <span className="mx-2 text-navy-400">•</span>
              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                  setError('');
                }}
                className="text-royal-600 dark:text-royal-400 hover:text-royal-700 dark:hover:text-royal-300 text-sm font-medium"
              >
                Change Number
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-navy-600 dark:text-navy-300 hover:text-navy-900 dark:hover:text-white text-sm font-medium"
          >
            ← Back to password login
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpLoginPage;
