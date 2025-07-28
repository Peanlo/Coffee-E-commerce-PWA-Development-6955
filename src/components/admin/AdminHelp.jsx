import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSearch, FiX, FiHelpCircle, FiBook, FiArrowRight, FiLoader } = FiIcons;

const AdminHelp = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      // Simulate AI response with a delay
      setTimeout(() => {
        // Generate contextual response based on query
        const searchTerms = query.toLowerCase();
        let response = '';

        if (searchTerms.includes('product') && (searchTerms.includes('add') || searchTerms.includes('create'))) {
          response = "To add a new product: Navigate to Products &gt; Add New Product. Fill in the required fields (name, price, description, category). Upload at least one product image. Set inventory status. Click 'Save Product'.";
        } else if (searchTerms.includes('order') && searchTerms.includes('status')) {
          response = "To update an order status: Go to Orders section. Find the order using the search or filters. Click on the order to view details. Use the status dropdown to change the status. Click 'Update Status' to save changes.";
        } else if (searchTerms.includes('printify') || searchTerms.includes('print on demand')) {
          response = "Printify integration: Access Printify settings under Settings &gt; Printify. Enter your API key and shop ID. Use the Products &gt; Sync Products button to import products from Printify. Orders with Printify items will automatically sync with your Printify account.";
        } else if (searchTerms.includes('dashboard') || searchTerms.includes('analytics')) {
          response = "The dashboard displays key metrics including recent orders, revenue, and product performance. Use the date range selector to view data for specific periods. Click on any metric card to view more detailed information.";
        } else {
          response = "I couldn't find a specific answer to your question. Please check the user manual sections for comprehensive guidance or try rephrasing your query to be more specific.";
        }

        setSearchResults(response);
        setIsSearching(false);
      }, 1000);
    } catch (error) {
      setSearchResults("Sorry, I couldn't process your request. Please try again later.");
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults(null);
  };

  // Manual sections
  const manualSections = [
    { id: 'overview', title: 'Overview' },
    { id: 'dashboard', title: 'Dashboard' },
    { id: 'products', title: 'Products Management' },
    { id: 'orders', title: 'Orders Management' },
    { id: 'printify', title: 'Printify Integration' },
    { id: 'settings', title: 'Settings' },
    { id: 'users', title: 'User Management' }
  ];

  // Manual content
  const manualContent = {
    overview: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-coffee-800">Welcome to Cogli Caffe Admin Panel</h3>
        <p>This admin panel allows you to manage all aspects of your e-commerce store, including:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Monitor sales and revenue through the Dashboard</li>
          <li>Manage your product catalog</li>
          <li>Process and track customer orders</li>
          <li>Integrate with Printify for print-on-demand products</li>
          <li>Configure store settings</li>
          <li>Manage user accounts and permissions</li>
        </ul>
        <p className="mt-4">Use the navigation menu on the left to access different sections of the admin panel.</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
          <h4 className="font-medium text-blue-800">Need Help?</h4>
          <p className="text-blue-600">Use the search bar above to ask questions about how to use specific features.</p>
        </div>
      </div>
    ),
    dashboard: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-coffee-800">Dashboard</h3>
        <p>The dashboard provides an overview of your store's performance and recent activity.</p>
        
        <h4 className="text-lg font-medium text-coffee-700 mt-6">Key Metrics</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Orders:</strong> Total number of recent orders</li>
          <li><strong>Revenue:</strong> Total revenue for the selected period</li>
          <li><strong>Recent Orders Table:</strong> Shows the most recent orders with their status</li>
        </ul>
        
        <h4 className="text-lg font-medium text-coffee-700 mt-6">Quick Actions</h4>
        <p>The Quick Actions panel provides shortcuts to common tasks:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Sync Printify Products:</strong> Import products from your Printify account</li>
          <li><strong>Manage Orders:</strong> Go to the orders management page</li>
          <li><strong>Printify Settings:</strong> Configure your Printify integration</li>
        </ul>
        
        <h4 className="text-lg font-medium text-coffee-700 mt-6">Printify Status</h4>
        <p>This section shows the current status of your Printify integration:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>API Connection:</strong> Shows if the connection to Printify API is active</li>
          <li><strong>Last Sync:</strong> When products were last synchronized</li>
          <li><strong>Products Synced:</strong> Number of products imported from Printify</li>
        </ul>
      </div>
    ),
    products: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-coffee-800">Products Management</h3>
        <p>This section allows you to manage your product catalog, including both regular products and Printify products.</p>
        
        <h4 className="text-lg font-medium text-coffee-700 mt-6">Adding Products</h4>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Navigate to Products &gt; Add New Product</li>
          <li>Fill in the required fields:
            <ul className="list-disc pl-5 mt-2">
              <li>Product Name</li>
              <li>Price</li>
              <li>Description</li>
              <li>Category (Coffee or Merchandise)</li>
            </ul>
          </li>
          <li>Upload product images (main image is required)</li>
          <li>Set inventory status (In Stock or Out of Stock)</li>
          <li>Click "Save Product" to add the product to your catalog</li>
        </ol>
        
        <h4 className="text-lg font-medium text-coffee-700 mt-6">Editing Products</h4>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Navigate to Products &gt; All Products</li>
          <li>Find the product you want to edit using the search or filters</li>
          <li>Click on the product name or the Edit button</li>
          <li>Make your changes to the product information</li>
          <li>Click "Update Product" to save your changes</li>
        </ol>
        
        <h4 className="text-lg font-medium text-coffee-700 mt-6">Printify Products</h4>
        <p>To import products from Printify:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Navigate to Products &gt; Sync Printify Products</li>
          <li>Click the "Sync Products" button</li>
          <li>Wait for the synchronization to complete</li>
          <li>Printify products will appear in your product catalog with a "Printify" tag</li>
        </ol>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6">
          <h4 className="font-medium text-yellow-800">Important Note</h4>
          <p className="text-yellow-700">Changes made to Printify products in your store won't be reflected in your Printify account. To modify Printify products, make changes in your Printify account and then sync again.</p>
        </div>
      </div>
    ),
    orders: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-coffee-800">Orders Management</h3>
        <p>This section allows you to view, process, and manage customer orders.</p>
        
        <h4 className="text-lg font-medium text-coffee-700 mt-6">Viewing Orders</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li>All orders are listed in the Orders section</li>
          <li>Use filters to find orders by status, date, or customer</li>
          <li>Click on an order to view its details</li>
        </ul>
        
        <h4 className="text-lg font-medium text-coffee-700 mt-6">Order Statuses</h4>
        <p>Orders can have the following statuses:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Paid:</strong> Payment received but order not yet processed</li>
          <li><strong>Processing:</strong> Order is being prepared</li>
          <li><strong>Shipped:</strong> Order has been shipped to the customer</li>
          <li><strong>Delivered:</strong> Order has been received by the customer</li>
          <li><strong>Canceled:</strong> Order has been canceled</li>
        </ul>
        
        <h4 className="text-lg font-medium text-coffee-700 mt-6">Updating Order Status</h4>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Open the order details</li>
          <li>Use the status dropdown to select the new status</li>
          <li>Click "Update Status" to save the changes</li>
          <li>For Printify orders, status updates will sync with Printify automatically</li>
        </ol>
        
        <h4 className="text-lg font-medium text-coffee-700 mt-6">Order Timeline</h4>
        <p>Each order has a timeline that shows:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>When the order was placed</li>
          <li>Status changes and when they occurred</li>
          <li>Shipping information (when available)</li>
          <li>For Printify orders, you can sync the latest status from Printify using the refresh button</li>
        </ul>
      </div>
    ),
    printify: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-coffee-800">Printify Integration</h3>
        <p>Cogli Caffe integrates with Printify to offer print-on-demand products without holding inventory.</p>
        
        <h4 className="text-lg font-medium text-coffee-700 mt-6">Setting Up Printify</h4>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Navigate to Settings &gt; Printify</li>
          <li>Enter your Printify API key (found in your Printify account settings)</li>
          <li>Enter your Printify Shop ID</li>
          <li>Optionally, set up a webhook URL for real-time updates</li>
          <li>Click "Save Settings" to connect your Printify account</li>
        </ol>
        
        <h4 className="text-lg font-medium text-coffee-700 mt-6">Importing Products</h4>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Navigate to Products &gt; Sync Printify Products or use the Quick Action on the dashboard</li>
          <li>Click the "Sync Products" button</li>
          <li>All published products from your Printify account will be imported</li>
        </ol>
        
        <h4 className="text-lg font-medium text-coffee-700 mt-6">Order Processing</h4>
        <p>When a customer orders a Printify product:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>The order is automatically sent to Printify for fulfillment</li>
          <li>Order status is synchronized between your store and Printify</li>
          <li>Shipping information from Printify is displayed in the order details</li>
          <li>You can manually sync the latest status using the refresh button in the order details</li>
        </ol>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
          <h4 className="font-medium text-blue-800">Pro Tip</h4>
          <p className="text-blue-600">Set up the Printify webhook to receive real-time updates about order status changes and shipping information without having to manually sync.</p>
        </div>
      </div>
    ),
    settings: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-coffee-800">Settings</h3>
        <p>The Settings section allows you to configure various aspects of your store.</p>
        
        <h4 className="text-lg font-medium text-coffee-700 mt-6">General Settings</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Store Information:</strong> Name, description, contact details</li>
          <li><strong>Currency Settings:</strong> Set your store's currency and format</li>
          <li><strong>Tax Settings:</strong> Configure tax rates and rules</li>
        </ul>
        
        <h4 className="text-lg font-medium text-coffee-700 mt-6">Payment Settings</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Payment Methods:</strong> Enable/disable and configure payment options</li>
          <li><strong>Stripe Configuration:</strong> Connect your Stripe account</li>
          <li><strong>PayPal Configuration:</strong> Connect your PayPal account</li>
        </ul>
        
        <h4 className="text-lg font-medium text-coffee-700 mt-6">Shipping Settings</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Shipping Methods:</strong> Configure available shipping options</li>
          <li><strong>Shipping Rates:</strong> Set rates based on weight, price, or location</li>
          <li><strong>Free Shipping:</strong> Set thresholds for free shipping offers</li>
        </ul>
        
        <h4 className="text-lg font-medium text-coffee-700 mt-6">Printify Settings</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>API Key:</strong> Your Printify API key</li>
          <li><strong>Shop ID:</strong> Your Printify shop identifier</li>
          <li><strong>Webhook URL:</strong> URL for Printify to send real-time updates</li>
        </ul>
        
        <h4 className="text-lg font-medium text-coffee-700 mt-6">Email Settings</h4>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Email Templates:</strong> Configure order confirmation, shipping, and other email templates</li>
          <li><strong>SMTP Settings:</strong> Set up your email provider</li>
        </ul>
      </div>
    ),
    users: (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-coffee-800">User Management</h3>
        <p>This section allows you to manage administrator and customer accounts.</p>
        
        <h4 className="text-lg font-medium text-coffee-700 mt-6">Admin Users</h4>
        <p>Admin users have access to the admin panel. You can:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>View all admin users</li>
          <li>Add new admin users</li>
          <li>Edit existing admin users</li>
          <li>Change admin permissions</li>
          <li>Deactivate admin accounts</li>
        </ul>
        
        <h4 className="text-lg font-medium text-coffee-700 mt-6">Adding an Admin User</h4>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Navigate to Users &gt; Admin Users</li>
          <li>Click "Add New Admin"</li>
          <li>Fill in the required information:
            <ul className="list-disc pl-5 mt-2">
              <li>Name</li>
              <li>Email</li>
              <li>Password</li>
              <li>Role (Super Admin, Admin, Editor)</li>
            </ul>
          </li>
          <li>Click "Create Admin User"</li>
        </ol>
        
        <h4 className="text-lg font-medium text-coffee-700 mt-6">Customer Accounts</h4>
        <p>You can also manage customer accounts:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>View all customers</li>
          <li>See customer order history</li>
          <li>Edit customer information</li>
          <li>Reset customer passwords</li>
          <li>Deactivate customer accounts</li>
        </ul>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-6">
          <h4 className="font-medium text-red-800">Security Note</h4>
          <p className="text-red-700">Only grant admin access to trusted individuals. Super Admin access should be limited to store owners and key personnel only.</p>
        </div>
      </div>
    )
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <SafeIcon icon={FiBook} className="w-6 h-6 text-coffee-600 mr-2" />
          <h2 className="text-xl font-semibold text-coffee-800">Admin User Manual</h2>
        </div>
      </div>

      {/* AI Query Section */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about the admin panel..."
            className="w-full py-3 pl-10 pr-12 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
          />
          <SafeIcon
            icon={FiSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <SafeIcon icon={FiX} className="w-5 h-5" />
            </button>
          )}
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-coffee-600 hover:text-coffee-800 disabled:text-gray-300"
          >
            {isSearching ? (
              <SafeIcon icon={FiLoader} className="w-5 h-5 animate-spin" />
            ) : (
              <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
            )}
          </button>
        </form>

        {/* Search Results */}
        {searchResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-cream-50 border border-coffee-200 rounded-lg"
          >
            <div className="flex items-start">
              <SafeIcon
                icon={FiHelpCircle}
                className="w-5 h-5 text-coffee-600 mt-0.5 mr-3 flex-shrink-0"
              />
              <div>
                <h3 className="font-medium text-coffee-800 mb-1">Answer:</h3>
                <p className="text-coffee-600" dangerouslySetInnerHTML={{ __html: searchResults }}></p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Manual Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
        {manualSections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              activeSection === section.id
                ? 'bg-coffee-600 text-white'
                : 'bg-cream-50 text-coffee-600 hover:bg-cream-100'
            }`}
          >
            {section.title}
          </button>
        ))}
      </div>

      {/* Manual Content */}
      <div className="prose max-w-none">
        {manualContent[activeSection]}
      </div>
    </div>
  );
};

export default AdminHelp;