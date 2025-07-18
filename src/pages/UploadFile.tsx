import React, { useState } from 'react';
import { ArrowLeft, Upload, Link as LinkIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { categories } from './Portfolio';
import getYoutubeId from 'get-youtube-id';
import { portfolioService } from '../utils/portfolioService';
import { isSupabaseConfigured } from '../lib/supabase';

const UploadFile: React.FC = () => {
  const [uploadType, setUploadType] = useState<'file' | 'link'>('link');
  const [file, setFile] = useState<File | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [description, setDescription] = useState('');
  const [views, setViews] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [thumbnail, setThumbnail] = useState('');

  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME = 'dbthy4lg2';
  const CLOUDINARY_UPLOAD_PRESET = 'WEBSITE';
  const CORRECT_PASSWORD = 'VASACHA';

  // Check if Supabase is configured
  const supabaseConfigured = isSupabaseConfigured();

  // Function to trigger portfolio refresh across the app
  const triggerPortfolioRefresh = () => {
    // Trigger custom event for other components
    window.dispatchEvent(new CustomEvent('portfolio-updated'));
    
    // Also use localStorage to trigger refresh in other tabs
    localStorage.setItem('portfolio_refresh', Date.now().toString());
    setTimeout(() => {
      localStorage.removeItem('portfolio_refresh');
    }, 1000);
  };

  const handleYoutubeUrlChange = (url: string) => {
    setYoutubeUrl(url);
    const videoId = getYoutubeId(url);
    if (videoId) {
      setThumbnail(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
      setError('');
    } else if (url) {
      setThumbnail('');
      setError('Invalid YouTube URL');
    } else {
      setThumbnail('');
      setError('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 100 * 1024 * 1024) {
        setError('File size must be less than 100MB');
        return;
      }
      setFile(selectedFile);
      setError('');

      // Generate thumbnail for video files
      if (selectedFile.type.startsWith('video/')) {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        video.src = URL.createObjectURL(selectedFile);
        video.onloadeddata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d')?.drawImage(video, 0, 0);
          setThumbnail(canvas.toDataURL());
        };
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabaseConfigured) {
      setError('Supabase not configured. Please set up your Supabase connection by adding VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
      return;
    }

    if (password !== CORRECT_PASSWORD) {
      setError('Incorrect password');
      return;
    }

    if ((!file && !youtubeUrl) || !title || (!category && !newCategory)) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (uploadType === 'file' && file) {
        // Handle file upload to Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Failed to upload file to Cloudinary');
        }

        const data = await response.json();
        
        // Save to Supabase database
        await portfolioService.add({
          title,
          category: newCategory || category,
          description,
          cloudinary_url: data.secure_url,
          thumbnail: data.thumbnail_url || data.secure_url,
          views: views || undefined,
          upload_type: 'file'
        });

        console.log('File uploaded and saved to database');
        
        setSuccess(true);
        resetForm();
        
        // Trigger portfolio refresh across the app
        triggerPortfolioRefresh();
      } else if (uploadType === 'link' && youtubeUrl) {
        // Save YouTube link to Supabase database
        await portfolioService.add({
          title,
          category: newCategory || category,
          description,
          youtube_url: youtubeUrl,
          thumbnail,
          views: views || undefined,
          upload_type: 'link'
        });
        
        console.log('YouTube video saved to database');
        
        setSuccess(true);
        resetForm();
        
        // Trigger portfolio refresh across the app
        triggerPortfolioRefresh();
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setYoutubeUrl('');
    setTitle('');
    setCategory('');
    setNewCategory('');
    setDescription('');
    setViews('');
    setPassword('');
    setThumbnail('');
  };

  const handleNewUpload = () => {
    setSuccess(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-dark text-white py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <a
          href="/"
          className="inline-flex items-center text-gray-medium hover:text-primary transition-colors duration-300 mb-8 group"
        >
          <ArrowLeft className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Home
        </a>

        <div className="bg-dark-card rounded-lg p-8 shadow-xl border border-white/5">
          <h1 className="text-3xl font-bold mb-8">Upload Portfolio Item</h1>

          {/* Supabase Configuration Warning */}
          {!supabaseConfigured && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-yellow-500 font-medium mb-1">Supabase Not Configured</h3>
                <p className="text-sm text-yellow-200">
                  To enable file uploads, you need to configure your Supabase connection. 
                  Add your <code className="bg-yellow-500/20 px-1 rounded">VITE_SUPABASE_URL</code> and{' '}
                  <code className="bg-yellow-500/20 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> to your .env file.
                </p>
              </div>
            </div>
          )}

          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-500 mb-2">Upload Successful!</h2>
              <p className="text-gray-medium mb-6">
                Your {uploadType === 'file' ? 'file has been uploaded' : 'YouTube video has been added'} to the portfolio and is now visible to all users.
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleNewUpload}
                  className="btn-primary px-6 py-3 mr-4"
                >
                  Upload Another
                </button>
                <a
                  href="/portfolio"
                  className="btn-outline px-6 py-3 inline-block"
                >
                  View Portfolio
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setUploadType('file')}
                  className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                    uploadType === 'file'
                      ? 'bg-primary text-white'
                      : 'bg-dark-lighter text-gray-medium hover:bg-dark-lighter/80'
                  }`}
                >
                  <Upload className="h-5 w-5" />
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType('link')}
                  className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                    uploadType === 'link'
                      ? 'bg-primary text-white'
                      : 'bg-dark-lighter text-gray-medium hover:bg-dark-lighter/80'
                  }`}
                >
                  <LinkIcon className="h-5 w-5" />
                  YouTube Link
                </button>
              </div>

              {uploadType === 'file' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-light mb-2">
                    Upload File
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg hover:border-primary transition-colors duration-300">
                    <div className="space-y-1 text-center">
                      <div className="flex text-sm text-gray-medium">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-dark rounded-md font-medium text-primary hover:text-primary/80">
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            accept="image/*,video/*"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-medium">
                        PNG, JPG, GIF, MP4 up to 100MB
                      </p>
                    </div>
                  </div>
                  {file && (
                    <p className="mt-2 text-sm text-gray-medium">
                      Selected file: {file.name}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-light mb-2">
                    YouTube URL *
                  </label>
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => handleYoutubeUrlChange(e.target.value)}
                    className="form-input"
                    placeholder="Enter YouTube video URL"
                    required={uploadType === 'link'}
                  />
                </div>
              )}

              {thumbnail && (
                <div>
                  <label className="block text-sm font-medium text-gray-light mb-2">
                    Thumbnail Preview
                  </label>
                  <img
                    src={thumbnail}
                    alt="Thumbnail"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-light mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                  placeholder="Enter title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-light mb-2">
                  Category *
                </label>
                <div className="space-y-3">
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setNewCategory('');
                    }}
                    className="form-input"
                    disabled={!!newCategory}
                  >
                    <option value="">Select category</option>
                    {categories.filter(cat => cat.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  
                  <div className="flex items-center">
                    <span className="text-gray-medium mx-3">or</span>
                  </div>
                  
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => {
                      setNewCategory(e.target.value);
                      setCategory('');
                    }}
                    className="form-input"
                    placeholder="Create new category"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-light mb-2">
                  Views (optional)
                </label>
                <input
                  type="text"
                  value={views}
                  onChange={(e) => setViews(e.target.value)}
                  className="form-input"
                  placeholder="e.g., 100K+ Views"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-light mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input"
                  rows={4}
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-light mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="Enter password"
                  required
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !supabaseConfigured}
                className={`w-full py-3 flex items-center justify-center transition-all duration-300 ${
                  !supabaseConfigured 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'btn-primary'
                }`}
              >
                {loading ? (
                  <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Submit'
                )}
              </button>

              {!supabaseConfigured && (
                <p className="text-sm text-gray-medium text-center">
                  Configure Supabase to enable uploads
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadFile;