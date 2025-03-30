// src/pages/dashboard/UserProfile.jsx
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaShieldAlt, FaKey, FaWallet, FaBuilding, FaEdit } from 'react-icons/fa';
import CompanyLayout from '../../components/layout/CompanyLayout';
import ResearcherLayout from '../../components/layout/ResearcherLayout';
import { profileService } from '../../services/profile.service';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isCompany = user?.role === 'company';
  
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
    const LoadingContent = (
      <div className="flex justify-center items-center py-20">
        <div className="loader"></div>
      </div>
    );
    
    return isCompany ? (
      <CompanyLayout>{LoadingContent}</CompanyLayout>
    ) : (
      <ResearcherLayout>{LoadingContent}</ResearcherLayout>
    );
  }
  
  if (!profile) {
    const ErrorContent = (
      <div className="bg-gray-900/30 backdrop-blur-sm border border-emerald-900/30 rounded-lg p-8 text-center">
        <p className="text-xl text-gray-400">Failed to load profile data. Please try again later.</p>
      </div>
    );
    
    return isCompany ? (
      <CompanyLayout>{ErrorContent}</CompanyLayout>
    ) : (
      <ResearcherLayout>{ErrorContent}</ResearcherLayout>
    );
  }
  
  // Profile content - shared between both layouts
  const profileContent = (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-gray-400 mt-1">Manage your account details and settings</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="bg-gray-900/30 backdrop-blur-sm border border-emerald-900/30 rounded-lg overflow-hidden p-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-emerald-900/20 flex items-center justify-center mb-4 border border-emerald-800/30">
              <FaUser className="text-emerald-400 text-4xl" />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{profile.name}</h2>
            <p className="text-gray-400 mb-4">{profile.email}</p>
            <div className="py-2 px-4 bg-emerald-900/20 rounded-full text-sm text-emerald-400 font-medium border border-emerald-800/30">
              {isCompany ? 'Company Account' : 'Researcher Account'}
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="font-medium text-white mb-4">Account Information</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-300">
                <div className="mr-3 p-2 bg-gray-800 rounded-full">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <span>{profile.email}</span>
              </li>
              <li className="flex items-center text-gray-300">
                <div className="mr-3 p-2 bg-gray-800 rounded-full">
                  <FaShieldAlt className="text-gray-400" />
                </div>
                <span>Role: {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}</span>
              </li>
              <li className="flex items-center text-gray-300">
                <div className="mr-3 p-2 bg-gray-800 rounded-full">
                  <FaBuilding className="text-gray-400" />
                </div>
                <span>Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Details Card */}
        <div className="bg-gray-900/30 backdrop-blur-sm border border-emerald-900/30 rounded-lg overflow-hidden p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Account Details</h2>
            <button className="px-3 py-1.5 bg-emerald-900/20 text-emerald-400 rounded-md border border-emerald-800/30 text-sm hover:bg-emerald-900/40 transition-colors">
              <FaEdit className="inline mr-2" /> Edit Profile
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium text-white mb-3">Personal Information</h3>
              <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Full Name</p>
                    <p className="text-gray-200 mt-1">{profile.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email Address</p>
                    <p className="text-gray-200 mt-1">{profile.email}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {isCompany && (
              <div>
                <h3 className="text-md font-medium text-white mb-3">Payman Integration</h3>
                <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                  <div className="flex items-start">
                    <div className="mr-4 p-2 rounded-full bg-emerald-900/20 border border-emerald-800/30">
                      <FaKey className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-gray-200 font-medium">
                        {profile.paymanApiKey ? 'API Key is set up' : 'API Key not configured'}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {profile.paymanApiKey 
                          ? 'Your Payman API key is securely stored and ready for use.' 
                          : 'You need to add your Payman API key to post bug bounties.'}
                      </p>
                      <Link 
                        to="/dashboard/company/api-key" 
                        className="text-emerald-400 hover:text-emerald-300 hover:underline inline-block mt-2"
                      >
                        {profile.paymanApiKey ? 'Update API Key' : 'Configure API Key'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!isCompany && (
              <div>
                <h3 className="text-md font-medium text-white mb-3">Payment Information</h3>
                <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                  <div className="flex items-start">
                    <div className="mr-4 p-2 rounded-full bg-emerald-900/20 border border-emerald-800/30">
                      <FaWallet className="text-emerald-400" />
                    </div>
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
              <h3 className="text-md font-medium text-white mb-3">Account Security</h3>
              <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-200">Password Protection</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Your password is securely hashed and stored. For security reasons, passwords can only be reset, not viewed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-white mb-3">Notifications</h3>
              <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Email notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Bug {isCompany ? 'submissions' : 'listings'}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Payment notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  
  // Render with the appropriate layout based on user role
  return isCompany ? (
    <CompanyLayout>{profileContent}</CompanyLayout>
  ) : (
    <ResearcherLayout>{profileContent}</ResearcherLayout>
  );
};

export default UserProfile;