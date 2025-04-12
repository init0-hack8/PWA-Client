import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { StyleSentimentChart } from '@/components/fashion/StyleSentimentChart';
import { BrandMoodboard } from '@/components/fashion/BrandMoodboard';
import FashionForecast from '@/components/fashion/FashionForecast';
import { TryOnMoodFilter } from '@/components/fashion/TryOnMoodFilter';
import { CampaignFeedback } from '@/components/fashion/CampaignFeedback';
import { CollaborativeCloset } from '@/components/fashion/CollaborativeCloset';

const mockPost = {
  id: 1,
  username: 'fashionista123',
  content: 'Just styled this empowering look for the office!',
  image: '/api/placeholder/400/500',
  emotions: {
    empowering: 85,
    casual: 30,
    bold: 70,
    romantic: 20,
    confident: 90,
    chill: 25,
    fierce: 65,
  },
};

export default function FashionDashboard() {
  const [activeTab, setActiveTab] = useState('style');

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Fashion Sentiment Analysis</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
          <TabsTrigger value="style">Style Analysis</TabsTrigger>
          <TabsTrigger value="moodboard">Moodboard</TabsTrigger>
          <TabsTrigger value="forecast">Trend Forecast</TabsTrigger>
          <TabsTrigger value="tryon">Try-On</TabsTrigger>
          <TabsTrigger value="campaign">Campaign</TabsTrigger>
          <TabsTrigger value="closet">Closet</TabsTrigger>
        </TabsList>

        <TabsContent value="style" className="space-y-4">
          <StyleSentimentChart post={mockPost} />
        </TabsContent>

        <TabsContent value="moodboard" className="space-y-4">
          <BrandMoodboard />
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <FashionForecast />
        </TabsContent>

        <TabsContent value="tryon" className="space-y-4">
          <TryOnMoodFilter />
        </TabsContent>

        <TabsContent value="campaign" className="space-y-4">
          <CampaignFeedback />
        </TabsContent>

        <TabsContent value="closet" className="space-y-4">
          <CollaborativeCloset />
        </TabsContent>
      </Tabs>
    </div>
  );
} 