import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-emerald-900 to-green-900 text-gray-300 mt-auto relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-mint-600 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-8 left-8 w-3 h-3 bg-emerald-400 rounded-full animate-bounce opacity-30"></div>
      <div className="absolute top-16 right-16 w-2 h-2 bg-green-400 rounded-full animate-bounce opacity-40" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-16 left-20 w-4 h-4 bg-mint-400 rounded-full animate-bounce opacity-20" style={{animationDelay: '2s'}}></div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Enhanced Brand Section */}
          <div className="space-y-6">
            <div className="group">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  
                <img src='https://res.cloudinary.com/djcy5yslt/image/upload/v1763159761/i0xmr45nj7tm4ujoqu8i.png'/>
              
                </div>
                <div>
                  <h3 className="text-white font-bold text-2xl bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">CareerLift</h3>
                  <p className="text-sm text-emerald-400 font-medium">🌟 Career Growth Platform</p>
                </div>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Empowering youth with <span className="text-emerald-400 font-semibold">AI-driven career opportunities</span> and 
              personalized learning resources for sustainable economic growth and professional success.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 bg-black/20 rounded-2xl p-4 backdrop-blur-sm border border-emerald-800/30">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-400">10K+</p>
                <p className="text-xs text-gray-400">Users Empowered</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">500+</p>
                <p className="text-xs text-gray-400">Courses Created</p>
              </div>
            </div>

            {/* Enhanced Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="group p-3 bg-gradient-to-r from-emerald-600/20 to-green-600/20 rounded-xl hover:from-emerald-600/40 hover:to-green-600/40 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 backdrop-blur-sm border border-emerald-700/30">
                <svg className="w-6 h-6 text-emerald-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="group p-3 bg-gradient-to-r from-green-600/20 to-mint-600/20 rounded-xl hover:from-green-600/40 hover:to-mint-600/40 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 backdrop-blur-sm border border-green-700/30">
                <svg className="w-6 h-6 text-green-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="group p-3 bg-gradient-to-r from-mint-600/20 to-emerald-600/20 rounded-xl hover:from-mint-600/40 hover:to-emerald-600/40 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 backdrop-blur-sm border border-mint-700/30">
                <svg className="w-6 h-6 text-mint-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Enhanced Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xl mb-6 flex items-center space-x-2">
              <span className="w-2 h-6 bg-gradient-to-b from-green-400 to-emerald-600 rounded-full"></span>
              <span>Quick Access</span>
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/dashboard" className="group flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-emerald-800/20">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform border border-green-600/30">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span className="font-medium">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="group flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-green-800/20">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500/20 to-mint-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform border border-emerald-600/30">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-medium">Browse Jobs</span>
                </Link>
              </li>
              <li>
                <Link to="/resources" className="group flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-mint-800/20">
                  <div className="w-8 h-8 bg-gradient-to-r from-mint-500/20 to-green-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform border border-mint-600/30">
                    <svg className="w-4 h-4 text-mint-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span className="font-medium">Learning Hub</span>
                </Link>
              </li>
              <li>
                <Link to="/profile" className="group flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-emerald-800/20">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform border border-green-600/30">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="font-medium">My Profile</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Enhanced Resources */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xl mb-6 flex items-center space-x-2">
              <span className="w-2 h-6 bg-gradient-to-b from-emerald-400 to-mint-600 rounded-full"></span>
              <span>Resources</span>
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="group flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-green-800/20">
                  <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  </div>
                  <span className="font-medium">Career Guidance</span>
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-mint-800/20">
                  <div className="w-6 h-6 bg-mint-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="w-2 h-2 bg-mint-400 rounded-full"></span>
                  </div>
                  <span className="font-medium">Skill Development</span>
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-emerald-800/20">
                  <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  </div>
                  <span className="font-medium">Interview Prep</span>
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-emerald-800/20">
                  <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  </div>
                  <span className="font-medium">AI Resume Builder</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Enhanced Support & Contact */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xl mb-6 flex items-center space-x-2">
              <span className="w-2 h-6 bg-gradient-to-b from-mint-400 to-green-600 rounded-full"></span>
              <span>Get Support</span>
            </h4>
            
            {/* Contact Info */}
            <div className="space-y-4 bg-black/20 rounded-2xl p-6 backdrop-blur-sm border border-green-700/30">
              <div className="flex items-center space-x-3 text-gray-300 group hover:text-white transition-colors">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform border border-emerald-600/30">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-emerald-400">support@CareerLift.ai</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-300 group hover:text-white transition-colors">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500/20 to-mint-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform border border-green-600/30">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Live Chat</p>
                  <p className="text-sm text-green-400">Available 24/7</p>
                </div>
              </div>
            </div>

            {/* Quick Support Links */}
            <ul className="space-y-2">
              <li>
                <a href="#" className="group flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-mint-800/20">
                  <div className="w-6 h-6 bg-mint-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="w-2 h-2 bg-mint-400 rounded-full"></span>
                  </div>
                  <span className="font-medium">Help Center</span>
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-green-800/20">
                  <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  </div>
                  <span className="font-medium">FAQs & Tutorials</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Bar */}
      <div className="border-t border-emerald-800/50 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="text-center lg:text-left">
              <div className="text-gray-300 mb-2 flex items-center justify-center lg:justify-start space-x-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <span>© {currentYear} CareerLift - AI-Powered Career Platform</span>
              </div>
              <p className="text-sm text-gray-400 flex items-center justify-center lg:justify-start space-x-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>🌍 SDG 8: Decent Work and Economic Growth</span>
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-end items-center gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-all duration-300 hover:scale-105 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Privacy Policy</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-all duration-300 hover:scale-105 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Terms of Service</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-mint-400 transition-all duration-300 hover:scale-105 flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                <span>Cookie Settings</span>
              </a>
            </div>
          </div>
          
          {/* Floating Action Element */}
          <div className="absolute bottom-4 right-4">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce opacity-60"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
