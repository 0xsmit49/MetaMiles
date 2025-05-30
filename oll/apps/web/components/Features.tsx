import React, { useState, useEffect } from 'react';

const FeaturesSection = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCardClick = (id) => {
    setActiveCard(activeCard === id ? null : id);
  };

  const features = [
    {
      id: 1,
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      gradient: "from-orange-500 to-amber-500",
      glowColor: "orange-500",
      title: "Lightning Fast",
      description: "Instant MetaMiles transactions with lightning-fast processing. Experience seamless rewards tracking across all your purchases."
    },
    {
      id: 2,
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      gradient: "from-amber-500 to-orange-600",
      glowColor: "amber-500",
      title: "Secure Wallet",
      description: "Bank-grade security with MetaMask integration. Your MetaMiles and rewards are protected with industry-leading encryption."
    },
    {
      id: 3,
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      gradient: "from-orange-600 to-yellow-600",
      glowColor: "orange-600",
      title: "Earn Rewards",
      description: "Turn everyday spending into valuable MetaMiles. Unlock exclusive experiences and perks with every transaction."
    },
    {
      id: 4,
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      gradient: "from-yellow-600 to-amber-600",
      glowColor: "yellow-600",
      title: "Exclusive Access",
      description: "Get VIP access to crypto events, NFT drops, and exclusive partner experiences. Your MetaMiles unlock premium opportunities."
    },
    {
      id: 5,
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      gradient: "from-amber-600 to-orange-500",
      glowColor: "amber-600",
      title: "Smart Analytics",
      description: "Track your spending patterns and maximize your rewards. AI-powered insights help you earn more MetaMiles efficiently."
    },
    {
      id: 6,
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: "from-orange-500 to-amber-500",
      glowColor: "orange-500",
      title: "Community Hub",
      description: "Join the MetaMask community of forward-thinking users. Share experiences and discover new ways to maximize your rewards."
    }
  ];

  const SubtleGrid = () => (
    <div className="absolute inset-0 opacity-5">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern
            id="featuresgrid"
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
        <rect width="100%" height="100%" fill="url(#featuresgrid)" />
      </svg>
    </div>
  );

  return (
    <div className="relative bg-gradient-to-br from-slate-950 via-gray-900 to-black text-white overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" />
        
        {/* Moving Gradient */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-amber-500/5 transition-all duration-1000"
          style={{
            transform: `translateX(${mousePosition.x * 0.02}px) translateY(${mousePosition.y * 0.02}px)`,
          }}
        />
      </div>

      <section className="relative z-10 container mx-auto px-6 py-20 max-w-7xl">
        {/* Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            <span className="block text-white mb-2"style={{ fontFamily: "Holtwood One SC, serif" , fontSize: "3rem",
              letterSpacing: "0.5rem",}}>Why Choose</span>
            <span className="block gradient-text" style={{ fontFamily: "Holtwood One SC, serif" , fontSize: "3rem",
              letterSpacing: "0.5rem",}}>
  MetaMiles ?
</span>

          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Experience the future of rewards with crypto-powered spending and exclusive MetaMiles benefits
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.id}
              onClick={() => handleCardClick(feature.id)}
              className={`relative group cursor-pointer transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Card Background */}
              <div className={`relative backdrop-blur-sm border rounded-2xl p-8 transition-all duration-300 overflow-hidden ${
                activeCard === feature.id 
                  ? 'bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/60 shadow-2xl shadow-orange-500/20' 
                  : 'bg-gradient-to-br from-gray-900 to-black border-orange-500/20 hover:border-orange-500/40'
              }`}>
                
                {/* Icon */}
                <div className={`relative z-10 w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${
                  activeCard === feature.id ? 'scale-110' : 'group-hover:scale-105'
                }`}>
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className={`relative z-10 text-2xl font-bold mb-4 tracking-tight transition-colors duration-300 ${
                  activeCard === feature.id ? 'text-orange-300' : 'text-white group-hover:text-orange-300'
                }`}>
                  {feature.title}
                </h3>
                <p className={`relative z-10 leading-relaxed transition-colors duration-300 ${
                  activeCard === feature.id ? 'text-gray-200' : 'text-gray-300 group-hover:text-gray-200'
                }`}>
                  {feature.description}
                </p>

                {/* Focus Indicator */}
                {activeCard === feature.id && (
                  <div className="absolute inset-0 rounded-2xl border-2 border-orange-500/80 pointer-events-none" />
                )}
              </div>

              {/* External Glow for Active Card */}
              {activeCard === feature.id && (
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-20 blur-xl transition-all duration-500 -z-10`} />
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/apply'}
              className="group relative px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold text-lg rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                Apply for MetaMask Card
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            
            
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesSection;