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
    <div></div>
  );
}