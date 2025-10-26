
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { MoonIcon } from './icons/MoonIcon';
import { SunIcon } from './icons/SunIcon';
import { KeyboardIcon } from './icons/KeyboardIcon';

interface HeaderProps {
  onShowShortcuts?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowShortcuts }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="bg-gray-900/70 dark:bg-gray-900/70 light:bg-white/70 backdrop-blur-sm border-b border-gray-800 dark:border-gray-800 light:border-gray-200 sticky top-0 z-10">
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
            <h1 className="text-xl font-bold text-gray-50 dark:text-gray-50 light:text-gray-900">
              Query<span className="text-cyan-400">GPT</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <p className="hidden md:block text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 mr-2">AI Agent for English to SQL</p>
            {onShowShortcuts && (
              <button
                onClick={onShowShortcuts}
                className="p-2 rounded-md text-gray-400 hover:text-gray-200 dark:text-gray-400 dark:hover:text-gray-200 light:text-gray-600 light:hover:text-gray-900 bg-gray-800 dark:bg-gray-800 light:bg-gray-100 hover:bg-gray-700 dark:hover:bg-gray-700 light:hover:bg-gray-200 transition-colors"
                aria-label="Keyboard shortcuts"
                title="Keyboard shortcuts (Ctrl + /)"
              >
                <KeyboardIcon className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-400 hover:text-gray-200 dark:text-gray-400 dark:hover:text-gray-200 light:text-gray-600 light:hover:text-gray-900 bg-gray-800 dark:bg-gray-800 light:bg-gray-100 hover:bg-gray-700 dark:hover:bg-gray-700 light:hover:bg-gray-200 transition-colors"
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
