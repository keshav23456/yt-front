import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../store/slices/authSlice';

import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { updateAccountDetails,updateAvatar,updateCoverImage,changePassword } from '../../services';


const Settings = () => {
  const dispatch = useDispatch();
  const { user, loading: authLoading } = useSelector(state => state.auth);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    username: ''
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // File upload states
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [coverPreview, setCoverPreview] = useState('');

  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || '',
        email: user.email || '',
        username: user.username || ''
      });
      setAvatarPreview(user.avatar || '');
      setCoverPreview(user.coverImage || '');
    }
  }, [user]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await updateAccountDetails(profileForm);
      if (response.success) {
        dispatch(updateUser(response.data));
        showMessage('success', 'Profile updated successfully!');
      } else {
        showMessage('error', 'Failed to update profile');
      }
    } catch (error) {
      showMessage('error', 'Error updating profile');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      
      if (response.success) {
        setPasswordForm({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        showMessage('success', 'Password changed successfully!');
      } else {
        showMessage('error', response.message || 'Failed to change password');
      }
    } catch (error) {
      showMessage('error', 'Error changing password');
      console.error('Password change error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setCoverPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    
    try {
      const response = await updateAvatar(formData);
      if (response.success) {
        dispatch(updateUser(response.data));
        setAvatarFile(null);
        showMessage('success', 'Avatar updated successfully!');
      } else {
        showMessage('error', 'Failed to update avatar');
      }
    } catch (error) {
      showMessage('error', 'Error updating avatar');
      console.error('Avatar update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCoverUpload = async () => {
    if (!coverFile) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('coverImage', coverFile);
    
    try {
      const response = await updateCoverImage(formData);
      if (response.success) {
        dispatch(updateUser(response.data));
        setCoverFile(null);
        showMessage('success', 'Cover image updated successfully!');
      } else {
        showMessage('error', 'Failed to update cover image');
      }
    } catch (error) {
      showMessage('error', 'Error updating cover image');
      console.error('Cover update error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <Loading />;

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'password', label: 'Password' },
    { id: 'images', label: 'Images' },
    { id: 'privacy', label: 'Privacy' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({
                      ...profileForm,
                      fullName: e.target.value
                    })}
                    required
                  />
                  
                  <Input
                    label="Username"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({
                      ...profileForm,
                      username: e.target.value
                    })}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                
                <Input
                  label="Email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({
                    ...profileForm,
                    email: e.target.value
                  })}
                  required
                />
                
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full md:w-auto"
                >
                  Update Profile
                </Button>
              </form>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <Input
                  label="Current Password"
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({
                    ...passwordForm,
                    oldPassword: e.target.value
                  })}
                  required
                />
                
                <Input
                  label="New Password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value
                  })}
                  required
                />
                
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value
                  })}
                  required
                />
                
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full md:w-auto"
                >
                  Change Password
                </Button>
              </form>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-8">
                {/* Avatar Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
                  <div className="flex items-center gap-6">
                    <img
                      src={avatarPreview || '/assets/default-avatar.png'}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                    />
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="mb-3"
                      />
                      {avatarFile && (
                        <Button
                          onClick={handleAvatarUpload}
                          loading={loading}
                          size="sm"
                        >
                          Upload Avatar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cover Image Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cover Image</h3>
                  <div className="space-y-4">
                    <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                      {coverPreview ? (
                        <img
                          src={coverPreview}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          No cover image
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="mb-3"
                      />
                      {coverFile && (
                        <Button
                          onClick={handleCoverUpload}
                          loading={loading}
                          size="sm"
                        >
                          Upload Cover Image
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Profile Visibility</h4>
                      <p className="text-sm text-gray-600">Make your profile visible to everyone</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Show Activity Status</h4>
                      <p className="text-sm text-gray-600">Let others see when you're active</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;