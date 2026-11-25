import React, { useState, useEffect } from 'react';
import api from '../../services/api';

interface NotificationPreference {
  id: number;
  phoneNumber: string | null;
  phoneVerified: boolean;
  smsEnabled: boolean;
  whatsappEnabled: boolean;
  emailEnabled: boolean;
  webPushEnabled: boolean;
  notifyIssueCreated: boolean;
  notifyIssueUpdated: boolean;
  notifyIssueResolved: boolean;
  notifyIssueAssigned: boolean;
  notifyCommentAdded: boolean;
  notifyCriticalAlerts: boolean;
}

const NotificationPreferencesPage: React.FC = () => {
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verifyMethod, setVerifyMethod] = useState<'sms' | 'whatsapp'>('sms');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [twilioEnabled, setTwilioEnabled] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadPreferences();
    checkTwilioStatus();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await api.get('/preferences/notifications');
      setPreferences(response.data);
      if (response.data.phoneNumber) {
        setPhoneNumber(response.data.phoneNumber);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkTwilioStatus = async () => {
    try {
      const response = await api.get('/preferences/notifications/twilio-status');
      setTwilioEnabled(response.data.enabled);
    } catch (error) {
      console.error('Failed to check Twilio status:', error);
    }
  };

  const handleSendOtp = async () => {
    try {
      const response = await api.post('/preferences/notifications/verify-phone/send-otp', {
        phoneNumber,
        method: verifyMethod
      });

      if (response.data.success) {
        setOtpSent(true);
        setMessage({ type: 'success', text: 'OTP sent successfully!' });
      } else {
        setMessage({ type: 'error', text: response.data.message });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to send OTP' });
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await api.post('/preferences/notifications/verify-phone/verify', {
        phoneNumber,
        otp
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Phone verified successfully!' });
        setOtpSent(false);
        setOtp('');
        loadPreferences();
      } else {
        setMessage({ type: 'error', text: response.data.message });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to verify OTP' });
    }
  };

  const handleSavePreferences = async () => {
    if (!preferences) return;

    setSaving(true);
    try {
      await api.put('/preferences/notifications', preferences);
      setMessage({ type: 'success', text: 'Preferences saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save preferences' });
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key: keyof NotificationPreference, value: boolean) => {
    if (!preferences) return;
    setPreferences({ ...preferences, [key]: value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Notification Preferences</h1>
      <p className="text-gray-600 mb-8">
        Choose how you want to receive notifications about your issues
      </p>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Phone Verification Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>📱</span> Phone Number Verification
        </h2>

        {!twilioEnabled && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ SMS and WhatsApp notifications are currently disabled. Contact your administrator to enable these features.
            </p>
          </div>
        )}

        {preferences?.phoneVerified ? (
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-medium text-green-900">Phone Verified</p>
                <p className="text-sm text-green-700">{preferences.phoneNumber}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={!twilioEnabled}
              />
              <p className="mt-1 text-xs text-gray-500">
                Include country code (e.g., +91 for India)
              </p>
            </div>

            {!otpSent ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Method
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setVerifyMethod('sms')}
                      className={`px-4 py-2 rounded-lg border-2 ${
                        verifyMethod === 'sms'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                      disabled={!twilioEnabled}
                    >
                      💬 SMS
                    </button>
                    <button
                      type="button"
                      onClick={() => setVerifyMethod('whatsapp')}
                      className={`px-4 py-2 rounded-lg border-2 ${
                        verifyMethod === 'whatsapp'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200'
                      }`}
                      disabled={!twilioEnabled}
                    >
                      📱 WhatsApp
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSendOtp}
                  disabled={!phoneNumber || !twilioEnabled}
                  className="px-6 py-3 bg-royal-600 text-white rounded-xl hover:bg-royal-700 disabled:bg-navy-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                >
                  Send Verification Code
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter 6-digit OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-xl tracking-widest"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleVerifyOtp}
                    disabled={otp.length !== 6}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notification Channels */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Channels</h2>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💬</span>
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via text message</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences?.smsEnabled || false}
              onChange={(e) => updatePreference('smsEnabled', e.target.checked)}
              disabled={!preferences?.phoneVerified}
              className="w-5 h-5 text-blue-600"
            />
          </label>

          <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <p className="font-medium">WhatsApp Notifications</p>
                <p className="text-sm text-gray-500">Receive updates on WhatsApp</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences?.whatsappEnabled || false}
              onChange={(e) => updatePreference('whatsappEnabled', e.target.checked)}
              disabled={!preferences?.phoneVerified}
              className="w-5 h-5 text-blue-600"
            />
          </label>

          <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📧</span>
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences?.emailEnabled || false}
              onChange={(e) => updatePreference('emailEnabled', e.target.checked)}
              className="w-5 h-5 text-blue-600"
            />
          </label>

          <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔔</span>
              <div>
                <p className="font-medium">Web Push Notifications</p>
                <p className="text-sm text-gray-500">Real-time browser notifications</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={preferences?.webPushEnabled || false}
              onChange={(e) => updatePreference('webPushEnabled', e.target.checked)}
              className="w-5 h-5 text-blue-600"
            />
          </label>
        </div>
      </div>

      {/* Notification Types */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Types</h2>

        <div className="space-y-3">
          {[
            { key: 'notifyIssueCreated', label: 'New Issues', desc: 'When a new issue is reported' },
            { key: 'notifyIssueUpdated', label: 'Issue Updates', desc: 'When an issue status changes' },
            { key: 'notifyIssueResolved', label: 'Issue Resolved', desc: 'When an issue is marked as resolved' },
            { key: 'notifyIssueAssigned', label: 'Issue Assigned', desc: 'When an issue is assigned to you' },
            { key: 'notifyCommentAdded', label: 'New Comments', desc: 'When someone comments on your issue' },
            { key: 'notifyCriticalAlerts', label: 'Critical Alerts', desc: 'Urgent notifications (always enabled for SMS/WhatsApp)' },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={preferences?.[item.key as keyof NotificationPreference] as boolean || false}
                onChange={(e) => updatePreference(item.key as keyof NotificationPreference, e.target.checked)}
                className="w-5 h-5 text-blue-600"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSavePreferences}
          disabled={saving}
          className="px-8 py-3 bg-royal-600 text-white rounded-xl hover:bg-royal-700 disabled:bg-royal-300 font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};

export default NotificationPreferencesPage;
