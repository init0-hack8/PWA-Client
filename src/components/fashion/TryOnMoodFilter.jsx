import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { 
  Smile, 
  Heart, 
  Zap, 
  Coffee, 
  Music, 
  Sun, 
  Moon, 
  Cloud, 
  Star 
} from 'lucide-react';

const moodFilters = [
  { id: 'happy', label: 'Happy', icon: Smile },
  { id: 'romantic', label: 'Romantic', icon: Heart },
  { id: 'energetic', label: 'Energetic', icon: Zap },
  { id: 'relaxed', label: 'Relaxed', icon: Coffee },
  { id: 'creative', label: 'Creative', icon: Music },
  { id: 'summer', label: 'Summer', icon: Sun },
  { id: 'night', label: 'Night', icon: Moon },
  { id: 'casual', label: 'Casual', icon: Cloud },
  { id: 'glam', label: 'Glam', icon: Star }
];

const generateOutfits = (mood, priceRange) => {
  const outfits = [];
  const count = Math.floor(Math.random() * 5) + 3; // 3-7 outfits
  
  for (let i = 0; i < count; i++) {
    outfits.push({
      id: i,
      image: `https://source.unsplash.com/random/300x400/?${mood},fashion,outfit`,
      price: Math.floor(Math.random() * (priceRange[1] - priceRange[0])) + priceRange[0],
      rating: (Math.random() * 2 + 3).toFixed(1) // 3-5 stars
    });
  }
  
  return outfits;
};

export function TryOnMoodFilter() {
  const [selectedMood, setSelectedMood] = useState('happy');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOutfits(generateOutfits(mood, priceRange));
      setLoading(false);
    }, 1000);
  };

  const handlePriceChange = (range) => {
    setPriceRange(range);
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOutfits(generateOutfits(selectedMood, range));
      setLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Find Outfits by Mood</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">How do you want to feel?</h3>
          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-4">
              {moodFilters.map((mood) => {
                const Icon = mood.icon;
                return (
                  <Button
                    key={mood.id}
                    variant={selectedMood === mood.id ? 'default' : 'outline'}
                    className="flex flex-col items-center gap-2 h-auto py-4 px-6"
                    onClick={() => handleMoodSelect(mood.id)}
                  >
                    <Icon className="w-6 h-6" />
                    <span>{mood.label}</span>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Price Range</h3>
          <div className="relative">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={200}
              step={10}
              className="w-full"
            />
            <div className="absolute left-0 right-0 flex justify-between mt-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary border-2 border-primary-foreground"></div>
                <span>${priceRange[0]}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary border-2 border-primary-foreground"></div>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="outfits-grid">
          {loading ? (
            <div className="text-center py-8">Loading outfits...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {outfits.map((outfit) => (
                <div key={outfit.id} className="outfit-card">
                  <img 
                    src={outfit.image} 
                    alt={`Outfit for ${selectedMood}`}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://source.unsplash.com/random/300x400/?fashion,outfit';
                    }}
                  />
                  <div className="mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">${outfit.price}</span>
                      <span className="text-sm">⭐ {outfit.rating}</span>
                    </div>
                    <Button className="w-full mt-2">Try On</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 