import React from 'react';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  // In your actual app, you'll have useNavigate from react-router-dom
  const navigate = (path) => {
    // This is a placeholder - in your real app, use useNavigate() from react-router-dom
    console.log('Navigate to:', path);
    // For demo purposes, we'll just reload or show an alert
    if (path === '/') {
      window.location.href = '/';
    } else if (path === -1) {
      window.history.back();
    } else {
      window.location.href = path;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-75"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-150"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* 404 Number with glow effect */}
        <div className="relative mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 text-9xl md:text-[12rem] font-bold text-purple-500 opacity-20 blur-sm">
            404
          </div>
        </div>

        {/* Error message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-300 max-w-md mx-auto leading-relaxed">
            The page you're looking for seems to have vanished into the digital void. 
            Don't worry, it happens to the best of us.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
          >
            <Home className="w-5 h-5 group-hover:animate-bounce" />
            Go Home
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 group-hover:animate-bounce" />
            Go Back
          </button>
        </div>

        {/* Search suggestion */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Search className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-semibold">Quick Navigation</h3>
          </div>
          <div className="space-y-2 text-left">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full text-left text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors duration-200"
            >
              → Dashboard
            </button>
            <button
              onClick={() => navigate('/students')}
              className="w-full text-left text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors duration-200"
            >
              → Students
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full text-left text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors duration-200"
            >
              → Login
            </button>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-100"></div>
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-ping delay-200"></div>
      </div>
    </div>
  );
};

export default NotFound;