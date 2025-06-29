import { useState } from 'react';
import { Shield, FileText, Type, Github, Linkedin } from 'lucide-react';
import TextCrypto from './components/TextCrypto';
import FileCrypto from './components/FileCrypto';
import StatusAlert from './components/StatusAlert';

interface Alert {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

function App() {
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = (message: string, type: 'success' | 'error' | 'info') => {
    const newAlert: Alert = {
      id: Date.now(),
      message,
      type,
    };
    setAlerts(prev => [...prev, newAlert]);
  };

  const removeAlert = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

      {/* Main container */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Crypto Web Tool</h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Secure encryption and decryption for text and files using AES, DES, and 3DES algorithms
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('text')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'text'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Type className="w-5 h-5" />
                <span className="font-medium">Text Encryption</span>
              </button>
              <button
                onClick={() => setActiveTab('file')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'file'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">File Encryption</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'text' ? (
            <TextCrypto onStatusChange={showAlert} />
          ) : (
            <FileCrypto onStatusChange={showAlert} />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400">
          <p className="text-sm">
            Powered by industry-standard encryption algorithms • Built with security in mind
          </p>
          <div className="flex justify-center mt-4 space-x-4 text-xl">
            <a
              href="https://www.linkedin.com/in/mohd-rizwaan-ansari-99b2ab277/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <Linkedin />
            </a>
            <a
              href="https://github.com/wrizzzlerrr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <Github />
            </a>
          </div>
        </div>
      </div>

      {/* Status Alerts */}
      {alerts.map(alert => (
        <StatusAlert
          key={alert.id}
          message={alert.message}
          type={alert.type}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </div>
  );
}

export default App;
