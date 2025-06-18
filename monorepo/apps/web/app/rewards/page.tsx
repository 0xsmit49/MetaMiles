'use client';
import React, { useState, useEffect } from 'react';
import { TrendingUp, Gift, Award, MapPin, Clock, Star, Zap, Trophy, Calendar, ChevronRight, Target, Flame, Sparkles, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import MyCustomComponent from '../../components/FLoatingDock';
// Tier Progress Component
const TierProgress = ({ currentTier, monthlySpend, streak, isVisible, onToggle }) => {
  const tiers = [
    { name: 'Bronze', threshold: 100, color: 'from-amber-600 to-yellow-600', icon: '🥉' },
    { name: 'Silver', threshold: 500, color: 'from-gray-400 to-slate-500', icon: '🥈' },
    { name: 'Gold', threshold: 2000, color: 'from-yellow-500 to-amber-500', icon: '🥇' },
    { name: 'Diamond', threshold: 5000, color: 'from-blue-400 to-cyan-400', icon: '💎' }
  ];

  const getCurrentTierInfo = () => {
    const current = tiers.find(t => t.name === currentTier);
    const currentIndex = tiers.indexOf(current);
    const next = tiers[currentIndex + 1];
    return { current, next };
  };

  const { current: currentTierInfo, next: nextTierInfo } = getCurrentTierInfo();
  const progressPercentage = nextTierInfo 
    ? ((monthlySpend - currentTierInfo.threshold) / (nextTierInfo.threshold - currentTierInfo.threshold)) * 100
    : 100;

  return (
    <div className="bg-gradient-to-r from-gray-900/50 to-black/50 rounded-2xl border border-orange-500/20 backdrop-blur-sm">
      <div className="p-4 flex items-center justify-between cursor-pointer" onClick={onToggle}>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-orange-400" />
          Tier Progress
        </h2>
        <button className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
          {isVisible ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>
      
      {isVisible && (
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{currentTierInfo.icon}</div>
              <div>
                <h3 className="text-xl font-semibold">{currentTier} Tier</h3>
                <p className="text-gray-400">Keep spending to maintain your status</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Monthly Spend</div>
              <div className="text-2xl font-bold text-orange-400">${monthlySpend.toLocaleString()}</div>
            </div>
          </div>

          {nextTierInfo && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to {nextTierInfo.name}</span>
                  <span>${nextTierInfo.threshold - monthlySpend} more needed</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {Math.round(progressPercentage)}% complete • {29 - new Date().getDate()} days left this month
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-sm text-orange-400">
                <Flame className="w-4 h-4" />
                <span>{streak}-month {currentTier} streak</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Claimable Rewards Component




// Analytics Component

// Regional Drops Component
const RegionalDrops = ({ localDrops, isVisible, onToggle }) => {
  return (
    <div className="bg-gradient-to-r from-gray-900/50 to-black/50 rounded-2xl border border-orange-500/20 backdrop-blur-sm">
      <div className="p-4 flex items-center justify-between cursor-pointer" onClick={onToggle}>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-400" />
          Regional Drops
          <span className="text-sm text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
            {localDrops.filter(d => d.active).length} Active
          </span>
        </h2>
        <button className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
          {isVisible ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isVisible && (
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {localDrops.map(drop => (
              <div 
                key={drop.id}
                className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 border transition-all duration-300 hover:scale-105 ${
                  drop.active 
                    ? 'border-orange-500/30 hover:border-orange-500/60' 
                    : 'border-gray-700/30 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    drop.active ? 'bg-green-600' : 'bg-gray-600'
                  }`}>
                    {drop.active ? 'ACTIVE' : 'ENDED'}
                  </div>
                  <div className="text-xs text-gray-400">{drop.location}</div>
                </div>
                
                <h3 className="font-semibold mb-2">{drop.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{drop.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-orange-400 font-semibold">{drop.reward}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {drop.timeLeft}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400">{drop.participants} participants</span>
                  <span className="text-xs text-orange-400"> Trending</span>
                </div>
                
                <button
                  disabled={!drop.active}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    drop.active
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {drop.active ? 'Claim Drop' : 'Ended'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Dashboard Component
const MetaMilesDashboard = () => {
  const [claimedRewards, setClaimedRewards] = useState(new Set());
  const [currentTier, setCurrentTier] = useState('Gold');
  const [monthlySpend, setMonthlySpend] = useState(2847);
  const [showConfetti, setShowConfetti] = useState(false);
  const [streak, setStreak] = useState(3);
  
  // Visibility states for each component
  const [componentVisibility, setComponentVisibility] = useState({
    tierProgress: true,
    claimableRewards: true,
    badgeGallery: true,
    analytics: true,
    regionalDrops: true
  });

  const toggleComponent = (componentName) => {
    setComponentVisibility(prev => ({
      ...prev,
      [componentName]: !prev[componentName]
    }));
  };

  const rewards = [
    { 
      id: 1, 
      title: 'VIP Concert Access NFT', 
      category: 'events', 
      tier: 'Gold', 
      type: 'claimable',
      value: '0.5 ETH',
      description: 'Exclusive backstage pass to Ethereum Denver',
      timeLeft: '2 days',
      rarity: 'legendary'
    },
    { 
      id: 2, 
      title: 'Exclusive DAO Summit Pass', 
      category: 'events', 
      tier: 'Gold', 
      type: 'claimable',
      value: '1.2 ETH',
      description: 'Full access to Web3 Leadership Summit',
      timeLeft: '5 days',
      rarity: 'epic'
    },
    { 
      id: 3, 
      title: '25% Off Crypto Merch', 
      category: 'discounts', 
      tier: 'Silver', 
      type: 'claimable',
      value: 'Up to $200',
      description: 'Valid on all MetaMask branded merchandise',
      timeLeft: '10 days',
      rarity: 'common'
    },
    { 
      id: 4, 
      title: 'Monthly Airdrop Bonus', 
      category: 'airdrops', 
      tier: 'Gold', 
      type: 'claimable',
      value: '50 MILES',
      description: 'Extra MetaMiles for Gold tier members',
      timeLeft: '15 days',
      rarity: 'rare'
    },
    { 
      id: 5, 
      title: 'Diamond Tier Preview', 
      category: 'events', 
      tier: 'Diamond', 
      type: 'locked',
      value: '2.5 ETH',
      description: 'Unlock with Diamond tier',
      timeLeft: '$2,153 more',
      rarity: 'legendary'
    }
  ];

  const badges = [
    { 
      id: 1, 
      name: 'Early Adopter', 
      description: 'First 1000 MetaMiles users',
      rarity: 'legendary',
      earned: true,
      date: '2024-01-15'
    },
    { 
      id: 2, 
      name: 'Gold Streak Master', 
      description: '3 consecutive months in Gold tier',
      rarity: 'epic',
      earned: true,
      date: '2024-06-01'
    },
    { 
      id: 3, 
      name: 'Big Spender', 
      description: 'Spent over $5000 in a month',
      rarity: 'rare',
      earned: false,
      date: null
    },
    { 
      id: 4, 
      name: 'Event Enthusiast', 
      description: 'Attended 5+ MetaMiles events',
      rarity: 'common',
      earned: true,
      date: '2024-05-20'
    }
  ];


  const localDrops = [
    {
      id: 1,
      title: 'Onchain Diwali',
      location: 'Mumbai, India',
      description: 'Celebrate Diwali with exclusive NFT drops',
      timeLeft: '2 days',
      participants: 1247,
      reward: 'Festival NFT + 100 MILES',
      active: true
    },
    {
      id: 2,
      title: 'NYC Art Week',
      location: 'New York, USA',
      description: 'Limited edition art NFTs from local artists',
      timeLeft: '1 week',
      participants: 890,
      reward: 'Art NFT + 75 MILES',
      active: true
    },
    {
      id: 3,
      title: 'Berlin Tech Summit',
      location: 'Berlin, Germany',
      description: 'Exclusive access to Web3 networking events',
      timeLeft: 'Ended',
      participants: 560,
      reward: 'Summit Badge',
      active: false
    }
  ];

  const claimReward = (rewardId) => {
    if (rewards.find(r => r.id === rewardId)?.type === 'claimable') {
      setClaimedRewards(prev => new Set([...prev, rewardId]));
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const toggleAllComponents = () => {
    const allVisible = Object.values(componentVisibility).every(v => v);
    const newVisibility = {};
    Object.keys(componentVisibility).forEach(key => {
      newVisibility[key] = !allVisible;
    });
    setComponentVisibility(newVisibility);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate tier progress changes
      if (Math.random() > 0.95) {
        setMonthlySpend(prev => prev + Math.floor(Math.random() * 50));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black text-white p-6">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="confetti-animation">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  left: Math.random() * 100 + '%',
                  animationDelay: Math.random() * 2 + 's',
                  backgroundColor: ['#f97316', '#f59e0b', '#fb923c', '#3b82f6'][Math.floor(Math.random() * 4)]
                }}
              />
            ))}
          </div>
        </div>
      )}
<MyCustomComponent/>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        

        {/* Master Toggle Controls */}
        <div className="flex justify-center">
          <div className="bg-gray-800/50 rounded-xl p-4 flex items-center gap-4">
            <button
              onClick={toggleAllComponents}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg transition-colors"
            >
              {Object.values(componentVisibility).every(v => v) ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  Hide All
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Show All
                </>
              )}
            </button>
            <span className="text-sm text-gray-400">
              {Object.values(componentVisibility).filter(v => v).length} of {Object.keys(componentVisibility).length} sections visible
            </span>
          </div>
        </div>

        {/* Modular Components */}
        <div className="space-y-6">
          <TierProgress 
            currentTier={currentTier}
            monthlySpend={monthlySpend}
            streak={streak}
            isVisible={componentVisibility.tierProgress}
            onToggle={() => toggleComponent('tierProgress')}
          />

          <ClaimableRewards 
            rewards={rewards}
            claimedRewards={claimedRewards}
            onClaimReward={claimReward}
            isVisible={componentVisibility.claimableRewards}
            onToggle={() => toggleComponent('claimableRewards')}
          />

          <BadgeGallery 
            badges={badges}
            isVisible={componentVisibility.badgeGallery}
            onToggle={() => toggleComponent('badgeGallery')}
          />

          

          <RegionalDrops 
            localDrops={localDrops}
            isVisible={componentVisibility.regionalDrops}
            onToggle={() => toggleComponent('regionalDrops')}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .confetti-animation {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1000;
        }
        
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          animation: confetti-fall 3s linear infinite;
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MetaMilesDashboard;