'use client';
import React, { useState, useEffect } from "react";

export default function PartnerOnboardingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    location: '',
    email: '',
    website: ''
  });
  const [hoveredCard, setHoveredCard] = useState(null);

  const steps = [
    {
      number: "01",
      title: "Partner Registration",
      description: "Brand/Event/DAO visits MetaMiles Partner Portal",
      details: [
        "Register as verified reward partner",
        "Set up organization profile",
        "Complete KYC verification",
        "Define partnership goals"
      ],
      icon: "🏢",
      color: "from-orange-500 to-amber-500"
    },
    {
      number: "02", 
      title: "Perk Configuration",
      description: "Define region-specific rewards and inventory",
      details: [
        "Set region-specific rewards (e.g., 'Spend $200 in SF → get concert ticket')",
        "Upload reward NFTs and NFC unlock codes",
        "Configure airdrops and partner drops",
        "Set thresholds & tier gating logic (Bronze/Silver/Gold)"
      ],
      icon: "⚙️",
      color: "from-amber-500 to-yellow-500"
    },
    {
      number: "03",
      title: "Integration & Monitoring", 
      description: "MetaMiles SDK/Reward APIs implementation",
      details: [
        "Validate tier-based access",
        "Distribute perks automatically",
        "Track redemptions and participation",
        "Monitor analytics and engagement"
      ],
      icon: "📊",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const organizationTypes = [
    "Brand/Retailer",
    "Event Organizer", 
    "DAO/Community",
    "Restaurant/Hospitality",
    "Entertainment Venue",
    "Tech Company",
    "Other"
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);

    return () => clearInterval(stepInterval);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

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

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black text-white overflow-hidden">
      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes step-glow {
          0%, 100% { box-shadow: 0 10px 40px rgba(249, 115, 22, 0.2); }
          50% { box-shadow: 0 20px 60px rgba(249, 115, 22, 0.4); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .gradient-text {
          background: linear-gradient(-45deg, #f97316, #f59e0b, #fb923c, #f97316);
          background-size: 400% 400%;
          animation: gradient-shift 3s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .step-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
        }
        .step-card:hover {
          transform: translateY(-10px) scale(1.02);
          animation: step-glow 2s ease-in-out infinite;
        }
        .step-active {
          animation: pulse-glow 2s ease-in-out infinite;
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
        .step-card:hover .shimmer-effect::after {
          left: 100%;
        }
        .floating-icon {
          animation: float 3s ease-in-out infinite;
        }
        .form-glow {
          box-shadow: 0 0 30px rgba(249, 115, 22, 0.1);
          transition: box-shadow 0.3s ease;
        }
        .form-glow:focus-within {
          box-shadow: 0 0 40px rgba(249, 115, 22, 0.2);
        }
      `}</style>

      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-gray-900 to-black" />
        <SubtleGrid />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" />
      </div>

      {/* Header */}
      <div className="relative z-10 pt-16 pb-8">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="block text-white mb-2" style={{ fontFamily: "Holtwood One SC, serif", fontSize: "3rem", letterSpacing: "0.3rem" }}>
                Partner
              </span>
              <span className="block gradient-text" style={{ fontFamily: "Holtwood One SC, serif", fontSize: "2.5rem", letterSpacing: "0.3rem" }}>
                Onboarding
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join the MetaMiles ecosystem and unlock exclusive rewards for your community
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pb-16">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          
          {/* Process Steps */}
          <div className="mb-16">
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`step-card bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20 cursor-pointer ${
                    activeStep === index ? 'step-active' : ''
                  } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => setActiveStep(index)}
                >
                  {/* Step Number */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`text-6xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent shimmer-effect`}>
                      {step.number}
                    </div>
                    <div className="floating-icon text-4xl">
                      {step.icon}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white shimmer-effect">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Step Details */}
                    <div className="space-y-2 pt-4">
                      {step.details.map((detail, detailIndex) => (
                        <div 
                          key={detailIndex}
                          className={`text-xs text-gray-400 transition-all duration-300 ${
                            hoveredCard === index ? 'text-orange-300' : ''
                          }`}
                        >
                          • {detail}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100" />
                </div>
              ))}
            </div>
          </div>

          {/* Registration Form */}
          <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="form-glow bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl p-8 lg:p-12 border border-orange-500/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold gradient-text mb-4">
                  Start Your Partnership Journey
                </h2>
                <p className="text-gray-300">
                  Complete the form below to begin your MetaMiles partnership
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="block text-sm font-medium text-gray-300 mb-2">
                      Organization Name *
                    </div>
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-white placeholder-gray-400"
                      placeholder="Enter your organization name"
                    />
                  </div>

                  <div>
                    <div className="block text-sm font-medium text-gray-300 mb-2">
                      Organization Type *
                    </div>
                    <select
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-white"
                    >
                      <option value="">Select type...</option>
                      {organizationTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="block text-sm font-medium text-gray-300 mb-2">
                      Primary Location *
                    </div>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-white placeholder-gray-400"
                      placeholder="City, State/Country"
                    />
                  </div>

                  <div>
                    <div className="block text-sm font-medium text-gray-300 mb-2">
                      Contact Email *
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-white placeholder-gray-400"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="block text-sm font-medium text-gray-300 mb-2">
                    Website URL
                  </div>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 text-white placeholder-gray-400"
                    placeholder="https://your-website.com"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    onClick={handleSubmit}
                    className="group relative flex-1 px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold text-lg rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center justify-center">
                      Submit Application
                      <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>

                  <button
                    onClick={() => console.log('Schedule demo clicked')}
                    className="group px-8 py-4 border-2 border-orange-500/30 text-orange-300 font-semibold text-lg rounded-lg hover:bg-orange-500/10 hover:border-orange-400/60 transition-all duration-300 backdrop-blur-sm"
                  >
                    <span className="flex items-center justify-center">
                      Schedule Demo
                      <svg className="ml-2 w-5 h-5 group-hover:rotate-45 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                  </button>
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