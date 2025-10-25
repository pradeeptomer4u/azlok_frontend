'use client';

import React, { useState } from 'react';
import AzlokLogo from './icons/AzlokLogo';

interface WhatsAppChatButtonProps {
  phoneNumber: string; // Phone number with country code but without + or spaces
  welcomeMessage?: string;
  buttonText?: string;
  buttonClassName?: string;
  companyName?: string;
}

const WhatsAppChatButton: React.FC<WhatsAppChatButtonProps> = ({
  phoneNumber,
  welcomeMessage = "Hello! I'm interested in Azlok products and would like more information.",
  buttonText = "Chat Now",
  buttonClassName = "",
  companyName = 'Azlok Pvt Ltd',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the message for WhatsApp API
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp API URL
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    // Close the popup
    setIsOpen(false);
    setMessage('');
  };

  const defaultButtonClasses = "w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-md transition-all duration-300 flex items-center justify-center relative overflow-hidden group";
  const buttonClasses = buttonClassName || defaultButtonClasses;

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={buttonClasses}
        aria-label="Chat on WhatsApp"
      >
        {/* Animated shine effect */}
        <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-all duration-700"></span>
        
        {/* WhatsApp Icon with gradient background */}
        <div className="bg-white/20 rounded-full p-1 mr-2 relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20.5027 3.49734C18.2578 1.25244 15.2953 0 12.1466 0C5.50211 0 0.293302 5.20881 0.293302 11.8533C0.293302 13.9422 0.84678 16.0311 1.85335 17.8089L0.146484 24L6.50878 22.3203C8.23663 23.2268 10.1645 23.7068 12.1466 23.7068H12.1738C18.8182 23.7068 24 18.4979 24 11.8533C24 8.70465 22.7476 5.74223 20.5027 3.49734ZM12.1466 21.6719C10.3688 21.6719 8.61826 21.2188 7.10253 20.3662L6.72388 20.1467L2.93649 21.1533L3.96942 17.4727L3.72314 17.0674C2.78895 15.4961 2.30127 13.6914 2.30127 11.8533C2.30127 6.33545 6.62891 1.98047 12.1738 1.98047C14.7954 1.98047 17.2363 3.03369 19.0684 4.89307C20.9277 6.75244 21.9878 9.19336 21.9878 11.8533C21.9607 17.3984 17.6602 21.6719 12.1466 21.6719ZM17.6602 14.3203C17.3633 14.1816 15.8747 13.4375 15.605 13.3525C15.3354 13.2402 15.1431 13.1826 14.9236 13.4795C14.7041 13.7764 14.1426 14.4654 13.9775 14.6582C13.8125 14.8777 13.6202 14.9084 13.3232 14.7422C11.3955 13.7764 10.1104 13.0059 8.79785 10.8076C8.45654 10.2461 9.05859 10.2734 9.61328 9.16406C9.6958 8.97168 9.6416 8.80664 9.55908 8.66797C9.47656 8.5293 8.87451 7.04004 8.63379 6.44629C8.39307 5.87891 8.15234 5.95312 7.98731 5.93945C7.82227 5.93945 7.63672 5.93945 7.44434 5.93945C7.25195 5.93945 6.95801 6.02197 6.68848 6.31885C6.41895 6.61572 5.62988 7.35986 5.62988 8.84912C5.62988 10.3384 6.70215 11.7734 6.85449 11.9658C7.00684 12.1582 8.84619 14.9629 11.6377 16.2793C13.5928 17.1318 14.3369 17.1865 15.2979 17.0205C15.8747 16.9082 17.0508 16.252 17.2976 15.5631C17.5444 14.8742 17.5444 14.2803 17.4619 14.1543C17.3794 14.0283 17.9571 13.8906 17.6602 14.3203Z"
            />
          </svg>
        </div>
        
        {/* Button text with relative positioning to appear above the shine effect */}
        <span className="relative">{buttonText}</span>
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fadeIn relative">
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-green-200/10 to-transparent rounded-full blur-2xl"></div>
            
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 flex justify-between items-center relative">
              <div className="flex items-center">
                {/* Azlok logo */}
                <div className="bg-white rounded-full p-1 mr-2 shadow-sm">
                  <AzlokLogo width={24} height={24} />
                </div>
                <div>
                  <h3 className="text-white text-lg font-semibold">{companyName} Chat</h3>
                  <p className="text-green-100 text-xs">We typically reply in a few minutes</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 relative">
              <div className="mb-4">
                <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  Your Message
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-green-600 rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-300"></div>
                  <textarea
                    id="message"
                    rows={4}
                    className="relative bg-white w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder={welcomeMessage}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 relative group overflow-hidden"
                >
                  <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-all duration-700"></span>
                  <span className="relative flex items-center">
                    Chat Now
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </button>
              </div>
              
              {/* Powered by */}
              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-center items-center text-xs text-gray-500">
                <span>Powered by</span>
                <span className="ml-1 font-semibold text-green-600">{companyName}</span>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppChatButton;
