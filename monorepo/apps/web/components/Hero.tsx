import React, { useState, useEffect } from "react";
import MyCustomComponent from './FLoatingDock';


export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [activeTier, setActiveTier] = useState(0);

  const tiers = [
    { name: "Bronze", spend: "$100", color: "from-amber-600 to-yellow-600", perk: "Coffee & Local Discounts" },
    { name: "Silver", spend: "$500", color: "from-gray-400 to-slate-500", perk: "Food Delivery & Merch" },
    { name: "Gold", spend: "$2,000", color: "from-yellow-500 to-amber-500", perk: "Exclusive Event Access" },
    { name: "Diamond", spend: "$5,000+", color: "from-blue-400 to-cyan-400", perk: "VIP Experiences" }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const tierInterval = setInterval(() => {
      setActiveTier((prev) => (prev + 1) % tiers.length);
    }, 3000);
    
    const handleMouseMove = (e) => {
      const rect = document.querySelector('.card-container')?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
          rawX: e.clientX - centerX,
          rawY: e.clientY - centerY
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(tierInterval);
    };
  }, []);

  const SubtleGrid = () => (
    <div className="absolute inset-0 opacity-5">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern
            id="subtlegrid"
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
        <rect width="100%" height="100%" fill="url(#subtlegrid)" />
      </svg>
    </div>
  );

  // Calculate transform based on flip state and hover state
  const getCardTransform = () => {
    let transform = 'perspective(1000px)';
    
    // Apply flip rotation first
    if (cardFlipped) {
      transform += ' rotateY(180deg)';
    }
    
    // Apply hover effects only if not flipped, or apply them differently when flipped
    if (cardHovered && !cardFlipped) {
      const rotateX = (mousePosition.y - 50) * 0.15;
      const rotateY = (mousePosition.x - 50) * 0.15;
      transform += ` rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
    } else if (cardHovered && cardFlipped) {
      // When flipped, still allow subtle hover effects but maintain the flip
      const rotateX = (mousePosition.y - 50) * 0.05;
      const rotateY = 180 + (mousePosition.x - 50) * 0.05;
      transform += ` rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    }
    
    return transform;
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black text-white overflow-hidden">
      <style jsx>{`
        @keyframes card-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes card-glow {
          0%, 100% { box-shadow: 0 10px 40px rgba(249, 115, 22, 0.2); }
          50% { box-shadow: 0 20px 60px rgba(249, 115, 22, 0.4); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes tier-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes holographic {
          0% { background-position: -100% 0; }
          100% { background-position: 100% 0; }
        }
        @keyframes logo-glow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(249, 115, 22, 0.3); }
          50% { transform: scale(1.1); box-shadow: 0 0 30px rgba(249, 115, 22, 0.6); }
        }
        @keyframes number-typing {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes stats-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.1); }
          50% { box-shadow: 0 0 30px rgba(249, 115, 22, 0.2); }
        }
        @keyframes tier-rotate {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        .gradient-text {
          background: linear-gradient(-45deg, #f97316, #f59e0b, #fb923c, #f97316);
          background-size: 400% 400%;
          animation: gradient-shift 3s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .card-container {
          perspective: 1000px;
        }
        .card {
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
        }
        .card-face {
          backface-visibility: hidden;
          position: relative;
          overflow: hidden;
        }
        .card-back {
          transform: rotateY(180deg);
        }
        .card-interactive {
          animation: card-float 4s ease-in-out infinite;
        }
        .card-interactive:hover {
          animation: none;
        }
        .card-interactive:hover .card-face {
          box-shadow: 
            0 25px 50px rgba(249, 115, 22, 0.25),
            0 0 0 1px rgba(249, 115, 22, 0.1);
        }
        .card-interactive:hover .card-logo {
          animation: logo-glow 2s ease-in-out infinite;
        }
        .card-interactive:hover .holographic-overlay {
          opacity: 1;
          animation: holographic 2s linear infinite;
        }
        .card-interactive:hover .card-number {
          animation: number-typing 0.5s ease-in-out;
        }
        .card-interactive:hover .tier-badge {
          animation: shimmer 1.5s ease-in-out infinite;
        }
        .tier-active {
          animation: tier-pulse 2s ease-in-out infinite;
        }
        .holographic-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(249, 115, 22, 0.1) 50%,
            transparent 70%
          );
          background-size: 200% 200%;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .shimmer-effect {
          position: relative;
          overflow: hidden;
        }
        .shimmer-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(249, 115, 22, 0.3),
            transparent
          );
          transition: left 0.5s ease;
        }
        .card-interactive:hover .shimmer-effect::after {
          left: 100%;
        }
        .stats-card {
          animation: stats-glow 3s ease-in-out infinite;
        }
        .tier-icon {
          animation: tier-rotate 8s linear infinite;
        }
      `}</style>

      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-gray-900 to-black" />
        <SubtleGrid />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" />
      </div>

      {/* Floating Dock - positioned to avoid content overlap */}
      <div className="relative z-20">
        <MyCustomComponent/>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-15 items-center">
            
            {/* Left Content - Better spacing and positioning */}
            <div className="space-y-8 ml-0 lg:ml-20 xl:ml-32">
              <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="block text-white mb-2" style={{ fontFamily: "Holtwood One SC, serif" , fontSize: "4rem",
              letterSpacing: "0.5rem",}}>Unlock</span>
                  <span className="block gradient-text" style={{ fontFamily: "Holtwood One SC, serif" , fontSize: "3rem",
              letterSpacing: "0.5rem",}}>Real World</span>
                  <span className="block text-white" style={{ fontFamily: "Holtwood One SC, serif" , fontSize: "3rem",
              letterSpacing: "0.5rem",}}>Experiences</span>
                </h1>
              </div>

              <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                <p className="text-xl md:text-2xl text-gray-300 mb-6 leading-relaxed max-w-lg">
                  Every MetaMask Card transaction earns MetaMiles, unlocking exclusive perks, events, and experiences.
                </p>
               
              </div>
              <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
  <button
    onClick={() => window.location.href = '/apply'}
    className="group relative px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold text-base rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <span className="relative z-10 flex items-center justify-center">
      Start Earning Miles
      <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </span>
  </button>

  <button
    onClick={() => window.location.href = '/experiences'}
    className="group px-5 py-2.5 border-2 border-orange-500/30 text-orange-300 font-semibold text-base rounded-lg hover:bg-orange-500/10 hover:border-orange-400/60 transition-all duration-300 backdrop-blur-sm"
  >
    <span className="flex items-center justify-center">
      View Experiences
      <svg className="ml-2 w-4 h-4 group-hover:rotate-45 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </span>
  </button>
</div>

              
            </div>

            {/* Right Content - Interactive Card */}
            <div
  className={`flex flex-col items-center lg:items-start gap-4 transition-all duration-1000 delay-300 ${
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
  }`}
>
<div className="card-container p-0 m-0">
                <div 
                  className="card card-interactive"
                  onMouseEnter={() => setCardHovered(true)}
                  onMouseLeave={() => setCardHovered(false)}
                  onClick={() => setCardFlipped(!cardFlipped)}
                  style={{
                    transform: getCardTransform(),
                    filter: cardHovered ? 'drop-shadow(0 25px 50px rgba(249, 115, 22, 0.15))' : 'none'
                  }}
                >
                  {/* Card Front */}
                  <div className="card-face w-80 h-48 bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl p-6 cursor-pointer border border-orange-500/20">
                    <div className="holographic-overlay"></div>
                    
                    {/* MetaMask Logo */}
                    
    <div className="w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 507.83 470.86"
        className="w-full h-full"
        style={{ transform: "scale(1)", transformOrigin: "center" }}
      >
        <defs>
          <style>
            {`.a{fill:#e2761b;stroke:#e2761b;}
              .a,.b,.c,.d,.e,.f,.g,.h,.i,.j{stroke-linecap:round;stroke-linejoin:round;}
              .b{fill:#e4761b;stroke:#e4761b;}
              .c{fill:#d7c1b3;stroke:#d7c1b3;}
              .d{fill:#233447;stroke:#233447;}
              .e{fill:#cd6116;stroke:#cd6116;}
              .f{fill:#e4751f;stroke:#e4751f;}
              .g{fill:#f6851b;stroke:#f6851b;}
              .h{fill:#c0ad9e;stroke:#c0ad9e;}
              .i{fill:#161616;stroke:#161616;}
              .j{fill:#763d16;stroke:#763d16;`}
          </style>
        </defs>

        {/* Group all shapes and transform them */}
        <g>
          <polygon className="a" points="482.09 0.5 284.32 147.38 320.9 60.72 482.09 0.5" />
          <polygon className="b" points="25.54 0.5 221.72 148.77 186.93 60.72 25.54 0.5" />
          <polygon className="b" points="410.93 340.97 358.26 421.67 470.96 452.67 503.36 342.76 410.93 340.97" />
          <polygon className="b" points="4.67 342.76 36.87 452.67 149.57 421.67 96.9 340.97 4.67 342.76" />
          <polygon className="b" points="143.21 204.62 111.8 252.13 223.7 257.1 219.73 136.85 143.21 204.62" />
          <polygon className="b" points="364.42 204.62 286.91 135.46 284.32 257.1 396.03 252.13 364.42 204.62" />
          <polygon className="b" points="149.57 421.67 216.75 388.87 158.71 343.55 149.57 421.67" />
          <polygon className="b" points="290.88 388.87 358.26 421.67 348.92 343.55 290.88 388.87" />
          <polygon className="c" points="358.26 421.67 290.88 388.87 296.25 432.8 295.65 451.28 358.26 421.67" />
          <polygon className="c" points="149.57 421.67 212.18 451.28 211.78 432.8 216.75 388.87 149.57 421.67" />
          <polygon className="d" points="213.17 314.54 157.12 298.04 196.67 279.95 213.17 314.54" />
          <polygon className="d" points="294.46 314.54 310.96 279.95 350.71 298.04 294.46 314.54" />
          <polygon className="e" points="149.57 421.67 159.11 340.97 96.9 342.76 149.57 421.67" />
          <polygon className="e" points="348.72 340.97 358.26 421.67 410.93 342.76 348.72 340.97" />
          <polygon className="e" points="396.03 252.13 284.32 257.1 294.66 314.54 311.16 279.95 350.91 298.04 396.03 252.13" />
          <polygon className="e" points="157.12 298.04 196.87 279.95 213.17 314.54 223.7 257.1 111.8 252.13 157.12 298.04" />
          <polygon className="f" points="111.8 252.13 158.71 343.55 157.12 298.04 111.8 252.13" />
          <polygon className="f" points="350.91 298.04 348.92 343.55 396.03 252.13 350.91 298.04" />
          <polygon className="f" points="223.7 257.1 213.17 314.54 226.29 382.31 229.27 293.07 223.7 257.1" />
          <polygon className="f" points="284.32 257.1 278.96 292.87 281.34 382.31 294.66 314.54 284.32 257.1" />
          <polygon className="g" points="294.66 314.54 281.34 382.31 290.88 388.87 348.92 343.55 350.91 298.04 294.66 314.54" />
          <polygon className="g" points="157.12 298.04 158.71 343.55 216.75 388.87 226.29 382.31 213.17 314.54 157.12 298.04" />
          <polygon className="h" points="295.65 451.28 296.25 432.8 291.28 428.42 216.35 428.42 211.78 432.8 212.18 451.28 149.57 421.67 171.43 439.55 215.75 470.36 291.88 470.36 336.4 439.55 358.26 421.67 295.65 451.28" />
          <polygon className="i" points="290.88 388.87 281.34 382.31 226.29 382.31 216.75 388.87 211.78 432.8 216.35 428.42 291.28 428.42 296.25 432.8 290.88 388.87" />
          <polygon className="j" points="490.44 156.92 507.33 75.83 482.09 0.5 290.88 142.41 364.42 204.62 468.37 235.03 491.43 208.2 481.49 201.05 497.39 186.54 485.07 177 500.97 164.87 490.44 156.92" />
          <polygon className="j" points="0.5 75.83 17.39 156.92 6.66 164.87 22.56 177 10.44 186.54 26.34 201.05 16.4 208.2 39.26 235.03 143.21 204.62 216.75 142.41 25.54 0.5 0.5 75.83" />
          <polygon className="g" points="468.37 235.03 364.42 204.62 396.03 252.13 348.92 343.55 410.93 342.76 503.36 342.76 468.37 235.03" />
          <polygon className="g" points="143.21 204.62 39.26 235.03 4.67 342.76 96.9 342.76 158.71 343.55 111.8 252.13 143.21 204.62" />
          <polygon className="g" points="284.32 257.1 290.88 142.41 321.1 60.72 186.93 60.72 216.75 142.41 223.7 257.1 226.09 293.27 226.29 382.31 281.34 382.31 281.74 293.27 284.32 257.1" />
        </g>
      </svg>
    </div>
                    {/* Card Number */}
                    <div className="mb-6">
                      <div className="card-number text-lg font-mono text-white tracking-wider">
                        •••• •••• •••• 8421
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">MILES EARNED</div>
                        <div className="text-sm font-semibold text-orange-400 shimmer-effect">2,847</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400 mb-1">CURRENT TIER</div>
                        <div className="text-sm font-semibold text-white shimmer-effect">GOLD</div>
                      </div>
                    </div>
                  </div>

                  {/* Card Back */}
                  <div className="card-face card-back absolute inset-0 w-80 h-48 bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl p-6 cursor-pointer border border-orange-500/20">
                    <div className="holographic-overlay"></div>
                    
                    {/* Back Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-sm font-semibold text-orange-400">MetaMiles Portal</div>
                      <div className="text-xs text-gray-400">Click to flip back</div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="text-xs text-gray-400 mb-2">Progress to Diamond</div>
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full shimmer-effect transition-all duration-300" style={{width: cardHovered ? '65%' : '57%'}}></div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">$2,153 more to unlock</div>
                    </div>
                    
                    {/* Available Unlocks */}
                    <div className="space-y-2">
                      <div className="text-xs text-orange-400 font-semibold shimmer-effect">Available Unlocks:</div>
                      <div className="text-xs text-gray-300 transition-all duration-300 hover:text-orange-300">• VIP Concert Access NFT</div>
                      <div className="text-xs text-gray-300 transition-all duration-300 hover:text-orange-300">• Exclusive DAO Summit Pass</div>
                      <div className="text-xs text-gray-300 transition-all duration-300 hover:text-orange-300">• Partner Restaurant Rewards</div>
                    </div>
                    
                    {/* Support */}
                    <div className="mt-4 text-xs text-orange-400 shimmer-effect">
                      View in MetaMiles Portal →
                    </div>
                  </div>
                </div>
              </div>
              
              
            </div>
           
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
      
    </div>
  );
}