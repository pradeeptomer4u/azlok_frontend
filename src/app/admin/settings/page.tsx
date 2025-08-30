'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

interface SiteSetting {
  id: string;
  name: string;
  value: string;
  type: 'text' | 'number' | 'boolean' | 'json' | 'color';
  description: string;
  category: 'general' | 'appearance' | 'email' | 'payment' | 'shipping' | 'seo';
  updated_at: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('general');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (user?.role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        // For now, use mock data
        const mockSettings: SiteSetting[] = [
          {
            id: 'site_name',
            name: 'Site Name',
            value: 'Azlok Marketplace',
            type: 'text',
            description: 'The name of your marketplace',
            category: 'general',
            updated_at: '2023-01-01T00:00:00Z',
          },
          {
            id: 'site_description',
            name: 'Site Description',
            value: 'Your one-stop shop for all your needs',
            type: 'text',
            description: 'A short description of your marketplace',
            category: 'general',
            updated_at: '2023-01-01T00:00:00Z',
          },
          {
            id: 'contact_email',
            name: 'Contact Email',
            value: 'contact@azlok.com',
            type: 'text',
            description: 'Main contact email address',
            category: 'general',
            updated_at: '2023-01-01T00:00:00Z',
          },
          {
            id: 'primary_color',
            name: 'Primary Color',
            value: '#3B82F6',
            type: 'color',
            description: 'Primary theme color',
            category: 'appearance',
            updated_at: '2023-01-01T00:00:00Z',
          },
          {
            id: 'secondary_color',
            name: 'Secondary Color',
            value: '#10B981',
            type: 'color',
            description: 'Secondary theme color',
            category: 'appearance',
            updated_at: '2023-01-01T00:00:00Z',
          },
          {
            id: 'smtp_host',
            name: 'SMTP Host',
            value: 'smtp.example.com',
            type: 'text',
            description: 'SMTP server hostname',
            category: 'email',
            updated_at: '2023-01-01T00:00:00Z',
          },
          {
            id: 'smtp_port',
            name: 'SMTP Port',
            value: '587',
            type: 'number',
            description: 'SMTP server port',
            category: 'email',
            updated_at: '2023-01-01T00:00:00Z',
          },
          {
            id: 'payment_gateway',
            name: 'Payment Gateway',
            value: 'stripe',
            type: 'text',
            description: 'Default payment gateway',
            category: 'payment',
            updated_at: '2023-01-01T00:00:00Z',
          },
          {
            id: 'shipping_zones',
            name: 'Shipping Zones',
            value: JSON.stringify([
              { name: 'Domestic', countries: ['US'], base_rate: 5.99 },
              { name: 'International', countries: ['*'], base_rate: 15.99 },
            ]),
            type: 'json',
            description: 'Shipping zones configuration',
            category: 'shipping',
            updated_at: '2023-01-01T00:00:00Z',
          },
          {
            id: 'meta_title',
            name: 'Meta Title',
            value: 'Azlok - Your Global Marketplace',
            type: 'text',
            description: 'Default meta title for SEO',
            category: 'seo',
            updated_at: '2023-01-01T00:00:00Z',
          },
          {
            id: 'meta_description',
            name: 'Meta Description',
            value: 'Discover thousands of products from sellers around the world on Azlok Marketplace.',
            type: 'text',
            description: 'Default meta description for SEO',
            category: 'seo',
            updated_at: '2023-01-01T00:00:00Z',
          },
        ];
        
        setSettings(mockSettings);
        
        // When API is ready, uncomment this
        /*
        const response = await fetch('/api/admin/settings');
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await response.json();
        setSettings(data);
        */
      } catch (err) {
        setError('Failed to load settings. Please try again.');
        console.error('Error fetching settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSettingChange = (id: string, value: string) => {
    setSettings(
      settings.map((setting) => (setting.id === id ? { ...setting, value } : setting))
    );
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // Mock API call - in real app, this would be an API call
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the updated_at timestamp
      setSettings(
        settings.map(setting => ({ ...setting, updated_at: new Date().toISOString() }))
      );
      
      setSaveSuccess(true);
      
      // When API is ready, uncomment this
      /*
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
      
      const updatedSettings = await response.json();
      setSettings(updatedSettings);
      setSaveSuccess(true);
      */
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
      
      // Clear success message after 3 seconds
      if (saveSuccess) {
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    }
  };

  const categories = [
    { id: 'general', name: 'General' },
    { id: 'appearance', name: 'Appearance' },
    { id: 'email', name: 'Email' },
    { id: 'payment', name: 'Payment' },
    { id: 'shipping', name: 'Shipping' },
    { id: 'seo', name: 'SEO' },
  ];

  const filteredSettings = settings.filter(
    (setting) => setting.category === activeCategory
  );

  if (!isAuthenticated || user?.role !== 'admin') {
    return null; // Don't render anything if not authenticated or not admin
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className={`px-4 py-2 rounded-md ${
            isSaving
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {saveSuccess && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          Settings saved successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row">
          {/* Category Navigation */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0 md:pr-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <ul>
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-4 py-3 border-b border-gray-200 ${
                        activeCategory === category.id
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Settings Form */}
          <div className="w-full md:w-3/4">
            <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
              <h2 className="text-xl font-semibold mb-4 capitalize">
                {activeCategory} Settings
              </h2>
              <div className="space-y-6">
                {filteredSettings.map((setting) => (
                  <div key={setting.id} className="border-b border-gray-200 pb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {setting.name}
                    </label>
                    {setting.type === 'text' && (
                      <input
                        type="text"
                        value={setting.value}
                        onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    )}
                    {setting.type === 'number' && (
                      <input
                        type="number"
                        value={setting.value}
                        onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    )}
                    {setting.type === 'boolean' && (
                      <select
                        value={setting.value}
                        onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    )}
                    {setting.type === 'color' && (
                      <div className="flex items-center mt-1">
                        <input
                          type="color"
                          value={setting.value}
                          onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                          className="h-8 w-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={setting.value}
                          onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                          className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    )}
                    {setting.type === 'json' && (
                      <textarea
                        value={setting.value}
                        onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                        rows={5}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
                      />
                    )}
                    <p className="mt-1 text-sm text-gray-500">{setting.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
