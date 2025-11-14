import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (!token) {
    return null;
  }

  return (
    <nav className="bg-white/95 backdrop-blur-xl border-b border-green-100/50 sticky top-0 z-50 shadow-xl shadow-green-100/20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-green-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/3 w-24 h-24 bg-emerald-200/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-7xl relative">
        <div className="flex items-center justify-between min-h-[80px] py-4">
          {/* Enhanced Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 rounded-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-2xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-mint-400 rounded-full animate-ping"></div>
            </div>
            <div className="group-hover:translate-x-1 transition-transform duration-300 hidden sm:block">
              <span className="font-display font-bold text-xl bg-gradient-to-r from-green-600 via-emerald-600 to-mint-600 bg-clip-text text-transparent">
                EmpowerRoute
              </span>
              <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500 rounded-full"></div>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation with Better Layout */}
          <div className="hidden lg:flex  items-center bg-white/90 backdrop-blur-sm rounded-2xl p-1.5 shadow-2xl border border-green-100/50 max-w-fit">
            <div className="flex items-center gap-1">

              {/* Jobs - Briefcase Icon */}
              <Link
                to="/jobs"
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                  isActive('/jobs') 
                    ? 'bg-gradient-to-br from-emerald-100 to-mint-100 shadow-lg shadow-emerald-200/50' 
                    : 'hover:bg-gradient-to-br hover:from-emerald-50 hover:to-mint-50 hover:shadow-md'
                }`}
                title="Jobs"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isActive('/jobs') 
                    ? 'bg-gradient-to-br from-emerald-500 to-mint-600 text-white shadow-md' 
                    : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 group-hover:from-emerald-200 group-hover:to-mint-200 group-hover:text-emerald-700'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  isActive('/jobs') ? 'text-emerald-700' : 'text-slate-600 group-hover:text-emerald-700'
                }`}>
                  Jobs
                </span>
                {isActive('/jobs') && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                )}
              </Link>

              {/* Resources - Book Icon */}
              <Link
                to="/resources"
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                  isActive('/resources') 
                    ? 'bg-gradient-to-br from-mint-100 to-green-100 shadow-lg shadow-mint-200/50' 
                    : 'hover:bg-gradient-to-br hover:from-mint-50 hover:to-green-50 hover:shadow-md'
                }`}
                title="Resources"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isActive('/resources') 
                    ? 'bg-gradient-to-br from-mint-500 to-green-600 text-white shadow-md' 
                    : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 group-hover:from-mint-200 group-hover:to-green-200 group-hover:text-mint-700'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  isActive('/resources') ? 'text-mint-700' : 'text-slate-600 group-hover:text-mint-700'
                }`}>
                  Resources
                </span>
                {isActive('/resources') && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-mint-500 rounded-full animate-pulse"></div>
                )}
              </Link>

              {/* Courses - Graduation Cap Icon */}
              <Link
                to="/courses"
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                  isActive('/courses') || location.pathname.startsWith('/courses/') 
                    ? 'bg-gradient-to-br from-green-100 to-emerald-100 shadow-lg shadow-green-200/50' 
                    : 'hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 hover:shadow-md'
                }`}
                title="Courses"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isActive('/courses') || location.pathname.startsWith('/courses/') 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md' 
                    : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 group-hover:from-green-200 group-hover:to-emerald-200 group-hover:text-green-700'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  isActive('/courses') || location.pathname.startsWith('/courses/') ? 'text-green-700' : 'text-slate-600 group-hover:text-green-700'
                }`}>
                  Courses
                </span>
                {(isActive('/courses') || location.pathname.startsWith('/courses/')) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </Link>
            

            
            {/* Profile Dropdown - User Icon */}
            <div className="relative group">
              <button
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                  isActive('/profile') || isActive('/dashboard') || isActive('/analytics') || isActive('/admin') 
                    ? 'bg-gradient-to-br from-green-100 to-emerald-100 shadow-lg shadow-green-200/50' 
                    : 'hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 hover:shadow-md'
                }`}
                title="Profile & Dashboard"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isActive('/profile') || isActive('/dashboard') || isActive('/analytics') || isActive('/admin') 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md' 
                    : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 group-hover:from-green-200 group-hover:to-emerald-200 group-hover:text-green-700'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  isActive('/profile') || isActive('/dashboard') || isActive('/analytics') || isActive('/admin') ? 'text-green-700' : 'text-slate-600 group-hover:text-green-700'
                }`}>
                  Profile
                </span>
                {(isActive('/profile') || isActive('/dashboard') || isActive('/analytics') || isActive('/admin')) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-green-100/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-2 space-y-1">
                  {/* Dashboard */}
                  <Link
                    to="/dashboard"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                      isActive('/dashboard') 
                        ? 'bg-green-100 text-green-700' 
                        : 'text-slate-600 hover:bg-green-50 hover:text-green-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="text-sm font-medium">Dashboard</span>
                  </Link>

                  {/* Profile */}
                  <Link
                    to="/profile"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                      isActive('/profile') 
                        ? 'bg-green-100 text-green-700' 
                        : 'text-slate-600 hover:bg-green-50 hover:text-green-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm font-medium">Profile</span>
                  </Link>

                  {/* Admin Links - Only show for admin users */}
                  {user?.role === 'admin' && (
                    <>
                      <div className="border-t border-green-100 my-1"></div>
                      
                      {/* Analytics */}
                      <Link
                        to="/analytics"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                          isActive('/analytics') 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="text-sm font-medium">Analytics</span>
                      </Link>

                      {/* Admin */}
                      <Link
                        to="/admin"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 ${
                          isActive('/admin') 
                            ? 'bg-orange-100 text-orange-700' 
                            : 'text-slate-600 hover:bg-orange-50 hover:text-orange-700'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-medium">Admin</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Enhanced User Menu Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="text-right bg-white/90 backdrop-blur-sm rounded-xl p-2.5 shadow-lg border border-green-100/50">
              <p className="text-sm font-semibold text-slate-900 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {user?.fullName}
              </p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-gradient-to-r from-red-50 to-red-100 text-red-600 rounded-xl hover:from-red-100 hover:to-red-200 hover:scale-105 transition-all duration-300 flex items-center gap-2 font-medium shadow-md hover:shadow-lg border border-red-200/50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden xl:block">Logout</span>
            </button>
          </div>

          {/* Mobile & Tablet Navigation */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Medium screen navigation */}
            <div className="hidden md:flex bg-white/90 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-green-100/50">
              <Link to="/profile" className={`p-2 rounded-lg transition-all duration-300 ${
                isActive('/profile') ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'text-slate-600 hover:bg-green-50'
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-green-50 hover:scale-105 transition-all duration-300 shadow-lg border border-green-100/50"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-green-100 animate-slide-up bg-white/95 backdrop-blur-sm">
            <div className="flex flex-col space-y-2">
              <Link
                to="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 font-medium ${
                  isActive('/jobs') 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'text-slate-600 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Jobs</span>
              </Link>
              <Link
                to="/resources"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 font-medium ${
                  isActive('/resources') 
                    ? 'bg-mint-100 text-mint-700' 
                    : 'text-slate-600 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Resources</span>
              </Link>
              <Link
                to="/courses"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 font-medium ${
                  isActive('/courses') || location.pathname.startsWith('/courses/') 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-slate-600 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
                <span>Courses</span>
              </Link>
              
              <div className="pt-2 border-t border-green-100 mt-2">
                <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Profile & Dashboard</p>
                
                {/* Dashboard */}
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 font-medium ${
                    isActive('/dashboard') 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-slate-600 hover:bg-green-50 hover:text-green-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Dashboard</span>
                </Link>

                {/* Profile */}
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 font-medium ${
                    isActive('/profile') 
                      ? 'bg-green-100 text-green-700' 
                      : 'text-slate-600 hover:bg-green-50 hover:text-green-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile</span>
                </Link>

                {/* Admin Links - Mobile */}
                {user?.role === 'admin' && (
                  <>
                    <div className="px-4 py-2">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Admin</p>
                    </div>
                    <Link
                      to="/analytics"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 font-medium ${
                        isActive('/analytics') 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>Analytics</span>
                    </Link>
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 font-medium ${
                        isActive('/admin') 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'text-slate-600 hover:bg-orange-50 hover:text-orange-700'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Admin</span>
                    </Link>
                  </>
                )}
              </div>
              
              <div className="pt-4 border-t border-green-100 mt-2">
                <div className="px-4 py-2 mb-3">
                  <p className="text-sm font-semibold text-slate-900">{user?.fullName}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
