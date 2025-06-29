import React, { useState } from 'react';
import { Upload, Lock, Unlock, Key, Download, FileText, Copy, Check } from 'lucide-react';

interface FileCryptoProps {
  onStatusChange: (message: string, type: 'success' | 'error' | 'info') => void;
}

const FileCrypto: React.FC<FileCryptoProps> = ({ onStatusChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState('');
  const [iv, setIv] = useState('');
  const [algorithm, setAlgorithm] = useState('AES');
  const [mode, setMode] = useState('ECB');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [downloadFilename, setDownloadFilename] = useState('');
  const [resultIv, setResultIv] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const API_BASE_URL =
  window.location.hostname === 'localhost'
    ? import.meta.env.VITE_DEV_API_BASE_URL
    : import.meta.env.VITE_PROD_API_BASE_URL;


  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const generateKey = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/generate_key`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ algorithm }),
      });

      const data = await response.json();
      
      if (data.success) {
        setKey(data.key);
        onStatusChange(`Generated ${algorithm} key successfully`, 'success');
      } else {
        onStatusChange(data.error || 'Failed to generate key', 'error');
      }
    } catch (error) {
      onStatusChange('Failed to connect to server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Clear previous results
      setDownloadUrl('');
      setDownloadFilename('');
      setResultIv('');
      onStatusChange(`Selected file: ${selectedFile.name}`, 'info');
    }
  };

  const encryptFile = async () => {
    if (!file) {
      onStatusChange('Please select a file to encrypt', 'error');
      return;
    }
    
    if (!key.trim()) {
      onStatusChange('Please enter or generate a key', 'error');
      return;
    }

    if (mode === 'CBC' && !iv.trim()) {
      onStatusChange('IV is required for CBC mode', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('key', key);
      formData.append('algorithm', algorithm);
      formData.append('mode', mode);
      if (mode === 'CBC' && iv) {
        formData.append('iv', iv);
      }

      const response = await fetch(`${API_BASE_URL}/encrypt_file`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setDownloadUrl(`${API_BASE_URL}/download/${data.filename}`);
        setDownloadFilename(data.filename);
        setResultIv(data.iv || '');
        onStatusChange('File encrypted successfully', 'success');
      } else {
        onStatusChange(data.error || 'File encryption failed', 'error');
      }
    } catch (error) {
      onStatusChange('Failed to connect to server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const decryptFile = async () => {
    if (!file) {
      onStatusChange('Please select a file to decrypt', 'error');
      return;
    }
    
    if (!key.trim()) {
      onStatusChange('Please enter the decryption key', 'error');
      return;
    }

    if (mode === 'CBC' && !iv.trim()) {
      onStatusChange('IV is required for CBC mode decryption', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('key', key);
      formData.append('algorithm', algorithm);
      formData.append('mode', mode);
      if (mode === 'CBC' && iv) {
        formData.append('iv', iv);
      }

      const response = await fetch(`${API_BASE_URL}/decrypt_file`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setDownloadUrl(`${API_BASE_URL}/download/${data.filename}`);
        setDownloadFilename(data.filename);
        onStatusChange('File decrypted successfully', 'success');
      } else {
        onStatusChange(data.error || 'File decryption failed', 'error');
      }
    } catch (error) {
      onStatusChange('Failed to connect to server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">File Upload</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Select File
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/30 border-dashed rounded-lg cursor-pointer bg-black/20 hover:bg-black/30 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  {file ? (
                    <div className="text-center">
                      <p className="text-sm text-white font-medium">{file.name}</p>
                      <p className="text-xs text-gray-400">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">Any file type supported</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Algorithm
            </label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full p-3 bg-black/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="AES">AES (128-bit)</option>
              <option value="DES">DES (64-bit)</option>
              <option value="3DES">3DES (192-bit)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Mode
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full p-3 bg-black/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ECB">ECB</option>
              <option value="CBC">CBC</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-200">
              Key (Base64)
            </label>
            <button
              onClick={generateKey}
              disabled={isLoading}
              className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50"
            >
              <Key className="w-4 h-4" />
              <span className="text-sm">Generate</span>
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter base64-encoded key or generate one..."
              className="w-full p-3 pr-12 bg-black/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {key && (
              <button
                onClick={() => copyToClipboard(key, 'key')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {copiedField === 'key' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {mode === 'CBC' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              IV (Base64) - Required for CBC mode
            </label>
            <div className="relative">
              <input
                type="text"
                value={iv}
                onChange={(e) => setIv(e.target.value)}
                placeholder="Enter base64-encoded IV..."
                className="w-full p-3 pr-12 bg-black/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {iv && (
                <button
                  onClick={() => copyToClipboard(iv, 'iv')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {copiedField === 'iv' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          onClick={encryptFile}
          disabled={isLoading || !file}
          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50"
        >
          <Lock className="w-5 h-5" />
          <span>{isLoading ? 'Encrypting...' : 'Encrypt File'}</span>
        </button>

        <button
          onClick={decryptFile}
          disabled={isLoading || !file}
          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50"
        >
          <Unlock className="w-5 h-5" />
          <span>{isLoading ? 'Decrypting...' : 'Decrypt File'}</span>
        </button>
      </div>

      {/* Results Section */}
      {downloadUrl && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Result</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/20">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="text-white font-medium">{downloadFilename}</p>
                  <p className="text-sm text-gray-400">Processed file ready for download</p>
                </div>
              </div>
              <button
                onClick={downloadFile}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>

            {resultIv && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-200">
                    Generated IV (save this for decryption)
                  </label>
                  <button
                    onClick={() => copyToClipboard(resultIv, 'resultIv')}
                    className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                  >
                    {copiedField === 'resultIv' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm">Copy</span>
                  </button>
                </div>
                <pre className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white text-sm overflow-x-auto">
                  {resultIv}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileCrypto;