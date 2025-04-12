import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { 
  Smile, 
  Heart, 
  Zap, 
  Coffee, 
  Music, 
  Sun, 
  Moon, 
  Cloud, 
  Star,
  Upload,
  Camera
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
  const [userPhoto, setUserPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setUserPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const handlePriceInputChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = Number(value);
    if (newRange[0] <= newRange[1]) {
      setPriceRange(newRange);
      handlePriceChange(newRange);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Find Outfits by Mood</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Photo Upload Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Upload Your Photo</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Your photo"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Camera className="w-8 h-8" />
                    <span>Click to upload your photo</span>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Mood Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">How do you want to feel?</h3>
          <div className="relative w-full overflow-hidden">
            <div className="overflow-x-auto pb-4 -mb-4 scrollbar-thin scrollbar-thumb-primary scrollbar-track-background">
              <div className="flex gap-3 min-w-max px-1">
                {moodFilters.map((mood) => {
                  const Icon = mood.icon;
                  return (
                    <Button
                      key={mood.id}
                      variant={selectedMood === mood.id ? 'default' : 'outline'}
                      className="flex flex-col items-center gap-2 h-auto py-3 px-4 min-w-[90px] flex-shrink-0"
                      onClick={() => handleMoodSelect(mood.id)}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{mood.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
            <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Price Range</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center gap-4">
              <div className="flex-1">
                <Input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceInputChange(0, e.target.value)}
                  className="w-full"
                  min={0}
                  max={priceRange[1]}
                />
              </div>
              <span className="text-muted-foreground">to</span>
              <div className="flex-1">
                <Input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceInputChange(1, e.target.value)}
                  className="w-full"
                  min={priceRange[0]}
                  max={200}
                />
              </div>
            </div>
            <div className="relative">
              <Slider
                value={priceRange}
                onValueChange={handlePriceChange}
                max={200}
                step={10}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Outfits Grid */}
        <div className="outfits-grid">
          {loading ? (
            <div className="text-center py-8">Loading outfits...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {outfits.map((outfit) => (
                <div key={outfit.id} className="outfit-card">
                  <div className="relative">
                    {photoPreview && (
                      <img
                        src={photoPreview}
                        alt="Your photo"
                        className="w-full h-64 object-cover rounded-lg opacity-50"
                      />
                    )}
                    <img 
                      src={outfit.image} 
                      alt={`Outfit for ${selectedMood}`}
                      className={`w-full h-64 object-cover rounded-lg ${photoPreview ? 'absolute top-0 left-0 mix-blend-overlay' : ''}`}
                      onError={(e) => {
                        e.target.src = 'https://source.unsplash.com/random/300x400/?fashion,outfit';
                      }}
                    />
                  </div>
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