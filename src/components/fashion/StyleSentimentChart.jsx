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
  ResponsiveContainer 
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
    { name: 'Empowering', value: post.emotions?.empowering || 0 },
    { name: 'Casual', value: post.emotions?.casual || 0 },
    { name: 'Bold', value: post.emotions?.bold || 0 },
    { name: 'Romantic', value: post.emotions?.romantic || 0 },
    { name: 'Confident', value: post.emotions?.confident || 0 },
    { name: 'Chill', value: post.emotions?.chill || 0 },
    { name: 'Fierce', value: post.emotions?.fierce || 0 },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Style Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(post.emotions || {}).map(([emotion, value]) => (
            <Badge 
              key={emotion} 
              variant="outline"
              style={{ backgroundColor: emotionColors[emotion] }}
              className="text-white"
            >
              {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
            </Badge>
          ))}
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={emotionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 