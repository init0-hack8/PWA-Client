import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, ChevronUp, ChevronDown } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

// Generate random data for the chart
const generateRandomData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let prevValue = 50;
  let prevEngagement = 40;
  return months.map(month => {
    const change = Math.floor(Math.random() * 30) - 15;
    const engagementChange = Math.floor(Math.random() * 20) - 10;
    prevValue = Math.max(0, Math.min(100, prevValue + change));
    prevEngagement = Math.max(0, Math.min(100, prevEngagement + engagementChange));
    return {
      name: month,
      popularity: prevValue,
      engagement: prevEngagement,
      trend: change >= 0 ? 'up' : 'down'
    };
  });
};

// Generate random trending items
const generateTrendingItems = () => {
  const items = [
    { name: 'Oversized Blazers', trend: 'up', category: 'Outerwear' },
    { name: 'Cargo Pants', trend: 'up', category: 'Bottoms' },
    { name: 'Platform Sneakers', trend: 'down', category: 'Footwear' },
    { name: 'Cropped Tops', trend: 'up', category: 'Tops' },
    { name: 'Wide Leg Jeans', trend: 'up', category: 'Bottoms' },
    { name: 'Mini Skirts', trend: 'down', category: 'Bottoms' },
    { name: 'Oversized Hoodies', trend: 'up', category: 'Tops' },
    { name: 'Chunky Boots', trend: 'down', category: 'Footwear' }
  ];

  return items.map(item => ({
    ...item,
    change: Math.floor(Math.random() * 20) + 1,
    engagement: Math.floor(Math.random() * 1000) + 500
  }));
};

// Calculate trend summary
const calculateTrendSummary = (items) => {
  const categories = {};
  items.forEach(item => {
    if (!categories[item.category]) {
      categories[item.category] = { up: 0, down: 0, total: 0 };
    }
    categories[item.category][item.trend]++;
    categories[item.category].total++;
  });
  return categories;
};

export default function FashionForecast() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [chartData, setChartData] = useState(generateRandomData());
  const [trendingItems, setTrendingItems] = useState(generateTrendingItems());
  const trendSummary = calculateTrendSummary(trendingItems);

  // Update data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(generateRandomData());
      setTrendingItems(generateTrendingItems());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className={`flex items-center gap-1 ${
              entry.value > (payload[0].payload[entry.dataKey === 'popularity' ? 'engagement' : 'popularity']) 
                ? 'text-green-500' 
                : 'text-red-500'
            }`}>
              {entry.value > (payload[0].payload[entry.dataKey === 'popularity' ? 'engagement' : 'popularity']) 
                ? <ChevronUp size={16} /> 
                : <ChevronDown size={16} />}
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fashion-forecast space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fashion Trend Analysis</CardTitle>
          <CardDescription>Comprehensive analysis of fashion trends and engagement metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(trendSummary).map(([category, stats]) => (
                <Card key={category}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h4 className="font-semibold mb-2">{category}</h4>
                      <div className="flex justify-center gap-4">
                        <div className="text-green-500">
                          <ChevronUp className="inline" size={16} />
                          {stats.up}
                        </div>
                        <div className="text-red-500">
                          <ChevronDown className="inline" size={16} />
                          {stats.down}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Chart Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trend Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <defs>
                        <linearGradient id="colorPopularity" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#404040' : '#e9ecef'} vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke={isDark ? '#adb5bd' : '#6c757d'}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke={isDark ? '#adb5bd' : '#6c757d'}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="popularity" 
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={false}
                        name="Popularity"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="engagement" 
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                        name="Engagement"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 