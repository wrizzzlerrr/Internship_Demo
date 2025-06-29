import React, { useState } from 'react';
import { Lock, Unlock, Key, Copy, Check } from 'lucide-react';

interface TextCryptoProps {
  onStatusChange: (message: string, type: 'success' | 'error' | 'info') => void;
}

const TextCrypto: React.FC<TextCryptoProps> = ({ onStatusChange }) => {
  const [text, setText] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [key, setKey] = useState('');
  const [iv, setIv] = useState('');
  const [algorithm, setAlgorithm] = useState('AES');
  const [mode, setMode] = useState('ECB');
  const [result, setResult] = useState('');
  const [resultIv, setResultIv] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const encryptText = async () => {
    if (!text.trim()) {
      onStatusChange('Please enter text to encrypt', 'error');
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
      const response = await fetch(`${API_BASE_URL}/encrypt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          key,
          algorithm,
          mode,
          iv: mode === 'CBC' ? iv : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.ciphertext);
        setResultIv(data.iv || '');
        onStatusChange('Text encrypted successfully', 'success');
      } else {
        onStatusChange(data.error || 'Encryption failed', 'error');
      }
    } catch (error) {
      onStatusChange('Failed to connect to server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const decryptText = async () => {
    if (!ciphertext.trim()) {
      onStatusChange('Please enter ciphertext to decrypt', 'error');
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
      const response = await fetch(`${API_BASE_URL}/decrypt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ciphertext,
          key,
          algorithm,
          mode,
          iv: mode === 'CBC' ? iv : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.plaintext);
        onStatusChange('Text decrypted successfully', 'success');
      } else {
        onStatusChange(data.error || 'Decryption failed', 'error');
      }
    } catch (error) {
      onStatusChange('Failed to connect to server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Input</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Text to Encrypt
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to encrypt..."
              className="w-full p-3 bg-black/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Ciphertext to Decrypt
            </label>
            <textarea
              value={ciphertext}
              onChange={(e) => setCiphertext(e.target.value)}
              placeholder="Enter base64-encoded ciphertext to decrypt..."
              className="w-full p-3 bg-black/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
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
          onClick={encryptText}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50"
        >
          <Lock className="w-5 h-5" />
          <span>{isLoading ? 'Encrypting...' : 'Encrypt'}</span>
        </button>

        <button
          onClick={decryptText}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50"
        >
          <Unlock className="w-5 h-5" />
          <span>{isLoading ? 'Decrypting...' : 'Decrypt'}</span>
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Result</h3>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-200">
                  Output
                </label>
                <button
                  onClick={() => copyToClipboard(result, 'result')}
                  className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                >
                  {copiedField === 'result' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span className="text-sm">Copy</span>
                </button>
              </div>
              <pre className="w-full p-3 bg-black/30 border border-white/20 rounded-lg text-white text-sm overflow-x-auto">
                {result}
              </pre>
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

export default TextCrypto;