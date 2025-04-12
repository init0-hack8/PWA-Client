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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Fashion Sentiment Analysis</h1>
        <p className="text-muted-foreground">Analyze fashion trends, create moodboards, and forecast upcoming styles</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 p-1 bg-muted/50 rounded-lg">
          <TabsTrigger 
            value="style" 
            className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Style Analysis
          </TabsTrigger>
          <TabsTrigger 
            value="moodboard"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Moodboard
          </TabsTrigger>
          <TabsTrigger 
            value="forecast"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Trend Forecast
          </TabsTrigger>
          <TabsTrigger 
            value="tryon"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Try-On
          </TabsTrigger>
          <TabsTrigger 
            value="campaign"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Campaign
          </TabsTrigger>
          <TabsTrigger 
            value="closet"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Closet
          </TabsTrigger>
        </TabsList>

        <div className="pt-8">
          <TabsContent value="style" className="mt-6">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <StyleSentimentChart post={mockPost} />
            </div>
          </TabsContent>

          <TabsContent value="moodboard" className="mt-6">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <BrandMoodboard />
            </div>
          </TabsContent>

          <TabsContent value="forecast" className="mt-6">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <FashionForecast />
            </div>
          </TabsContent>

          <TabsContent value="tryon" className="mt-6">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <TryOnMoodFilter />
            </div>
          </TabsContent>

          <TabsContent value="campaign" className="mt-6">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <CampaignFeedback />
            </div>
          </TabsContent>

          <TabsContent value="closet" className="mt-6">
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <CollaborativeCloset />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
} 