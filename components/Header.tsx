
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/70 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <svg
              className="w-8 h-8 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7v10m16-10v10M8 7v10m8-10v10m-4-7v4m-4-2h16"
              />
            </svg>
            <h1 className="text-xl font-bold text-gray-50">
              Query<span className="text-cyan-400">GPT</span>
            </h1>
          </div>
          <p className="hidden md:block text-sm text-gray-400">AI Agent for English to SQL</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
