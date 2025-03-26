// src/pages/dashboard/UserProfile.jsx
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaShieldAlt, FaWallet, FaKey } from 'react-icons/fa';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { profileService } from '../../services/profile.service';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await profileService.getUserProfile();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  if (loading) {
    return (
      <DashboardLayout userRole={user?.role}>
        <div className="flex items-center justify-center min-h-screen -mt-16">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-gray-400">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!profile) {
    return (
      <DashboardLayout userRole={user?.role}>
        <div className="card text-center py-12">
          <p className="text-xl text-gray-400">Failed to load profile data. Please try again later.</p>
        </div>
      </DashboardLayout>
    );
  }
  
  const isCompany = user?.role === 'company';
  
  return (
    <DashboardLayout userRole={user?.role}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-gray-400 mt-1">Manage your account details and settings</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="card lg:col-span-1">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mb-4">
              <FaUser className="text-gray-300 text-4xl" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{profile.name}</h2>
            <p className="text-gray-400 mb-4">{profile.email}</p>
            <div className="py-2 px-4 bg-gray-800 rounded-full text-sm text-primary font-medium">
              {isCompany ? 'Company Account' : 'Researcher Account'}
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="font-medium text-white mb-4">Account Information</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-300">
                <FaEnvelope className="text-gray-500 mr-3" />
                <span>{profile.email}</span>
              </li>
              <li className="flex items-center text-gray-300">
                <FaShieldAlt className="text-gray-500 mr-3" />
                <span>Role: {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}</span>
              </li>
              <li className="flex items-center text-gray-300">
                <FaUser className="text-gray-500 mr-3" />
                <span>Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Details Card */}
        <div className="card lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-6">Account Details</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium text-white mb-2">Personal Information</h3>
              <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Full Name</p>
                    <p className="text-gray-200">{profile.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email Address</p>
                    <p className="text-gray-200">{profile.email}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {isCompany ? (
              <div>
                <h3 className="text-md font-medium text-white mb-2">Payman Integration</h3>
                <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                  <div className="flex items-start">
                    <FaKey className="text-gray-500 mt-1 mr-3" />
                    <div>
                      <p className="text-gray-200 font-medium">
                        {profile.paymanApiKey ? 'API Key is set up' : 'API Key not configured'}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {profile.paymanApiKey 
                          ? 'Your Payman API key is securely stored.' 
                          : 'You need to add your Payman API key to post bug bounties.'}
                      </p>
                      <Link 
                        to="/dashboard/company/api-key" 
                        className="text-primary hover:underline inline-block mt-2"
                      >
                        {profile.paymanApiKey ? 'Update API Key' : 'Configure API Key'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-md font-medium text-white mb-2">Payment Information</h3>
                <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                  <div className="flex items-start">
                    <FaWallet className="text-gray-500 mt-1 mr-3" />
                    <div>
                      <p className="text-gray-200 font-medium">
                        {profile.walletId ? 'Wallet ID: Connected' : 'Wallet ID: Not set up yet'}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {profile.walletId 
                          ? 'Your wallet ID is set up to receive payments.' 
                          : 'Your wallet ID will be automatically set up when you receive your first payment.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-md font-medium text-white mb-2">Account Security</h3>
              <div className="bg-gray-800 p-4 rounded-md border border-gray-700">
                <p className="text-gray-200">Password Protection</p>
                <p className="text-sm text-gray-400 mt-1">
                  Your password is securely hashed and stored. For security reasons, passwords can only be reset, not viewed.
                </p>
                {/* You could add a password reset button here if you implement that feature */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;