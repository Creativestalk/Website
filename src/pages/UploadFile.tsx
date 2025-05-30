import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, Lock } from 'lucide-react';
import { categories } from './Portfolio';

const GUMLET_API_KEY = 'gumlet_1ac896f80a389bc64d9d9d6014bfb665'; // Replace with your actual Gumlet API key

const UploadFile: React.FC = () => {
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [fileType, setFileType] = useState('image');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Check file size (max 100MB)
      if (selectedFile.size > 100 * 1024 * 1024) {
        setError('File size must be less than 100MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const uploadToGumlet = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('collection', category);
    formData.append('metadata', JSON.stringify({
      title,
      description,
      type: fileType
    }));

    const response = await fetch('https://api.gumlet.com/v1/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GUMLET_API_KEY}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return await response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== 'VASACHA') {
      setError('Invalid password');
      return;
    }

    if (!file) {
      setError('Please select a file');
      return;
    }

    if (!title || !category) {
      setError('Please fill in all required fields');
      return;
    }

    setIsUploading(true);

    try {
      const uploadResult = await uploadToGumlet(file);
      console.log('Upload successful:', uploadResult);
      setSuccess(true);
      
      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
      setCategory('');
      setPassword('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
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

        <div className="bg-dark-card rounded-xl p-8 border border-white/5">
          <h1 className="text-3xl font-bold mb-6">Upload Portfolio Item</h1>

          {success ? (
            <div className="text-center py-8">
              <div className="text-primary text-5xl mb-4">✓</div>
              <h3 className="text-xl font-medium mb-2">Upload Successful!</h3>
              <p className="text-gray-medium mb-6">Your file has been uploaded successfully.</p>
              <button
                onClick={() => setSuccess(false)}
                className="btn-primary px-6 py-2"
              >
                Upload Another File
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-light mb-2">
                  File Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="image"
                      checked={fileType === 'image'}
                      onChange={(e) => setFileType(e.target.value)}
                      className="mr-2"
                    />
                    Image
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="video"
                      checked={fileType === 'video'}
                      onChange={(e) => setFileType(e.target.value)}
                      className="mr-2"
                    />
                    Video
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-light mb-2">
                  Upload File
                </label>
                <div
                  className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-primary transition-colors duration-300 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={fileType === 'image' ? 'image/*' : 'video/*'}
                    className="hidden"
                  />
                  <Upload className="h-8 w-8 text-gray-medium mx-auto mb-4" />
                  <p className="text-gray-medium">
                    {file ? file.name : `Click to upload ${fileType}`}
                  </p>
                  <p className="text-sm text-gray-medium mt-2">
                    Maximum file size: 100MB
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-light mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                  placeholder="Enter title"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-light mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-light mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input"
                  rows={4}
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-light mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input pr-10"
                    placeholder="Enter password"
                    required
                  />
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-medium" />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <button
                type="submit"
                disabled={isUploading}
                className="btn-primary w-full py-3 flex items-center justify-center space-x-2"
              >
                {isUploading ? (
                  <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    <span>Upload</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadFile;