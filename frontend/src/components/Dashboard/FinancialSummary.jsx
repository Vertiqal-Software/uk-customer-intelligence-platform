import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Clock, AlertTriangle, Download, Filter } from 'lucide-react';

const FinancialSummary = () => {
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedView, setSelectedView] = useState('revenue');

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockData = {
      summary: {
        totalRevenue: 12450000,
        monthlyRecurring: 2870000,
        outstandingInvoices: 340000,
        overduePayments: 85000,
        projectedRevenue: 15200000,
        averagePaymentTime: 22,
        cashFlow: 1850000,
        growthRate: 8.5
      },
      
      monthlyRevenue: [
        { month: 'Jan', revenue: 1950000, target: 2000000, recurring: 1800000 },
        { month: 'Feb', revenue: 2100000, target: 2000000, recurring: 1850000 },
        { month: 'Mar', revenue: 1875000, target: 2000000, recurring: 1820000 },
        { month: 'Apr', revenue: 2250000, target: 2100000, recurring: 1900000 },
        { month: 'May', revenue: 2180000, target: 2100000, recurring: 1950000 },
        { month: 'Jun', revenue: 2095000, target: 2100000, recurring: 1980000 }
      ],
      
      cashFlow: [
        { month: 'Jan', inflow: 2100000, outflow: 1650000, net: 450000 },
        { month: 'Feb', inflow: 2250000, outflow: 1700000, net: 550000 },
        { month: 'Mar', inflow: 1950000, outflow: 1800000, net: 150000 },
        { month: 'Apr', inflow: 2400000, outflow: 1750000, net: 650000 },
        { month: 'May', inflow: 2300000, outflow: 1820000, net: 480000 },
        { month: 'Jun', inflow: 2200000, outflow: 1690000, net: 510000 }
      ],
      
      topCustomers: [
        { name: 'Tesco PLC', revenue: 2400000, percentage: 19.3, growth: 12.5, status: 'active' },
        { name: 'Sainsbury\'s', revenue: 1850000, percentage: 14.8, growth: -2.1, status: 'active' },
        { name: 'ASDA', revenue: 1620000, percentage: 13.0, growth: 8.7, status: 'active' },
        { name: 'Marks & Spencer', revenue: 1340000, percentage: 10.8, growth: 15.3, status: 'at_risk' },
        { name: 'John Lewis', revenue: 980000, percentage: 7.9, growth: -5.2, status: 'active' }
      ],
      
      paymentAnalysis: [
        { range: '0-30 days', amount: 2100000, count: 45, color: '#10B981' },
        { range: '31-60 days', amount: 180000, count: 8, color: '#F59E0B' },
        { range: '61-90 days', amount: 65000, count: 3, color: '#EF4444' },
        { range: '90+ days', amount: 25000, count: 2, color: '#DC2626' }
      ],
      
      recentTransactions: [
        {
          id: 1,
          customer: 'Tesco PLC',
          amount: 125000,
          type: 'payment',
          status: 'completed',
          date: '2024-08-15',
          invoiceNumber: 'INV-2024-0856'
        },
        {
          id: 2,
          customer: 'ASDA',
          amount: 89000,
          type: 'invoice',
          status: 'pending',
          date: '2024-08-14',
          invoiceNumber: 'INV-2024-0855'
        },
        {
          id: 3,
          customer: 'Sainsbury\'s',
          amount: 156000,
          type: 'payment',
          status: 'completed',
          date: '2024-08-13',
          invoiceNumber: 'INV-2024-0851'
        },
        {
          id: 4,
          customer: 'Marks & Spencer',
          amount: 75000,
          type: 'invoice',
          status: 'overdue',
          date: '2024-07-28',
          invoiceNumber: 'INV-2024-0832'
        }
      ]
    };

    setTimeout(() => {
      setFinancialData(mockData);
      setLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!financialData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex items-center justify-center">
        <p className="text-gray-500">Unable to load financial data</p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'at_risk': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Financial Summary</h2>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="3months">Last 3 months</option>
              <option value="6months">Last 6 months</option>
              <option value="12months">Last 12 months</option>
            </select>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(financialData.summary.totalRevenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">{formatPercentage(financialData.summary.growthRate)}</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Cash Flow</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(financialData.summary.cashFlow)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-green-600">Healthy</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">Outstanding</p>
                <p className="text-2xl font-bold text-yellow-900">{formatCurrency(financialData.summary.outstandingInvoices)}</p>
              </div>
              <CreditCard className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="flex items-center mt-2">
              <Clock className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm text-yellow-600">{financialData.summary.averagePaymentTime} days avg</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700">Overdue</p>
                <p className="text-2xl font-bold text-red-900">{formatCurrency(financialData.summary.overduePayments)}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-red-600">Needs attention</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <select
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="revenue">Total Revenue</option>
                <option value="recurring">Recurring Revenue</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={financialData.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `£${(value / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line 
                  type="monotone" 
                  dataKey={selectedView === 'revenue' ? 'revenue' : 'recurring'} 
                  stroke="#3B82F6" 
                  strokeWidth={3} 
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#94A3B8" 
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Cash Flow Chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow Analysis</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={financialData.cashFlow}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `£${(value / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area 
                  type="monotone" 
                  dataKey="net" 
                  stackId="1" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Customers and Payment Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Customers */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers by Revenue</h3>
            <div className="space-y-3">
              {financialData.topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{customer.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                        {customer.status === 'at_risk' ? 'At Risk' : 'Active'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-gray-600">{formatCurrency(customer.revenue)}</span>
                      <span className={`text-sm font-medium ${customer.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatPercentage(customer.growth)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${customer.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Analysis */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Age Analysis</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={financialData.paymentAnalysis}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="amount"
                >
                  {financialData.paymentAnalysis.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {financialData.paymentAnalysis.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs text-gray-600">{item.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-700">
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Invoice</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {financialData.recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-t border-gray-200">
                    <td className="py-3 font-medium text-gray-900">{transaction.customer}</td>
                    <td className="py-3 text-gray-700">{formatCurrency(transaction.amount)}</td>
                    <td className="py-3">
                      <span className="capitalize text-gray-700">{transaction.type}</span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-700">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-blue-600 hover:underline cursor-pointer">
                      {transaction.invoiceNumber}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;