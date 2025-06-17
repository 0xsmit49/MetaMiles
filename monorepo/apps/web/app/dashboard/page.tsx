'use client';
import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

import MyCustomComponent from '../../components/FLoatingDock';

export default function PaymentsDropdown() {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  // Sample payment data
  const paymentsData = [
    { id: 1, amount: 127.50, merchant: "Starbucks Coffee", date: "2025-01-15", category: "Food & Drink", miles: 25, type: "Coffee" },
    { id: 2, amount: 89.99, merchant: "Netflix", date: "2025-01-12", category: "Entertainment", miles: 18, type: "Streaming" },
    { id: 3, amount: 256.75, merchant: "Amazon", date: "2025-01-08", category: "Shopping", miles: 51, type: "Online" },
    { id: 4, amount: 45.20, merchant: "Uber", date: "2024-12-28", category: "Transportation", miles: 9, type: "Ride" },
    { id: 5, amount: 189.99, merchant: "Best Buy", date: "2024-12-22", category: "Electronics", miles: 38, type: "Retail" },
    { id: 6, amount: 67.83, merchant: "Target", date: "2024-12-15", category: "Shopping", miles: 14, type: "Retail" },
    { id: 7, amount: 312.45, merchant: "Apple Store", date: "2024-11-30", category: "Electronics", miles: 62, type: "Tech" },
    { id: 8, amount: 78.90, merchant: "DoorDash", date: "2024-11-25", category: "Food & Drink", miles: 16, type: "Delivery" },
    { id: 9, amount: 156.30, merchant: "Nike", date: "2024-10-18", category: "Apparel", miles: 31, type: "Sports" },
    { id: 10, amount: 234.67, merchant: "Whole Foods", date: "2024-10-12", category: "Groceries", miles: 47, type: "Food" },
    { id: 11, amount: 92.15, merchant: "Shell Gas", date: "2024-09-28", category: "Gas", miles: 18, type: "Fuel" },
    { id: 12, amount: 445.80, merchant: "Delta Airlines", date: "2024-09-15", category: "Travel", miles: 89, type: "Flight" },
    { id: 13, amount: 178.25, merchant: "Spotify Premium", date: "2024-08-30", category: "Entertainment", miles: 36, type: "Music" },
    { id: 14, amount: 67.45, merchant: "McDonald's", date: "2024-08-22", category: "Food & Drink", miles: 13, type: "Fast Food" },
    { id: 15, amount: 523.90, merchant: "Marriott Hotel", date: "2024-07-10", category: "Travel", miles: 105, type: "Hotel" },
    { id: 16, amount: 89.99, merchant: "Steam Games", date: "2024-06-18", category: "Gaming", miles: 18, type: "Digital" },
    { id: 17, amount: 145.75, merchant: "Costco", date: "2024-05-25", category: "Wholesale", miles: 29, type: "Bulk" },
    { id: 18, amount: 234.50, merchant: "Home Depot", date: "2024-04-12", category: "Home Improvement", miles: 47, type: "Hardware" },
    { id: 19, amount: 78.30, merchant: "Chipotle", date: "2024-03-28", category: "Food & Drink", miles: 16, type: "Mexican" },
    { id: 20, amount: 356.89, merchant: "Tesla Supercharger", date: "2024-02-15", category: "Electric Vehicle", miles: 71, type: "Charging" },
    { id: 21, amount: 125.40, merchant: "Barnes & Noble", date: "2023-12-20", category: "Books", miles: 25, type: "Literature" },
    { id: 22, amount: 89.75, merchant: "AMC Theatres", date: "2023-11-18", category: "Entertainment", miles: 18, type: "Movies" },
    { id: 23, amount: 267.30, merchant: "Lululemon", date: "2023-10-22", category: "Apparel", miles: 53, type: "Fitness" },
    { id: 24, amount: 445.67, merchant: "Microsoft Store", date: "2023-09-15", category: "Software", miles: 89, type: "Tech" },
    { id: 25, amount: 178.90, merchant: "Sephora", date: "2022-12-10", category: "Beauty", miles: 36, type: "Cosmetics" },
    { id: 26, amount: 67.25, merchant: "Panera Bread", date: "2022-11-25", category: "Food & Drink", miles: 13, type: "Bakery" },
    { id: 27, amount: 389.99, merchant: "REI Co-op", date: "2022-10-30", category: "Outdoor", miles: 78, type: "Gear" },
    { id: 28, amount: 156.45, merchant: "Trader Joe's", date: "2022-09-18", category: "Groceries", miles: 31, type: "Organic" }
  ];

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const years = ['2025', '2024', '2023', '2022'];

  useEffect(() => {
    setIsVisible(true);
    setFilteredPayments(paymentsData);
  }, []);

  useEffect(() => {
    filterPayments();
  }, [selectedMonth, selectedYear]);

  const filterPayments = () => {
    let filtered = paymentsData;

    if (selectedMonth || selectedYear) {
      filtered = paymentsData.filter(payment => {
        const paymentDate = new Date(payment.date);
        const paymentMonth = String(paymentDate.getMonth() + 1).padStart(2, '0');
        const paymentYear = String(paymentDate.getFullYear());

        const monthMatch = !selectedMonth || paymentMonth === selectedMonth;
        const yearMatch = !selectedYear || paymentYear === selectedYear;

        return monthMatch && yearMatch;
      });
    }

    setFilteredPayments(filtered);
  };

  const getTotalAmount = () => {
    return filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getTotalMiles = () => {
    return filteredPayments.reduce((sum, payment) => sum + payment.miles, 0);
  };

  // Chart data preparation
  const getCategoryData = () => {
    const categoryTotals = {};
    filteredPayments.forEach(payment => {
      categoryTotals[payment.category] = (categoryTotals[payment.category] || 0) + payment.amount;
    });
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount: Number(amount.toFixed(2))
    }));
  };

  const getMonthlyData = () => {
    const monthlyTotals = {};
    filteredPayments.forEach(payment => {
      const date = new Date(payment.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyTotals[key] = (monthlyTotals[key] || 0) + payment.amount;
    });
    return Object.entries(monthlyTotals)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({
        month,
        amount: Number(amount.toFixed(2))
      }));
  };

  const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5', '#fef3e2', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/90 backdrop-blur-lg border border-orange-500/30 rounded-lg p-3 shadow-lg">
          <p className="text-orange-400 font-medium">{label}</p>
          <p className="text-white">
            <span className="text-green-400">${payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Food & Drink': '',
      'Entertainment': '',
      'Shopping': '',
      'Transportation': '',
      'Electronics': '',
      'Travel': '',
      'Gas': '',
      'Gaming': '',
      'Wholesale': '',
      'Home Improvement': '',
      'Electric Vehicle': '',
      'Books': '',
      'Apparel': '',
      'Software': '',
      'Beauty': '',
      'Outdoor': '',
      'Groceries': ''
    };
    return icons[category] || '';
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black text-white overflow-hidden">
      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.3); }
          50% { box-shadow: 0 0 30px rgba(249, 115, 22, 0.5); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .gradient-text {
          background: linear-gradient(-45deg, #f97316, #f59e0b, #fb923c, #f97316);
          background-size: 400% 400%;
          animation: gradient-shift 3s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
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
            rgba(249, 115, 22, 0.2),
            transparent
          );
          animation: shimmer 2s infinite;
        }
        .payment-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(249, 115, 22, 0.1);
        }
        .payment-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(249, 115, 22, 0.15);
          border-color: rgba(249, 115, 22, 0.3);
        }
        .dropdown-select {
          background: linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.9));
          border: 1px solid rgba(249, 115, 22, 0.3);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        .dropdown-select:focus {
          border-color: rgba(249, 115, 22, 0.6);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }
        .stats-card {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        .tab-button {
          transition: all 0.3s ease;
          border: 1px solid rgba(249, 115, 22, 0.2);
        }
        .tab-button.active {
          background: linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(251, 146, 60, 0.2));
          border-color: rgba(249, 115, 22, 0.5);
          color: #f97316;
        }
      `}</style>

      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern
              id="grid"
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
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <MyCustomComponent/>
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className={`text-center mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white ml-4">Payment History</span>
          </h1>
          <p className="text-xl text-gray-300">Track your transactions and earned miles</p>
        </div>

        {/* Filters */}
        <div className={`mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/20">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1">
                <label className="block text-sm font-medium text-orange-400 mb-2">Select Month</label>
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="dropdown-select w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                >
                  <option value="">All Months</option>
                  {months.map(month => (
                    <option key={month.value} value={month.value} className="bg-gray-800">
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-orange-400 mb-2">Select Year</label>
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="dropdown-select w-full px-4 py-3 rounded-xl text-white focus:outline-none"
                >
                  <option value="">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year} className="bg-gray-800">
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => { setSelectedMonth(''); setSelectedYear(''); }}
                  className="px-4 py-3 bg-orange-600 hover:bg-orange-700 rounded-xl transition-all duration-300 font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="stats-card bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Transactions</p>
                <p className="text-2xl font-bold text-white">{filteredPayments.length}</p>
              </div>
              <div className="text-3xl"></div>
            </div>
          </div>
          
          <div className="stats-card bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Amount</p>
                <p className="text-2xl font-bold text-green-400">${getTotalAmount().toFixed(2)}</p>
              </div>
              <div className="text-3xl"></div>
            </div>
          </div>
          
          <div className="stats-card bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Miles Earned</p>
                <p className="text-2xl font-bold text-orange-400">{getTotalMiles()}</p>
              </div>
              <div className="text-3xl"></div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={`mb-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="flex flex-wrap gap-2 justify-center">
            {['overview', 'categories', 'trends', 'transactions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-button px-6 py-3 rounded-xl font-medium capitalize transition-all duration-300 ${
                  activeTab === tab ? 'active' : 'text-gray-400 hover:text-orange-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Distribution */}
              <div className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/20">
                <h3 className="text-xl font-bold gradient-text mb-4">Spending by Category</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getCategoryData()}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="amount"
                        nameKey="category"
                      >
                        {getCategoryData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Trend */}
              <div className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/20">
                <h3 className="text-xl font-bold gradient-text mb-4">Monthly Spending Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getMonthlyData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(249, 115, 22, 0.1)" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#f97316" 
                        strokeWidth={3}
                        dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/20">
              <h3 className="text-xl font-bold gradient-text mb-4">Category Breakdown</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getCategoryData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(249, 115, 22, 0.1)" />
                    <XAxis dataKey="category" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="amount" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'trends' && (
            <div className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/20">
              <h3 className="text-xl font-bold gradient-text mb-4">Spending Trends Over Time</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getMonthlyData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(249, 115, 22, 0.1)" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#f97316" 
                      strokeWidth={3}
                      dot={{ fill: '#f97316', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, fill: '#fb923c' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-lg rounded-2xl border border-orange-500/20 overflow-hidden">
              <div className="p-6 border-b border-orange-500/20">
                <h2 className="text-2xl font-bold gradient-text">Payment Transactions</h2>
                <p className="text-gray-400 mt-1">
                  {selectedMonth || selectedYear ? 
                    `Showing ${filteredPayments.length} transactions for ${selectedMonth ? months.find(m => m.value === selectedMonth)?.label : 'all months'} ${selectedYear || 'all years'}` 
                    : `Showing all ${filteredPayments.length} transactions`
                  }
                </p>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {filteredPayments.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-6xl mb-4"></div>
                    <p className="text-gray-400 text-lg">No transactions found for the selected period</p>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {filteredPayments.map((payment, index) => (
                      <div 
                        key={payment.id} 
                        className={`payment-card p-4 border-b border-gray-800 hover:bg-gray-900/30 float-animation`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl">{getCategoryIcon(payment.category)}</div>
                            <div>
                              <h3 className="font-semibold text-white">{payment.merchant}</h3>
                              <p className="text-sm text-gray-400">{payment.category} • {payment.type}</p>
                              <p className="text-xs text-gray-500">{new Date(payment.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-white">${payment.amount.toFixed(2)}</div>
                            <div className="text-sm text-orange-400 shimmer-effect">+{payment.miles} miles</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>
    </div>
  );
}