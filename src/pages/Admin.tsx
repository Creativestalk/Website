import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  MoreVertical,
  Plus,
  Download,
  Upload,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  RefreshCw,
  Database,
  Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioService } from '../utils/portfolioService';
import { isSupabaseConfigured, PortfolioItem } from '../lib/supabase';
import { categories } from './Portfolio';
import { getDefaultWorkItems } from '../data/works';

interface AdminPortfolioItem extends PortfolioItem {
  isHidden?: boolean;
  isSelected?: boolean;
  source?: 'database' | 'code'; // Track where the item comes from
}

const Admin: React.FC = () => {
  const [items, setItems] = useState<AdminPortfolioItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<AdminPortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminPortfolioItem | null>(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [sourceFilter, setSourceFilter] = useState<'all' | 'database' | 'code'>('all');

  const ADMIN_PASSWORD = 'VASACHA';
  const supabaseConfigured = isSupabaseConfigured();

  // Load portfolio items from both sources
  const loadItems = async () => {
    setLoading(true);
    try {
      // Get items from database
      const databaseItems = await portfolioService.getAll();
      const adminDatabaseItems: AdminPortfolioItem[] = databaseItems.map(item => ({
        ...item,
        isHidden: false,
        isSelected: false,
        source: 'database' as const
      }));

      // Get default items from code
      const defaultItems = getDefaultWorkItems();
      const adminCodeItems: AdminPortfolioItem[] = defaultItems.map(item => ({
        id: item.id,
        title: item.title,
        category: item.category,
        description: `Default portfolio item - ${item.category}`,
        youtube_url: item.youtubeUrl,
        cloudinary_url: undefined,
        thumbnail: item.thumbnail,
        views: item.views,
        upload_type: 'link' as const,
        created_at: '2024-01-01T00:00:00Z', // Default date for code items
        updated_at: '2024-01-01T00:00:00Z',
        isHidden: false,
        isSelected: false,
        source: 'code' as const
      }));

      // Combine both sources
      const allItems = [...adminDatabaseItems, ...adminCodeItems];
      setItems(allItems);
      setFilteredItems(allItems);
    } catch (error) {
      showNotification('error', 'Failed to load portfolio items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadItems();
    }
  }, [isAuthenticated]);

  // Filter items based on search, category, and source
  useEffect(() => {
    let filtered = items;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(item => item.source === sourceFilter);
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, selectedCategory, sourceFilter]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password');
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleDelete = async (itemIds: string[]) => {
    setActionLoading(true);
    try {
      // Only delete database items
      const databaseItemIds = itemIds.filter(id => {
        const item = items.find(i => i.id === id);
        return item?.source === 'database';
      });

      const codeItemIds = itemIds.filter(id => {
        const item = items.find(i => i.id === id);
        return item?.source === 'code';
      });

      if (codeItemIds.length > 0) {
        showNotification('error', `Cannot delete ${codeItemIds.length} code-based item(s). Only database items can be deleted.`);
      }

      if (databaseItemIds.length > 0) {
        const deletePromises = databaseItemIds.map(id => portfolioService.remove(id));
        await Promise.all(deletePromises);
        
        setItems(prev => prev.filter(item => !databaseItemIds.includes(item.id)));
        showNotification('success', `Deleted ${databaseItemIds.length} database item(s) successfully`);
      }
      
      setSelectedItems(new Set());
      setShowDeleteModal(false);
    } catch (error) {
      showNotification('error', 'Failed to delete items');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (updatedItem: AdminPortfolioItem) => {
    if (updatedItem.source === 'code') {
      showNotification('error', 'Cannot edit code-based items. These are defined in the source code.');
      return;
    }

    setActionLoading(true);
    try {
      const success = await portfolioService.update(updatedItem.id, {
        title: updatedItem.title,
        category: updatedItem.category,
        description: updatedItem.description,
        views: updatedItem.views
      });

      if (success) {
        setItems(prev => prev.map(item => 
          item.id === updatedItem.id ? { ...item, ...updatedItem } : item
        ));
        setShowEditModal(false);
        setEditingItem(null);
        showNotification('success', 'Item updated successfully');
      } else {
        showNotification('error', 'Failed to update item');
      }
    } catch (error) {
      showNotification('error', 'Failed to update item');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleItemSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const selectAllItems = () => {
    if (selectedItems.size === filteredItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredItems.map(item => item.id)));
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getSourceStats = () => {
    const databaseCount = items.filter(item => item.source === 'database').length;
    const codeCount = items.filter(item => item.source === 'code').length;
    return { databaseCount, codeCount };
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark text-white flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <motion.div 
            className="bg-dark-card rounded-lg p-8 shadow-xl border border-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Admin Access</h1>
              <p className="text-gray-medium">Enter password to manage portfolio</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-light mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="Enter admin password"
                  required
                />
              </div>

              {authError && (
                <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary w-full py-3"
              >
                Access Admin Panel
              </button>
            </form>

            <div className="mt-6 text-center">
              <a
                href="/"
                className="inline-flex items-center text-gray-medium hover:text-primary transition-colors duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const { databaseCount, codeCount } = getSourceStats();

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Header */}
      <div className="bg-dark-card border-b border-white/5 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="inline-flex items-center text-gray-medium hover:text-primary transition-colors duration-300"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </a>
              <h1 className="text-2xl font-bold">Portfolio Admin</h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={exportData}
                className="btn-outline px-4 py-2 text-sm flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <a
                href="/uploadfile007"
                className="btn-primary px-4 py-2 text-sm flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add New</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg border ${
              notification.type === 'success' 
                ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <div className="flex items-center space-x-2">
              {notification.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span>{notification.message}</span>
              <button
                onClick={() => setNotification(null)}
                className="ml-2 hover:opacity-70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        {/* Supabase Warning */}
        {!supabaseConfigured && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-yellow-500 font-medium mb-1">Supabase Not Configured</h3>
              <p className="text-sm text-yellow-200">
                Database operations are limited. Configure Supabase to enable full functionality.
              </p>
            </div>
          </div>
        )}

        {/* Source Info */}
        <div className="bg-dark-card rounded-lg p-4 mb-6 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-light">Database Items: {databaseCount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-light">Code Items: {codeCount}</span>
              </div>
            </div>
            <div className="text-sm text-gray-medium">
              Total: {items.length} items
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-dark-card rounded-lg p-6 mb-6 border border-white/5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-medium" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10 w-full sm:w-64"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-medium" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="form-input pl-10 w-full sm:w-48"
                >
                  <option value="all">All Categories</option>
                  {categories.filter(cat => cat.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Source Filter */}
              <div className="relative">
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value as 'all' | 'database' | 'code')}
                  className="form-input w-full sm:w-40"
                >
                  <option value="all">All Sources</option>
                  <option value="database">Database Only</option>
                  <option value="code">Code Only</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={loadItems}
                disabled={loading}
                className="btn-outline px-4 py-2 text-sm flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>

              {selectedItems.size > 0 && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm flex items-center space-x-2 transition-colors duration-300"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete ({selectedItems.size})</span>
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between text-sm text-gray-medium">
              <span>
                Showing {filteredItems.length} of {items.length} items
                {selectedItems.size > 0 && ` • ${selectedItems.size} selected`}
              </span>
              <button
                onClick={selectAllItems}
                className="hover:text-primary transition-colors duration-300"
              >
                {selectedItems.size === filteredItems.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-medium">Loading portfolio items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-medium text-lg">No items found</p>
            {searchTerm || selectedCategory !== 'all' || sourceFilter !== 'all' ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSourceFilter('all');
                }}
                className="mt-4 text-primary hover:underline"
              >
                Clear filters
              </button>
            ) : (
              <a
                href="/uploadfile007"
                className="mt-4 inline-block btn-primary px-6 py-3"
              >
                Add your first item
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                className={`bg-dark-card rounded-lg overflow-hidden border transition-all duration-300 ${
                  selectedItems.has(item.id) 
                    ? 'border-primary shadow-lg shadow-primary/25' 
                    : 'border-white/5 hover:border-white/10'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -2 }}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Source Badge */}
                  <div className="absolute top-2 left-2">
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${
                      item.source === 'database' 
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {item.source === 'database' ? (
                        <Database className="h-3 w-3" />
                      ) : (
                        <Code className="h-3 w-3" />
                      )}
                      <span>{item.source === 'database' ? 'DB' : 'Code'}</span>
                    </div>
                  </div>

                  {/* Selection Checkbox */}
                  <div className="absolute top-2 right-12">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                      className="w-4 h-4 text-primary bg-dark border-gray-600 rounded focus:ring-primary focus:ring-2"
                    />
                  </div>

                  {/* Actions Menu */}
                  <div className="absolute top-2 right-2">
                    <div className="relative group">
                      <button className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors duration-300">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      
                      <div className="absolute right-0 top-full mt-1 bg-dark-card border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[120px]">
                        <button
                          onClick={() => {
                            if (item.source === 'code') {
                              showNotification('error', 'Cannot edit code-based items');
                              return;
                            }
                            setEditingItem(item);
                            setShowEditModal(true);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-white/5 flex items-center space-x-2 ${
                            item.source === 'code' ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <Edit3 className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (item.source === 'code') {
                              showNotification('error', 'Cannot delete code-based items');
                              return;
                            }
                            setSelectedItems(new Set([item.id]));
                            setShowDeleteModal(true);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-white/5 text-red-400 flex items-center space-x-2 ${
                            item.source === 'code' ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-medium mb-2 line-clamp-2">{item.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-medium mb-2">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                      {categories.find(cat => cat.id === item.category)?.label || item.category}
                    </span>
                    {item.views && <span>{item.views}</span>}
                  </div>
                  <p className="text-xs text-gray-light">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                  {item.source === 'code' && (
                    <p className="text-xs text-green-400 mt-1">
                      Defined in source code
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Delete Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-dark-card rounded-lg p-6 max-w-md w-full border border-white/10"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
                <p className="text-gray-medium mb-6">
                  Are you sure you want to delete {selectedItems.size} item(s)? This action cannot be undone.
                  {Array.from(selectedItems).some(id => items.find(i => i.id === id)?.source === 'code') && (
                    <span className="block mt-2 text-yellow-400 text-sm">
                      Note: Code-based items cannot be deleted and will be skipped.
                    </span>
                  )}
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 btn-outline py-2"
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(Array.from(selectedItems))}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition-colors duration-300 flex items-center justify-center"
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Modal */}
        <AnimatePresence>
          {showEditModal && editingItem && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-dark-card rounded-lg p-6 max-w-lg w-full border border-white/10 max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <h3 className="text-xl font-bold mb-4">Edit Item</h3>
                {editingItem.source === 'code' ? (
                  <div className="text-center py-8">
                    <Code className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <p className="text-gray-medium">
                      This item is defined in the source code and cannot be edited through the admin panel.
                    </p>
                    <button
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingItem(null);
                      }}
                      className="mt-4 btn-outline px-6 py-2"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleEdit(editingItem);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-light mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={editingItem.title}
                        onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-light mb-2">
                        Category
                      </label>
                      <select
                        value={editingItem.category}
                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                        className="form-input"
                        required
                      >
                        {categories.filter(cat => cat.id !== 'all').map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-light mb-2">
                        Views
                      </label>
                      <input
                        type="text"
                        value={editingItem.views || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, views: e.target.value })}
                        className="form-input"
                        placeholder="e.g., 100K+ Views"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-light mb-2">
                        Description
                      </label>
                      <textarea
                        value={editingItem.description || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        className="form-input"
                        rows={3}
                        placeholder="Enter description"
                      />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditModal(false);
                          setEditingItem(null);
                        }}
                        className="flex-1 btn-outline py-2"
                        disabled={actionLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 btn-primary py-2 flex items-center justify-center"
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Admin;