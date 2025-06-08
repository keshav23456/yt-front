import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Input, Loading } from '../../components/common';
import { updateUserAccount, updateUserAvatar, updateUserCoverImage } from '../../services/user.service';
import { updateUser } from '../../store/slices/authSlice';
import { validateEmail, validateName } from '../../utils/validators';
import { showToast } from '../../utils/helpers';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    description: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        username: user.username || '',
        description: user.description || ''
      });
      setAvatarPreview(user.avatar || '');
      setCoverImagePreview(user.coverImage || '');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setHasChanges(true);
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({
          ...prev,
          avatar: 'Avatar image must be less than 5MB'
        }));
        return;
      }
      
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setHasChanges(true);
      
      if (errors.avatar) {
        setErrors(prev => ({
          ...prev,
          avatar: ''
        }));
      }
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setErrors(prev => ({
          ...prev,
          coverImage: 'Cover image must be less than 10MB'
        }));
        return;
      }
      
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setHasChanges(true);
      
      if (errors.coverImage) {
        setErrors(prev => ({
          ...prev,
          coverImage: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!validateName(formData.fullName)) {
      newErrors.fullName = 'Full name is required and must be at least 2 characters';
    }
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Update account details
      const accountResponse = await updateUserAccount({
        fullName: formData.fullName,
        email: formData.email
      });
      
      if (accountResponse.success) {
        dispatch(updateUser(accountResponse.data.user));
        showToast.success('Profile updated successfully');
      }
      
      // Update avatar if changed
      if (avatarFile) {
        const avatarResponse = await updateUserAvatar(avatarFile);
        if (avatarResponse.success) {
          dispatch(updateUser(avatarResponse.data.user));
          showToast.success('Avatar updated successfully');
        }
      }
      
      // Update cover image if changed
      if (coverImageFile) {
        const coverResponse = await updateUserCoverImage(coverImageFile);
        if (coverResponse.success) {
          dispatch(updateUser(coverResponse.data.user));
          showToast.success('Cover image updated successfully');
        }
      }
      
      setHasChanges(false);
      setAvatarFile(null);
      setCoverImageFile(null);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        // Reset form
        setFormData({
          fullName: user.fullName || '',
          email: user.email || '',
          username: user.username || '',
          description: user.description || ''
        });
        setAvatarPreview(user.avatar || '');
        setCoverImagePreview(user.coverImage || '');
        setAvatarFile(null);
        setCoverImageFile(null);
        setHasChanges(false);
        setErrors({});
      }
    } else {
      navigate(-1);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account settings and profile information</p>
          </div>
          <Button onClick={() => navigate(`/channel/${user.username}`)} variant="outline">
            View Channel
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Cover Image Section */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cover Image</h2>
              <div className="relative">
                <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                  {coverImagePreview ? (
                    <img
                      src={coverImagePreview}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-4 right-4">
                  <label className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer shadow-sm">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="sr-only"
                    />
                    Change Cover
                  </label>
                </div>
              </div>
              {errors.coverImage && (
                <p className="mt-2 text-sm text-red-600">{errors.coverImage}</p>
              )}
            </div>
          </div>

          {/* Avatar and Basic Info */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Picture</h2>
            
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative">
                <img
                  src={avatarPreview || '/assets/default-avatar.png'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700 shadow-lg">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="sr-only"
                  />
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{formData.fullName}</h3>
                <p className="text-gray-600">@{formData.username}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Choose a profile picture that represents you or your brand
                </p>
              </div>
            </div>
            
            {errors.avatar && (
              <p className="text-sm text-red-600 mb-4">{errors.avatar}</p>
            )}
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  error={errors.fullName}
                  required
                />
              </div>
              
              <div>
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required
                />
              </div>
              
              <div>
                <Input
                  label="Username"
                  name="username"
                  value={formData.username}
                  disabled
                  helperText="Username cannot be changed"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Channel Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell viewers about your channel..."
              />
              <p className="mt-2 text-sm text-gray-500">
                Describe what your channel is about and what viewers can expect
              </p>
            </div>
          </div>

          {/* Account Stats */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Statistics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {user.subscribersCount || 0}
                </div>
                <div className="text-sm text-gray-600">Subscribers</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {user.videosCount || 0}
                </div>
                <div className="text-sm text-gray-600">Videos</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {user.totalViews || 0}
                </div>
                <div className="text-sm text-gray-600">Total Views</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            
            <div className="flex items-center space-x-4">
              {hasChanges && (
                <span className="text-sm text-orange-600 font-medium">
                  You have unsaved changes
                </span>
              )}
              <Button 
                type="submit" 
                disabled={loading || !hasChanges}
                className="flex items-center space-x-2"
              >
                {loading && <Loading size="sm" />}
                <span>Save Changes</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;