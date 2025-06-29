import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface StatusAlertProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const StatusAlert: React.FC<StatusAlertProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/30 text-green-100';
      case 'error':
        return 'bg-red-500/20 border-red-500/30 text-red-100';
      case 'info':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-100';
      default:
        return 'bg-gray-500/20 border-gray-500/30 text-gray-100';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
      default:
        return <Info className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center space-x-3 p-4 rounded-lg border backdrop-blur-sm transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      } ${getAlertStyles()}`}
    >
      {getIcon()}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-2 text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default StatusAlert;