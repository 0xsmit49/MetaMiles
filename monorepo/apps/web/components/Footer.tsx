import React, { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (email.trim()) {
      // Handle newsletter subscription
      console.log('Subscribing email:', email);
      setEmail('');
      // You can add your subscription logic here
    }
  };

  const SubtleGrid = () => (
    <div className="absolute inset-0 opacity-5">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern
            id="footergrid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgb(249 115 22 / 0.3)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#footergrid)" />
      </svg>
    </div>
  );

  return (
    <footer className="relative border-t border-orange-500/20 bg-gradient-to-br from-slate-950 via-gray-900 to-black text-white overflow-hidden">
      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-text {
          background: linear-gradient(-45deg, #f97316, #f59e0b, #fb923c, #f97316);
          background-size: 400% 400%;
          animation: gradient-shift 3s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-gray-900 to-black" />
        <SubtleGrid />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-orange-500/5 to-transparent" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" />
      </div>
      
      <div className="relative z-10 container mx-auto px-6 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-3xl font-bold gradient-text mb-4">
                MetaMask Card
              </h3>
              <p className="text-gray-300 mb-6">
                Experience the future of rewards with crypto-powered spending and exclusive MetaMiles benefits.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
             
              <a href="#" className="w-10 h-10 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5 text-orange-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5 text-orange-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5 text-orange-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">MetaMask Card</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-orange-300 transition-colors">Apply Now</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-300 transition-colors">MetaMiles Rewards</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-300 transition-colors">Crypto Spending</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-300 transition-colors">Wallet Integration</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-300 transition-colors">Security Features</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-300 transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-orange-300 transition-colors">How it Works</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-300 transition-colors">Getting Started</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-300 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-300 transition-colors">Community</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-300 transition-colors">Developer API</a></li>
              <li><a href="#" className="text-gray-300 hover:text-orange-300 transition-colors">Card Status</a></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Stay Updated</h4>
            <p className="text-gray-300 mb-4">
              Get the latest MetaMask Card updates and exclusive MetaMiles offers.
            </p>
            <div className="space-y-3">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-900/50 border border-orange-500/30 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-gray-800/50 transition-all backdrop-blur-sm"
                />
                <button 
                  onClick={handleSubscribe}
                  className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold rounded-r-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-300 hover:scale-105"
                >
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-400">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Support & Contact Section */}
        <div className="border-t border-orange-500/20 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div>
              <h5 className="text-white font-semibold mb-3">Contact Us</h5>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@metamask.io</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Global Service</span>
                </div>
              </div>
            </div>

            {/* Support Links */}
            <div>
              <h5 className="text-white font-semibold mb-3">Support</h5>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-gray-300 hover:text-orange-300 transition-colors">Help Center</a>
                <a href="#" className="block text-gray-300 hover:text-orange-300 transition-colors">Contact Support</a>
                <a href="#" className="block text-gray-300 hover:text-orange-300 transition-colors">Report an Issue</a>
                <a href="#" className="block text-gray-300 hover:text-orange-300 transition-colors">Card Security</a>
              </div>
            </div>

            {/* Legal Links */}
            <div>
              <h5 className="text-white font-semibold mb-3">Legal</h5>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-gray-300 hover:text-orange-300 transition-colors">Privacy Policy</a>
                <a href="#" className="block text-gray-300 hover:text-orange-300 transition-colors">Terms of Service</a>
                <a href="#" className="block text-gray-300 hover:text-orange-300 transition-colors">Card Agreement</a>
                <a href="#" className="block text-gray-300 hover:text-orange-300 transition-colors">Compliance</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-orange-500/20 pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-400">
            © 2025 MetaMask. All rights reserved.
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Built with 🧡 for the crypto community</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;