import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { syncPrintifyProducts } from '../../services/printifyService';
import toast from 'react-hot-toast';

const { FiRefreshCw, FiLoader, FiCheck } = FiIcons;

const PrintifyProductsSync = () => {
  const [syncing, setSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState(null);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await syncPrintifyProducts();
      setLastSyncResult(result);
      toast.success(`Successfully synced ${result.count} products from Printify`);
    } catch (error) {
      console.error('Error syncing products:', error);
      toast.error('Failed to sync products from Printify');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-coffee-800">Printify Products Sync</h3>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="btn-coffee flex items-center gap-2 py-2 px-4"
        >
          {syncing ? (
            <>
              <SafeIcon icon={FiLoader} className="animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <SafeIcon icon={FiRefreshCw} />
              Sync Products
            </>
          )}
        </button>
      </div>

      {lastSyncResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border-l-4 border-green-500 p-4 rounded flex items-start"
        >
          <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mt-0.5 mr-2" />
          <div>
            <p className="font-medium text-green-700">Sync completed successfully</p>
            <p className="text-green-600 text-sm">
              {lastSyncResult.count} products synced from Printify
            </p>
          </div>
        </motion.div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>
          This will sync all products from your Printify account to your local database.
          New products will be added and existing products will be updated.
        </p>
      </div>
    </div>
  );
};

export default PrintifyProductsSync;