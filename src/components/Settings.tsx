import React, { useState } from 'react';
import { 
  Settings as SettingsIcon,
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  Image,
  Code,
  Palette,
  Share2,
  Shield,
  Bell,
  CreditCard,
  Truck,
  FileText,
  Eye,
  Upload,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import { useSiteInfo } from '../hooks/useSiteInfo';

const Settings: React.FC = () => {
  const { settings, loading: settingsLoading, updateSettings } = useSettings();
  const { siteInfo, loading: siteLoading, updateSiteInfo } = useSiteInfo();
  const [activeTab, setActiveTab] = useState('general');
  
  const [siteData, setSiteData] = useState({
    site_name: siteInfo?.site_name || '',
    tagline: siteInfo?.tagline || '',
    description: siteInfo?.description || '',
    contact_email: siteInfo?.contact_email || '',
    phone: siteInfo?.phone || '',
    address: siteInfo?.address || '',
    logo_light: siteInfo?.logo_light || '',
    logo_dark: siteInfo?.logo_dark || '',
    favicon: siteInfo?.favicon || '',
    copyright_text: siteInfo?.copyright_text || '',
    google_analytics: siteInfo?.google_analytics || '',
    facebook_pixel: siteInfo?.facebook_pixel || '',
    google_tag_manager: siteInfo?.google_tag_manager || '',
    custom_head_code: siteInfo?.custom_head_code || '',
    custom_footer_code: siteInfo?.custom_footer_code || '',
    maintenance_mode: siteInfo?.maintenance_mode || false,
    maintenance_message: siteInfo?.maintenance_message || '',
    social_icons: siteInfo?.social_icons || []
  });

  const [generalSettings, setGeneralSettings] = useState({
    allow_registration: settings?.allow_registration || true,
    email_notifications: settings?.email_notifications || true,
    comment_moderation: settings?.comment_moderation || true,
    auto_approve_comments: settings?.auto_approve_comments || false,
    posts_per_page: settings?.posts_per_page || 10,
    date_format: settings?.date_format || 'Y-m-d',
    time_format: settings?.time_format || 'H:i',
    timezone: settings?.timezone || 'UTC',
    default_user_role: settings?.default_user_role || 'customer'
  });

  const [ecommerceSettings, setEcommerceSettings] = useState({
    currency: settings?.currency || 'USD',
    currency_symbol: settings?.currency_symbol || '$',
    currency_position: settings?.currency_position || 'left',
    thousand_separator: settings?.thousand_separator || ',',
    decimal_separator: settings?.decimal_separator || '.',
    decimal_places: settings?.decimal_places || 2,
    enable_taxes: settings?.enable_taxes || false,
    tax_rate: settings?.tax_rate || 0,
    enable_shipping: settings?.enable_shipping || true,
    free_shipping_threshold: settings?.free_shipping_threshold || 100,
    default_shipping_cost: settings?.default_shipping_cost || 10,
    enable_coupons: settings?.enable_coupons || true,
    enable_reviews: settings?.enable_reviews || true,
    enable_wishlist: settings?.enable_wishlist || true,
    stock_management: settings?.stock_management || true,
    low_stock_threshold: settings?.low_stock_threshold || 5
  });

  React.useEffect(() => {
    if (siteInfo) {
      setSiteData({
        site_name: siteInfo.site_name || '',
        tagline: siteInfo.tagline || '',
        description: siteInfo.description || '',
        contact_email: siteInfo.contact_email || '',
        phone: siteInfo.phone || '',
        address: siteInfo.address || '',
        logo_light: siteInfo.logo_light || '',
        logo_dark: siteInfo.logo_dark || '',
        favicon: siteInfo.favicon || '',
        copyright_text: siteInfo.copyright_text || '',
        google_analytics: siteInfo.google_analytics || '',
        facebook_pixel: siteInfo.facebook_pixel || '',
        google_tag_manager: siteInfo.google_tag_manager || '',
        custom_head_code: siteInfo.custom_head_code || '',
        custom_footer_code: siteInfo.custom_footer_code || '',
        maintenance_mode: siteInfo.maintenance_mode || false,
        maintenance_message: siteInfo.maintenance_message || '',
        social_icons: siteInfo.social_icons || []
      });
    }
  }, [siteInfo]);

  const handleSiteInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateSiteInfo(siteData);
    if (result.success) {
      alert('Site information updated successfully');
    } else {
      alert(result.error || 'Failed to update site information');
    }
  };

  const handleGeneralSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateSettings(generalSettings);
    if (result.success) {
      alert('General settings updated successfully');
    } else {
      alert(result.error || 'Failed to update settings');
    }
  };

  const handleEcommerceSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateSettings(ecommerceSettings);
    if (result.success) {
      alert('Ecommerce settings updated successfully');
    } else {
      alert(result.error || 'Failed to update ecommerce settings');
    }
  };

  const addSocialIcon = () => {
    setSiteData(prev => ({
      ...prev,
      social_icons: [...prev.social_icons, { platform: '', url: '', icon: '', order: prev.social_icons.length }]
    }));
  };

  const removeSocialIcon = (index: number) => {
    setSiteData(prev => ({
      ...prev,
      social_icons: prev.social_icons.filter((_, i) => i !== index)
    }));
  };

  const updateSocialIcon = (index: number, field: string, value: string) => {
    setSiteData(prev => ({
      ...prev,
      social_icons: prev.social_icons.map((icon, i) => 
        i === index ? { ...icon, [field]: value } : icon
      )
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'site', label: 'Site Info', icon: Globe },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'ecommerce', label: 'Ecommerce', icon: CreditCard },
    { id: 'seo', label: 'SEO & Analytics', icon: Eye },
    { id: 'advanced', label: 'Advanced', icon: Code }
  ];

  if (settingsLoading || siteLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage your site configuration</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl">
        {activeTab === 'general' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">General Settings</h3>
            <form onSubmit={handleGeneralSettingsSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Posts per page
                  </label>
                  <input
                    type="number"
                    value={generalSettings.posts_per_page}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, posts_per_page: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    min="1"
                    max="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default user role
                  </label>
                  <select
                    value={generalSettings.default_user_role}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, default_user_role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="customer">Customer</option>
                    <option value="author">Author</option>
                    <option value="editor">Editor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date format
                  </label>
                  <select
                    value={generalSettings.date_format}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, date_format: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="Y-m-d">2024-01-15</option>
                    <option value="m/d/Y">01/15/2024</option>
                    <option value="d/m/Y">15/01/2024</option>
                    <option value="F j, Y">January 15, 2024</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time format
                  </label>
                  <select
                    value={generalSettings.time_format}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, time_format: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="H:i">24:00</option>
                    <option value="g:i A">12:00 AM</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Allow user registration
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Allow new users to create accounts
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={generalSettings.allow_registration}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, allow_registration: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email notifications
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Send email notifications for important events
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={generalSettings.email_notifications}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, email_notifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Comment moderation
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Require approval for new comments
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={generalSettings.comment_moderation}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, comment_moderation: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save General Settings</span>
              </button>
            </form>
          </div>
        )}

        {activeTab === 'site' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Site Information</h3>
            <form onSubmit={handleSiteInfoSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={siteData.site_name}
                    onChange={(e) => setSiteData({ ...siteData, site_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={siteData.tagline}
                    onChange={(e) => setSiteData({ ...siteData, tagline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Just another CMS site"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={siteData.description}
                  onChange={(e) => setSiteData({ ...siteData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={siteData.contact_email}
                    onChange={(e) => setSiteData({ ...siteData, contact_email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={siteData.phone}
                    onChange={(e) => setSiteData({ ...siteData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Address
                </label>
                <textarea
                  value={siteData.address}
                  onChange={(e) => setSiteData({ ...siteData, address: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Copyright Text
                </label>
                <input
                  type="text"
                  value={siteData.copyright_text}
                  onChange={(e) => setSiteData({ ...siteData, copyright_text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="© 2024 Your Company Name. All rights reserved."
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Maintenance Mode
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Put the site in maintenance mode
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={siteData.maintenance_mode}
                    onChange={(e) => setSiteData({ ...siteData, maintenance_mode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                </label>
              </div>

              {siteData.maintenance_mode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maintenance Message
                  </label>
                  <textarea
                    value={siteData.maintenance_message}
                    onChange={(e) => setSiteData({ ...siteData, maintenance_message: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="We're currently performing scheduled maintenance. Please check back soon."
                  />
                </div>
              )}

              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Site Info</span>
              </button>
            </form>
          </div>
        )}

        {activeTab === 'branding' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Branding</h3>
            <form onSubmit={handleSiteInfoSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Light Logo
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="url"
                      value={siteData.logo_light}
                      onChange={(e) => setSiteData({ ...siteData, logo_light: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Logo URL for light theme"
                    />
                    <button
                      type="button"
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                  {siteData.logo_light && (
                    <div className="mt-2">
                      <img src={siteData.logo_light} alt="Light Logo" className="h-12 object-contain" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dark Logo
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="url"
                      value={siteData.logo_dark}
                      onChange={(e) => setSiteData({ ...siteData, logo_dark: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Logo URL for dark theme"
                    />
                    <button
                      type="button"
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                  {siteData.logo_dark && (
                    <div className="mt-2 bg-gray-900 p-2 rounded">
                      <img src={siteData.logo_dark} alt="Dark Logo" className="h-12 object-contain" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Favicon
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="url"
                    value={siteData.favicon}
                    onChange={(e) => setSiteData({ ...siteData, favicon: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Favicon URL (16x16 or 32x32 pixels)"
                  />
                  <button
                    type="button"
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
                {siteData.favicon && (
                  <div className="mt-2">
                    <img src={siteData.favicon} alt="Favicon" className="w-8 h-8 object-contain" />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Branding</span>
              </button>
            </form>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Social Media</h3>
            <form onSubmit={handleSiteInfoSubmit} className="space-y-6">
              <div className="space-y-4">
                {siteData.social_icons.map((icon, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <select
                      value={icon.platform}
                      onChange={(e) => updateSocialIcon(index, 'platform', e.target.value)}
                      className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Platform</option>
                      <option value="facebook">Facebook</option>
                      <option value="twitter">Twitter</option>
                      <option value="instagram">Instagram</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="youtube">YouTube</option>
                      <option value="tiktok">TikTok</option>
                      <option value="pinterest">Pinterest</option>
                      <option value="github">GitHub</option>
                    </select>
                    <input
                      type="url"
                      value={icon.url}
                      onChange={(e) => updateSocialIcon(index, 'url', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Social media URL"
                    />
                    <button
                      type="button"
                      onClick={() => removeSocialIcon(index)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addSocialIcon}
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Social Icon</span>
              </button>

              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Social Media</span>
              </button>
            </form>
          </div>
        )}

        {activeTab === 'ecommerce' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Ecommerce Settings</h3>
            <form onSubmit={handleEcommerceSettingsSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Currency
                  </label>
                  <select
                    value={ecommerceSettings.currency}
                    onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={ecommerceSettings.currency_symbol}
                    onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, currency_symbol: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={ecommerceSettings.tax_rate}
                    onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, tax_rate: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    step="0.01"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default Shipping Cost
                  </label>
                  <input
                    type="number"
                    value={ecommerceSettings.default_shipping_cost}
                    onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, default_shipping_cost: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Free Shipping Threshold
                  </label>
                  <input
                    type="number"
                    value={ecommerceSettings.free_shipping_threshold}
                    onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, free_shipping_threshold: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    value={ecommerceSettings.low_stock_threshold}
                    onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, low_stock_threshold: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Taxes
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Apply taxes to products
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ecommerceSettings.enable_taxes}
                      onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, enable_taxes: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Shipping
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Calculate shipping costs
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ecommerceSettings.enable_shipping}
                      onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, enable_shipping: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Coupons
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Allow discount codes
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ecommerceSettings.enable_coupons}
                      onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, enable_coupons: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Reviews
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Allow product reviews
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ecommerceSettings.enable_reviews}
                      onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, enable_reviews: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Stock Management
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Track product inventory
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ecommerceSettings.stock_management}
                      onChange={(e) => setEcommerceSettings({ ...ecommerceSettings, stock_management: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Ecommerce Settings</span>
              </button>
            </form>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">SEO & Analytics</h3>
            <form onSubmit={handleSiteInfoSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Google Analytics Tracking ID
                </label>
                <input
                  type="text"
                  value={siteData.google_analytics}
                  onChange={(e) => setSiteData({ ...siteData, google_analytics: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Facebook Pixel ID
                </label>
                <input
                  type="text"
                  value={siteData.facebook_pixel}
                  onChange={(e) => setSiteData({ ...siteData, facebook_pixel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Facebook Pixel ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Google Tag Manager ID
                </label>
                <input
                  type="text"
                  value={siteData.google_tag_manager}
                  onChange={(e) => setSiteData({ ...siteData, google_tag_manager: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="GTM-XXXXXXX"
                />
              </div>

              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save SEO & Analytics</span>
              </button>
            </form>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Advanced Settings</h3>
            <form onSubmit={handleSiteInfoSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Head Code
                </label>
                <textarea
                  value={siteData.custom_head_code}
                  onChange={(e) => setSiteData({ ...siteData, custom_head_code: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                  placeholder="Custom HTML code to be inserted in the <head> section"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Add custom meta tags, CSS, or JavaScript that should be loaded in the head section.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Footer Code
                </label>
                <textarea
                  value={siteData.custom_footer_code}
                  onChange={(e) => setSiteData({ ...siteData, custom_footer_code: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                  placeholder="Custom HTML code to be inserted before the closing </body> tag"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Add custom JavaScript, tracking codes, or other scripts that should be loaded at the end of the page.
                </p>
              </div>

              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Advanced Settings</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;