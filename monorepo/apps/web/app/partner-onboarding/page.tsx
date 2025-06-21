'use client';
import React, { useState, useEffect } from "react";
import MyCustomComponent from '../../components/FLoatingDock';
import { Calendar, MapPin, Users, Gift, Settings, BarChart3, Shield, Upload, CheckCircle, AlertCircle, TrendingUp, DollarSign, Star, Globe, Zap, Bell } from "lucide-react";

export default function MetaMilesPartnerSystem() {
  const [currentStep, setCurrentStep] = useState(0);
  const [partners, setPartners] = useState([]);
  const [perks, setPerks] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalRedemptions: 0,
    activeUsers: 0,
    revenue: 0,
    engagement: 0
  });
  const [notifications, setNotifications] = useState([]);

  // Sample data initialization
  useEffect(() => {
    setPartners([
      { id: 1, name: "Downtown Cafe", type: "Restaurant", status: "verified", tier: "Gold", location: "San Francisco" },
      { id: 2, name: "Tech Conference 2024", type: "Event", status: "pending", tier: "Silver", location: "New York" },
      { id: 3, name: "CryptoDAO", type: "DAO", status: "verified", tier: "Bronze", location: "Global" }
    ]);

    setPerks([
      { id: 1, title: "Free Coffee", partner: "Downtown Cafe", region: "SF", threshold: 100, claimed: 45, total: 100 },
      { id: 2, title: "VIP Access", partner: "Tech Conference 2024", region: "NYC", threshold: 500, claimed: 12, total: 50 },
      { id: 3, title: "Governance Token", partner: "CryptoDAO", region: "Global", threshold: 1000, claimed: 78, total: 200 }
    ]);

    setAnalytics({
      totalRedemptions: 1250,
      activeUsers: 890,
      revenue: 45600,
      engagement: 73
    });

    setNotifications([
      { id: 1, type: "success", message: "New partner Downtown Cafe verified", time: "2 hours ago" },
      { id: 2, type: "info", message: "Perk threshold reached for VIP Access", time: "4 hours ago" },
      { id: 3, type: "warning", message: "Low inventory alert for Free Coffee perk", time: "6 hours ago" }
    ]);
  }, []);

  // Step 1: Partner Registration Component
  const PartnerRegistration = () => {
    const [formData, setFormData] = useState({
      organizationName: '',
      organizationType: '',
      location: '',
      email: '',
      website: '',
      description: '',
      kycDocument: null
    });
    const [verificationStatus, setVerificationStatus] = useState('pending');
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFormData({ ...formData, kycDocument: file });
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => setVerificationStatus('verified'), 1000);
          }
        }, 200);
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const newPartner = {
        id: partners.length + 1,
        name: formData.organizationName,
        type: formData.organizationType,
        status: verificationStatus,
        tier: 'Bronze',
        location: formData.location,
        email: formData.email,
        website: formData.website
      };
      setPartners([...partners, newPartner]);
      setNotifications([
        { id: Date.now(), type: 'success', message: `New partner ${formData.organizationName} registered`, time: 'Just now' },
        ...notifications
      ]);
    };

    return (
      <div className="space-y-6">
       

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">Organization Details</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Organization Name</label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white"
                  placeholder="Your Organization Name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Organization Type</label>
                <select
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white"
                  required
                >
                  <option value="">Select type...</option>
                  <option value="Restaurant">Restaurant/Hospitality</option>
                  <option value="Event">Event Organizer</option>
                  <option value="DAO">DAO/Community</option>
                  <option value="Brand">Brand/Retailer</option>
                  <option value="Entertainment">Entertainment Venue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Primary Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white"
                  placeholder="City, State/Country"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Contact Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white"
                  placeholder="contact@yourorg.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Website URL</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none text-white"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold py-3 px-6 rounded-lg hover:from-orange-300 hover:to-orange-200 transition-all duration-300"
              >
                Register Partner
              </button>
            </form>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">KYC Verification</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Business License/Registration Document
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id="kyc-upload"
                  />
                  <label
                    htmlFor="kyc-upload"
                    className="cursor-pointer text-blue-400 hover:text-blue-300"
                  >
                    Click to upload or drag and drop
                  </label>
                  <p className="text-gray-500 text-sm mt-2">PDF, JPG, PNG up to 10MB</p>
                </div>
              </div>

              {uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Upload Progress</span>
                    <span className="text-blue-400">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg">
                {verificationStatus === 'verified' ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-yellow-500" />
                )}
                <div>
                  <p className="text-white font-medium">
                    Verification Status: {verificationStatus === 'verified' ? 'Verified' : 'Pending'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {verificationStatus === 'verified' 
                      ? 'Your organization has been verified' 
                      : 'Upload documents to complete verification'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">Registered Partners</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map((partner) => (
              <div key={partner.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{partner.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs ${
                    partner.status === 'verified' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {partner.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-1">{partner.type}</p>
                <div className="flex items-center text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {partner.location}
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Tier:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    partner.tier === 'Gold' ? 'bg-yellow-500/20 text-yellow-400' :
                    partner.tier === 'Silver' ? 'bg-gray-500/20 text-gray-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {partner.tier}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Step 2: Perk Configuration Component
  const PerkConfiguration = () => {
    const [newPerk, setNewPerk] = useState({
      title: '',
      description: '',
      region: '',
      threshold: 100,
      inventory: 50,
      tier: 'Bronze',
      type: 'discount',
      nftCode: '',
      nfcCode: ''
    });
    const [showForm, setShowForm] = useState(false);

    const handleCreatePerk = (e) => {
      e.preventDefault();
      const perk = {
        id: perks.length + 1,
        ...newPerk,
        partner: partners[0]?.name || 'Your Organization',
        claimed: 0,
        total: parseInt(newPerk.inventory)
      };
      setPerks([...perks, perk]);
      setNotifications([
        { id: Date.now(), type: 'success', message: `New perk "${newPerk.title}" created`, time: 'Just now' },
        ...notifications
      ]);
      setNewPerk({
        title: '',
        description: '',
        region: '',
        threshold: 100,
        inventory: 50,
        tier: 'Bronze',
        type: 'discount',
        nftCode: '',
        nfcCode: ''
      });
      setShowForm(false);
    };

    const generateCode = (type) => {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      setNewPerk({
        ...newPerk,
        [type]: code
      });
    };

    return (
      <div className="space-y-6">
       

        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-white">Active Perks</h3>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300"
          >
            Create New Perk
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h4 className="text-lg font-semibold mb-4 text-white">Create New Perk</h4>
            <form onSubmit={handleCreatePerk} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Perk Title</label>
                  <input
                    type="text"
                    value={newPerk.title}
                    onChange={(e) => setNewPerk({ ...newPerk, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-500 focus:outline-none text-white"
                    placeholder="e.g., Free Coffee"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Region</label>
                  <input
                    type="text"
                    value={newPerk.region}
                    onChange={(e) => setNewPerk({ ...newPerk, region: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-500 focus:outline-none text-white"
                    placeholder="e.g., San Francisco"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Spend Threshold ($)</label>
                  <input
                    type="number"
                    value={newPerk.threshold}
                    onChange={(e) => setNewPerk({ ...newPerk, threshold: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-500 focus:outline-none text-white"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Inventory Count</label>
                  <input
                    type="number"
                    value={newPerk.inventory}
                    onChange={(e) => setNewPerk({ ...newPerk, inventory: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-500 focus:outline-none text-white"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tier Requirement</label>
                  <select
                    value={newPerk.tier}
                    onChange={(e) => setNewPerk({ ...newPerk, tier: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-500 focus:outline-none text-white"
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Perk Type</label>
                  <select
                    value={newPerk.type}
                    onChange={(e) => setNewPerk({ ...newPerk, type: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-500 focus:outline-none text-white"
                  >
                    <option value="discount">Discount</option>
                    <option value="freebie">Free Item</option>
                    <option value="access">Special Access</option>
                    <option value="nft">NFT Reward</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={newPerk.description}
                  onChange={(e) => setNewPerk({ ...newPerk, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-500 focus:outline-none text-white"
                  rows="3"
                  placeholder="Describe the perk details..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">NFT Unlock Code</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newPerk.nftCode}
                      onChange={(e) => setNewPerk({ ...newPerk, nftCode: e.target.value })}
                      className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-500 focus:outline-none text-white"
                      placeholder="Enter or generate code"
                    />
                    <button
                      type="button"
                      onClick={() => generateCode('nftCode')}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">NFC Unlock Code</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newPerk.nfcCode}
                      onChange={(e) => setNewPerk({ ...newPerk, nfcCode: e.target.value })}
                      className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-500 focus:outline-none text-white"
                      placeholder="Enter or generate code"
                    />
                    <button
                      type="button"
                      onClick={() => generateCode('nfcCode')}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300"
                >
                  Create Perk
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {perks.map((perk) => (
            <div key={perk.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-white">{perk.title}</h4>
                <Gift className="w-5 h-5 text-green-400" />
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Partner:</span>
                  <span className="text-white">{perk.partner}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Region:</span>
                  <span className="text-white">{perk.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Threshold:</span>
                  <span className="text-white">${perk.threshold}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Claimed:</span>
                  <span className="text-white">{perk.claimed}/{perk.total}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Inventory</span>
                  <span className="text-white">{Math.round((perk.claimed / perk.total) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(perk.claimed / perk.total) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Edit
                </button>
                <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                  Analytics
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Step 3: Integration & Monitoring Component
  const IntegrationMonitoring = () => {
    const [apiKey, setApiKey] = useState('mm_pk_live_...');
    const [webhookUrl, setWebhookUrl] = useState('');
    const [testMode, setTestMode] = useState(true);
    const [isConnected, setIsConnected] = useState(false);

    const generateApiKey = () => {
      const key = `mm_pk_${testMode ? 'test' : 'live'}_${Math.random().toString(36).substring(2, 15)}`;
      setApiKey(key);
    };

    const testConnection = () => {
      setIsConnected(true);
      setNotifications([
        { id: Date.now(), type: 'success', message: 'API connection test successful', time: 'Just now' },
        ...notifications
      ]);
    };

    return (
      <div className="space-y-6">
        

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">API Integration</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Environment:</span>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={testMode}
                    onChange={() => setTestMode(true)}
                    className="text-purple-500"
                  />
                  <span className="text-white">Test</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={!testMode}
                    onChange={() => setTestMode(false)}
                    className="text-purple-500"
                  />
                  <span className="text-white">Live</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={apiKey}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                  <button
                    onClick={generateApiKey}
                    className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Webhook URL</label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                  placeholder="https://yourapp.com/webhook"
                />
              </div>

              

              <button
                onClick={testConnection}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                Test Connection
              </button>
            </div>

            <div className="mt-6 bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">SDK Integration Code</h4>
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`// Initialize MetaMiles SDK
import MetaMiles from 'metamiles-sdk';

const metamiles = new MetaMiles({
  apiKey: '${apiKey}',
  environment: '${testMode ? 'test' : 'production'}'
});

// Validate user tier
const userTier = await metamiles.validateTier(userId);

// Distribute perk
const result = await metamiles.distributePerk({
  userId,
  perkId,
  region: 'SF'
});`}
              </pre>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">Real-time Analytics</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Redemptions</p>
                    <p className="text-2xl font-bold">{analytics.totalRedemptions.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Active Users</p>
                    <p className="text-2xl font-bold">{analytics.activeUsers.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Revenue Impact</p>
                    <p className="text-2xl font-bold">${analytics.revenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Engagement Rate</p>
                    <p className="text-2xl font-bold">{analytics.engagement}%</p>
                  </div>
                  <Star className="w-8 h-8 text-orange-200" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-white">Recent Activity</h4>
              <div className="space-y-2">
                {[
                  { user: 'User #1234', action: 'Claimed Free Coffee', time: '2 min ago', location: 'SF' },
                  { user: 'User #5678', action: 'Reached Gold Tier', time: '5 min ago', location: 'NYC' },
                  { user: 'User #9012', action: 'Redeemed VIP Access', time: '8 min ago', location: 'LA' },
                  { user: 'User #3456', action: 'Claimed Governance Token', time: '12 min ago', location: 'Global' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <div>
                        <p className="text-white text-sm">{activity.user}</p>
                        <p className="text-gray-400 text-xs">{activity.action}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">{activity.time}</p>
                      <p className="text-gray-500 text-xs">{activity.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">Automated Tier Validation & Distribution</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">B</span>
                </div>
                <h4 className="font-semibold text-white">Bronze Tier</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Threshold:</span>
                  <span className="text-white">$0 - $499</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Users:</span>
                  <span className="text-white">450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Perks Available:</span>
                  <span className="text-white">3</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-500/20 to-gray-600/20 border border-gray-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">S</span>
                </div>
                <h4 className="font-semibold text-white">Silver Tier</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Threshold:</span>
                  <span className="text-white">$500 - $1,499</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Users:</span>
                  <span className="text-white">320</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Perks Available:</span>
                  <span className="text-white">7</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">G</span>
                </div>
                <h4 className="font-semibold text-white">Gold Tier</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Threshold:</span>
                  <span className="text-white">$1,500+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Users:</span>
                  <span className="text-white">120</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Perks Available:</span>
                  <span className="text-white">12</span>
                </div>
              </div>
            </div>
          </div>

         
        </div>
      </div>
    );
  };

  // Main Navigation
  const steps = [
    { id: 0, title: "Partner Registration", component: PartnerRegistration, icon: Shield },
    { id: 1, title: "Perk Configuration", component: PerkConfiguration, icon: Settings },
    { id: 2, title: "Integration & Monitoring", component: IntegrationMonitoring, icon: BarChart3 }
  ];

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              
              <div className="flex items-center flex-col">
              <MyCustomComponent/>
              <h1
    className="font-bold text-white mt-8"
    style={{
      fontFamily: "Holtwood One SC, serif",
      fontSize: "2rem",
      letterSpacing: "0.15rem"
    }}
  >
    MetaMiles Partner Portal
  </h1>
                <p className="text-gray-400 text-lg">Manage your rewards ecosystem</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
                {notifications.length > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">{notifications.length}</span>
                  </div>
                )}
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-6">
          <nav className="flex space-x-8">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors ${
                  currentStep === step.id
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <step.icon className="w-5 h-5" />
                <span className="font-medium">{step.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <CurrentStepComponent />
      </div>

      {/* Notifications Panel */}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 w-80 space-y-2 z-50">
          {notifications.slice(0, 3).map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg backdrop-blur-sm border ${
                notification.type === 'success' ? 'bg-green-500/20 border-green-500/30' :
                notification.type === 'warning' ? 'bg-yellow-500/20 border-yellow-500/30' :
                'bg-blue-500/20 border-blue-500/30'
              }`}
            >
              <div className="flex items-start space-x-3">
                {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />}
                {notification.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />}
                {notification.type === 'info' && <Bell className="w-5 h-5 text-blue-400 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-white text-sm">{notification.message}</p>
                  <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}