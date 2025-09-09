import React, { useState, useEffect } from 'react';
import { 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaShieldAlt, 
  FaCog, 
  FaTrash,
  FaDownload,
  FaKey
} from 'react-icons/fa';

interface PrivacySettings {
  endToEndEncryption: boolean;
  showLastSeen: 'everyone' | 'contacts' | 'nobody';
  showProfile: 'everyone' | 'contacts' | 'nobody';
  showAbout: 'everyone' | 'contacts' | 'nobody';
  readReceipts: boolean;
  disappearingMessages: {
    enabled: boolean;
    defaultTimer: number; // in hours
  };
  dataCollection: {
    analytics: boolean;
    crashReports: boolean;
    diagnostics: boolean;
  };
  twoFactorAuth: boolean;
  blockedUsers: string[];
}

const PrivacySettingsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [settings, setSettings] = useState<PrivacySettings>({
    endToEndEncryption: true,
    showLastSeen: 'contacts',
    showProfile: 'contacts',
    showAbout: 'contacts',
    readReceipts: true,
    disappearingMessages: {
      enabled: false,
      defaultTimer: 24
    },
    dataCollection: {
      analytics: false,
      crashReports: true,
      diagnostics: true
    },
    twoFactorAuth: false,
    blockedUsers: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('privacy');

  useEffect(() => {
    if (isOpen) {
      loadPrivacySettings();
    }
  }, [isOpen]);

  const loadPrivacySettings = async () => {
    try {
      const response = await fetch('/api/user/privacy-settings');
      const data = await response.json();
      setSettings(data.settings);
    } catch (error) {
      console.error('Failed to load privacy settings:', error);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/user/privacy-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      console.log('Privacy settings updated successfully');
    } catch (error) {
      console.error('Failed to update privacy settings');
      console.error('Failed to save settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async () => {
    try {
      const response = await fetch('/api/user/export-data', {
        method: 'POST',
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'linkup-data-export.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      console.log('Data export started. Download will begin shortly.');
    } catch (error) {
      console.error('Failed to export data');
      console.error('Export failed:', error);
    }
  };

  const deleteAccount = async () => {
    const confirmation = window.prompt(
      'Are you sure? This will permanently delete your account and all data. Type "DELETE" to confirm:'
    );
    
    if (confirmation === 'DELETE') {
      try {
        await fetch('/api/user/delete-account', {
          method: 'DELETE',
        });
        console.log('Account deletion initiated. You will be logged out.');
        // Handle logout logic here
      } catch (error) {
        console.error('Failed to delete account');
        console.error('Delete failed:', error);
      }
    }
  };

  const VisibilitySelector = ({ 
    value, 
    onChange, 
    label 
  }: { 
    value: string; 
    onChange: (value: 'everyone' | 'contacts' | 'nobody') => void; 
    label: string;
  }) => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="space-y-2">
        {[
          { value: 'everyone', label: 'Everyone', icon: FaEye },
          { value: 'contacts', label: 'My Contacts', icon: FaEye },
          { value: 'nobody', label: 'Nobody', icon: FaEyeSlash }
        ].map(({ value: optionValue, label: optionLabel, icon: Icon }) => (
          <label key={optionValue} className="flex items-center">
            <input
              type="radio"
              value={optionValue}
              checked={value === optionValue}
              onChange={(e) => onChange(e.target.value as 'everyone' | 'contacts' | 'nobody')}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <Icon className="ml-3 mr-2 text-gray-500" />
            <span className="text-sm text-gray-700">{optionLabel}</span>
          </label>
        ))}
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-gray-50 rounded-l-lg p-4 border-r">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Privacy & Security</h2>
          <nav className="space-y-2">
            {[
              { id: 'privacy', label: 'Privacy Controls', icon: FaEye },
              { id: 'encryption', label: 'Encryption', icon: FaLock },
              { id: 'data', label: 'Data & Storage', icon: FaShieldAlt },
              { id: 'security', label: 'Security', icon: FaKey },
              { id: 'account', label: 'Account Actions', icon: FaCog }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center px-4 py-2 text-left rounded-lg ${
                  activeSection === id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="mr-3" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {activeSection === 'privacy' && 'Privacy Controls'}
              {activeSection === 'encryption' && 'End-to-End Encryption'}
              {activeSection === 'data' && 'Data & Storage'}
              {activeSection === 'security' && 'Security Settings'}
              {activeSection === 'account' && 'Account Actions'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Privacy Controls Section */}
          {activeSection === 'privacy' && (
            <div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-2">🛡️ Privacy First Promise</h4>
                <p className="text-blue-700 text-sm">
                  LinkUp is built with privacy as the foundation. Your data stays yours, 
                  we never sell it, and all communications are encrypted by default.
                </p>
              </div>

              <VisibilitySelector
                value={settings.showLastSeen}
                onChange={(value) => setSettings(prev => ({ ...prev, showLastSeen: value }))}
                label="Who can see when you were last online?"
              />

              <VisibilitySelector
                value={settings.showProfile}
                onChange={(value) => setSettings(prev => ({ ...prev, showProfile: value }))}
                label="Who can see your profile photo?"
              />

              <VisibilitySelector
                value={settings.showAbout}
                onChange={(value) => setSettings(prev => ({ ...prev, showAbout: value }))}
                label="Who can see your About/Bio?"
              />

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.readReceipts}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      readReceipts: e.target.checked 
                    }))}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Send read receipts (let others know when you've read their messages)
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Encryption Section */}
          {activeSection === 'encryption' && (
            <div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  <FaLock className="text-green-600 mr-2" />
                  <h4 className="font-semibold text-green-800">End-to-End Encryption Active</h4>
                </div>
                <p className="text-green-700 text-sm">
                  All your messages, calls, and media are automatically encrypted. Only you and 
                  the people you're communicating with can read or listen to them.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-800 mb-2">How It Works</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Messages are encrypted on your device before being sent</li>
                    <li>• Only the recipient's device can decrypt and read the messages</li>
                    <li>• LinkUp servers cannot access your message content</li>
                    <li>• Each conversation has unique encryption keys</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h5 className="font-medium text-gray-800 mb-3">Disappearing Messages</h5>
                  <label className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      checked={settings.disappearingMessages.enabled}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        disappearingMessages: {
                          ...prev.disappearingMessages,
                          enabled: e.target.checked
                        }
                      }))}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      Enable disappearing messages by default
                    </span>
                  </label>

                  {settings.disappearingMessages.enabled && (
                    <div className="ml-7">
                      <label className="block text-sm text-gray-600 mb-2">
                        Default timer for new chats:
                      </label>
                      <select
                        value={settings.disappearingMessages.defaultTimer}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          disappearingMessages: {
                            ...prev.disappearingMessages,
                            defaultTimer: parseInt(e.target.value)
                          }
                        }))}
                        className="form-select text-sm border-gray-300 rounded"
                      >
                        <option value={1}>1 hour</option>
                        <option value={24}>24 hours</option>
                        <option value={168}>7 days</option>
                        <option value={720}>30 days</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Data & Storage Section */}
          {activeSection === 'data' && (
            <div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-yellow-800 mb-2">📊 Data Collection</h4>
                <p className="text-yellow-700 text-sm">
                  We collect minimal data to improve your experience. You can control what's shared.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <h5 className="font-medium text-gray-800">Optional Data Sharing</h5>
                
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={settings.dataCollection.analytics}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      dataCollection: {
                        ...prev.dataCollection,
                        analytics: e.target.checked
                      }
                    }))}
                    className="form-checkbox h-4 w-4 text-blue-600 mt-1"
                  />
                  <div className="ml-3">
                    <span className="text-sm font-medium text-gray-700">Anonymous Usage Analytics</span>
                    <p className="text-xs text-gray-500 mt-1">
                      Helps us understand which features are most useful (no personal data)
                    </p>
                  </div>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={settings.dataCollection.crashReports}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      dataCollection: {
                        ...prev.dataCollection,
                        crashReports: e.target.checked
                      }
                    }))}
                    className="form-checkbox h-4 w-4 text-blue-600 mt-1"
                  />
                  <div className="ml-3">
                    <span className="text-sm font-medium text-gray-700">Crash Reports</span>
                    <p className="text-xs text-gray-500 mt-1">
                      Automatically send crash reports to help us fix bugs faster
                    </p>
                  </div>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={settings.dataCollection.diagnostics}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      dataCollection: {
                        ...prev.dataCollection,
                        diagnostics: e.target.checked
                      }
                    }))}
                    className="form-checkbox h-4 w-4 text-blue-600 mt-1"
                  />
                  <div className="ml-3">
                    <span className="text-sm font-medium text-gray-700">Performance Diagnostics</span>
                    <p className="text-xs text-gray-500 mt-1">
                      Share performance data to help optimize the app
                    </p>
                  </div>
                </label>
              </div>

              <div className="border-t pt-6">
                <h5 className="font-medium text-gray-800 mb-4">Your Data Rights</h5>
                <div className="space-y-3">
                  <button
                    onClick={exportData}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <FaDownload className="mr-2" />
                    Export My Data
                  </button>
                  <p className="text-xs text-gray-500">
                    Download all your data in a portable format (messages, media, contacts)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <div>
              <div className="mb-6">
                <h5 className="font-medium text-gray-800 mb-3">Two-Factor Authentication</h5>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      twoFactorAuth: e.target.checked 
                    }))}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Enable two-factor authentication for additional security
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-2 ml-7">
                  Adds an extra layer of security when logging in from new devices
                </p>
              </div>

              <div className="mb-6">
                <h5 className="font-medium text-gray-800 mb-3">Active Sessions</h5>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    View and manage all devices where you're currently logged in
                  </p>
                  <button className="mt-2 text-blue-600 text-sm hover:text-blue-700">
                    Manage Active Sessions →
                  </button>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-800 mb-3">Blocked Users</h5>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    {settings.blockedUsers.length === 0 
                      ? 'No blocked users' 
                      : `${settings.blockedUsers.length} blocked user(s)`
                    }
                  </p>
                  <button className="mt-2 text-blue-600 text-sm hover:text-blue-700">
                    Manage Blocked Users →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Account Actions Section */}
          {activeSection === 'account' && (
            <div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-red-800 mb-2">⚠️ Danger Zone</h4>
                <p className="text-red-700 text-sm">
                  These actions are permanent and cannot be undone.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Delete Account</h5>
                  <p className="text-sm text-gray-600 mb-4">
                    This will permanently delete your account and all associated data including:
                  </p>
                  <ul className="text-sm text-gray-600 mb-4 ml-4">
                    <li>• All messages and media</li>
                    <li>• Contact list and groups</li>
                    <li>• Profile information</li>
                    <li>• Call history</li>
                  </ul>
                  <button
                    onClick={deleteAccount}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <FaTrash className="mr-2" />
                    Delete My Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end mt-8 pt-6 border-t">
            <div className="space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveSettings}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettingsModal;
