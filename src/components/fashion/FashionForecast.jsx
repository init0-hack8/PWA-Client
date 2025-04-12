import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

// Generate random data for the chart
const generateRandomData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    name: month,
    value: Math.floor(Math.random() * 100)
  }));
};

// Generate random trending items
const generateTrendingItems = () => {
  const items = [
    { name: 'Oversized Blazers', trend: 'up' },
    { name: 'Cargo Pants', trend: 'up' },
    { name: 'Platform Sneakers', trend: 'down' },
    { name: 'Cropped Tops', trend: 'up' },
    { name: 'Wide Leg Jeans', trend: 'up' },
    { name: 'Mini Skirts', trend: 'down' },
    { name: 'Oversized Hoodies', trend: 'up' },
    { name: 'Chunky Boots', trend: 'down' }
  ];

  return items.map(item => ({
    ...item,
    change: Math.floor(Math.random() * 20) + 1,
    image: `https://source.unsplash.com/random/300x400/?${item.name.replace(/\s+/g, ',')}`
  }));
};

export default function FashionForecast() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [chartData, setChartData] = useState(generateRandomData());
  const [trendingItems, setTrendingItems] = useState(generateTrendingItems());

  // Update data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(generateRandomData());
      setTrendingItems(generateTrendingItems());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fashion-forecast">
      <Card>
        <CardHeader>
          <CardTitle>Fashion Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#404040' : '#e9ecef'} />
                <XAxis 
                  dataKey="name" 
                  stroke={isDark ? '#adb5bd' : '#6c757d'} 
                />
                <YAxis 
                  stroke={isDark ? '#adb5bd' : '#6c757d'} 
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDark ? '#2d2d2d' : '#ffffff',
                    border: `1px solid ${isDark ? '#404040' : '#e9ecef'}`,
                    color: isDark ? '#f8f9fa' : '#212529'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={isDark ? '#60a5fa' : '#3b82f6'} 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="trending-items">
            <h3>Trending Items</h3>
            <div className="trends-grid">
              {trendingItems.map((item, index) => (
                <div key={index} className="trend-item">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="trend-image"
                    onError={(e) => {
                      e.target.src = 'https://source.unsplash.com/random/300x400/?fashion';
                    }}
                  />
                  <div className="trend-info">
                    <span className="trend-name">{item.name}</span>
                    <Badge variant={item.trend === "up" ? "success" : "destructive"}>
                      {item.trend === "up" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      {item.change}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 