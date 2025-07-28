import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import supabase from '../../lib/supabase';
import toast from 'react-hot-toast';

const { FiSave, FiLoader, FiKey } = FiIcons;

const PrintifySettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [shopId, setShopId] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('key, value')
          .in('key', ['printify_api_key', 'printify_shop_id', 'printify_webhook_url']);
          
        if (error) throw error;
        
        const settings = {};
        data.forEach(item => {
          settings[item.key] = item.value;
        });
        
        setApiKey(settings.printify_api_key || '');
        setShopId(settings.printify_shop_id || '');
        setWebhookUrl(settings.printify_webhook_url || '');
      } catch (error) {
        console.error('Error fetching Printify settings:', error);
        toast.error('Failed to load Printify settings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const settings = [
        { key: 'printify_api_key', value: apiKey },
        { key: 'printify_shop_id', value: shopId },
        { key: 'printify_webhook_url', value: webhookUrl }
      ];
      
      // Upsert settings
      for (const setting of settings) {
        const { error } = await supabase
          .from('app_settings')
          .upsert(setting, { onConflict: 'key' });
          
        if (error) throw error;
      }
      
      toast.success('Printify settings saved successfully');
    } catch (error) {
      console.error('Error saving Printify settings:', error);
      toast.error('Failed to save Printify settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 flex justify-center items-center h-64">
        <SafeIcon icon={FiLoader} className="animate-spin w-8 h-8 text-coffee-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-coffee-800 mb-6">Printify API Settings</h3>
      
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-coffee-700 mb-1">
            API Key
          </label>
          <div className="relative">
            <SafeIcon icon={FiKey} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400" />
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pl-10 w-full py-3 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
              placeholder="Enter your Printify API key"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            You can find your API key in your Printify account settings.
          </p>
        </div>
        
        <div>
          <label htmlFor="shopId" className="block text-sm font-medium text-coffee-700 mb-1">
            Shop ID
          </label>
          <input
            id="shopId"
            type="text"
            value={shopId}
            onChange={(e) => setShopId(e.target.value)}
            className="w-full py-3 px-4 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
            placeholder="Enter your Printify Shop ID"
          />
        </div>
        
        <div>
          <label htmlFor="webhookUrl" className="block text-sm font-medium text-coffee-700 mb-1">
            Webhook URL
          </label>
          <input
            id="webhookUrl"
            type="text"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="w-full py-3 px-4 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
            placeholder="Enter your webhook URL for Printify notifications"
          />
          <p className="mt-1 text-xs text-gray-500">
            This URL will receive webhooks from Printify for order status updates.
          </p>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full btn-coffee py-3 flex items-center justify-center"
          >
            {saving ? (
              <>
                <SafeIcon icon={FiLoader} className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <SafeIcon icon={FiSave} className="mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PrintifySettings;