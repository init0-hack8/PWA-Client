import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';

const emotionColors = {
  empowering: '#FF6B6B',
  casual: '#4ECDC4',
  bold: '#FFD166',
  romantic: '#FF9F9F',
  confident: '#6B66FF',
  chill: '#66FFB2',
  fierce: '#FF66B2',
};

export function StyleSentimentChart({ post }) {
  const emotionData = [
    { name: 'Empowering', value: post.emotions?.empowering || 0, color: emotionColors.empowering },
    { name: 'Casual', value: post.emotions?.casual || 0, color: emotionColors.casual },
    { name: 'Bold', value: post.emotions?.bold || 0, color: emotionColors.bold },
    { name: 'Romantic', value: post.emotions?.romantic || 0, color: emotionColors.romantic },
    { name: 'Confident', value: post.emotions?.confident || 0, color: emotionColors.confident },
    { name: 'Chill', value: post.emotions?.chill || 0, color: emotionColors.chill },
    { name: 'Fierce', value: post.emotions?.fierce || 0, color: emotionColors.fierce },
  ];

  return (
    <Card className="w-full bg-card">
      <CardHeader>
        <CardTitle>Style Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(post.emotions || {}).map(([emotion, value]) => (
            <Badge 
              key={emotion} 
              variant="outline"
              style={{ 
                backgroundColor: emotionColors[emotion],
                borderColor: emotionColors[emotion],
                color: 'white'
              }}
              className="px-3 py-1"
            >
              {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
            </Badge>
          ))}
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={emotionData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              barSize={40}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#666', fontSize: 12 }}
                axisLine={{ stroke: '#666' }}
                tickLine={{ stroke: '#666' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fill: '#666', fontSize: 12 }}
                axisLine={{ stroke: '#666' }}
                tickLine={{ stroke: '#666' }}
                label={{ 
                  value: 'Sentiment Score', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: '#666' }
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                formatter={(value) => [`${value}%`, 'Score']}
              />
              <Bar 
                dataKey="value"
                radius={[4, 4, 0, 0]}
              >
                {emotionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <LabelList 
                  dataKey="value" 
                  position="top" 
                  style={{ fill: '#666', fontSize: 12 }}
                  formatter={(value) => `${value}%`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 