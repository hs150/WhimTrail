import { useState, useEffect } from 'react';
import { FaCog, FaUser, FaBell, FaPalette, FaSave } from 'react-icons/fa';
import { useAuthStore, useUserStore } from '../../store/store';
import '../../styles/settings.css';

export default function Settings() {
  const { user } = useAuthStore();
  const { preferences, updatePreferences } = useUserStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: '',
    budget: 'Mid-range',
    interests: []
  });
  const [prefsData, setPrefsData] = useState(preferences);
  const [saved, setSaved] = useState(false);
  const token = localStorage.getItem('token');

  const interests = ['Beaches', 'Mountains', 'History', 'Adventure', 'Food', 'Culture', 'Nature', 'Nightlife', 'Spiritual'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleSavePreferences = async () => {
    try {
      await updatePreferences(token, prefsData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <div className="settings-container" style={{ marginTop: '80px' }}>
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      {saved && <div className="success-message">✅ Saved successfully!</div>}

      <div className="settings-layout">
        {/* Sidebar Tabs */}
        <div className="settings-sidebar">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser /> Profile
          </button>
          <button
            className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <FaCog /> Preferences
          </button>
          <button
            className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <FaBell /> Notifications
          </button>
          <button
            className={`tab-btn ${activeTab === 'theme' ? 'active' : ''}`}
            onClick={() => setActiveTab('theme')}
          >
            <FaPalette /> Theme
          </button>
        </div>

        {/* Content */}
        <div className="settings-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>Profile Information</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group form-full">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                  />
                </div>

                <div className="form-group form-full">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    placeholder="Tell us about yourself..."
                    rows="4"
                    value={formData.bio}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Budget Preference</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                  >
                    <option>Budget</option>
                    <option>Mid-range</option>
                    <option>Luxury</option>
                  </select>
                </div>
              </div>

              <div className="interests-section">
                <label>Travel Interests</label>
                <div className="interests-grid">
                  {interests.map(interest => (
                    <button
                      key={interest}
                      className={`interest-btn ${formData.interests.includes(interest) ? 'selected' : ''}`}
                      onClick={() => handleInterestToggle(interest)}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <button className="btn-save" onClick={handleSaveProfile}>
                <FaSave /> Save Profile
              </button>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="settings-section">
              <h2>Travel Preferences</h2>

              <div className="pref-item">
                <label>Currency</label>
                <select
                  value={prefsData.currency}
                  onChange={(e) => setPrefsData({ ...prefsData, currency: e.target.value })}
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                  <option>INR</option>
                  <option>AUD</option>
                </select>
              </div>

              <div className="pref-item">
                <label>Language</label>
                <select
                  value={prefsData.language}
                  onChange={(e) => setPrefsData({ ...prefsData, language: e.target.value })}
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Hindi</option>
                </select>
              </div>

              <button className="btn-save" onClick={handleSavePreferences}>
                <FaSave /> Save Preferences
              </button>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Settings</h2>

              <div className="notification-item">
                <div className="notification-info">
                  <h3>Email Notifications</h3>
                  <p>Receive email updates about your trips and recommendations</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={prefsData.notifications?.email}
                    onChange={(e) => setPrefsData({
                      ...prefsData,
                      notifications: { ...prefsData.notifications, email: e.target.checked }
                    })}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="notification-item">
                <div className="notification-info">
                  <h3>Push Notifications</h3>
                  <p>Get real-time alerts and messages</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={prefsData.notifications?.push}
                    onChange={(e) => setPrefsData({
                      ...prefsData,
                      notifications: { ...prefsData.notifications, push: e.target.checked }
                    })}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <button className="btn-save" onClick={handleSavePreferences}>
                <FaSave /> Save Settings
              </button>
            </div>
          )}

          {/* Theme Tab */}
          {activeTab === 'theme' && (
            <div className="settings-section">
              <h2>Theme Settings</h2>

              <div className="theme-grid">
                <button
                  className={`theme-btn ${prefsData.theme === 'light' ? 'active' : ''}`}
                  onClick={() => setPrefsData({ ...prefsData, theme: 'light' })}
                >
                  <div className="theme-preview light"></div>
                  <p>Light Mode</p>
                </button>

                <button
                  className={`theme-btn ${prefsData.theme === 'dark' ? 'active' : ''}`}
                  onClick={() => setPrefsData({ ...prefsData, theme: 'dark' })}
                >
                  <div className="theme-preview dark"></div>
                  <p>Dark Mode</p>
                </button>
              </div>

              <button className="btn-save" onClick={handleSavePreferences}>
                <FaSave /> Save Theme
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
