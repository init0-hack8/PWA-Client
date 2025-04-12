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
  Camera,
  Trash2
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
  const count = Math.floor(Math.random() * 3) + 2; // 2-4 outfits
  
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
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [tryOnOutfits, setTryOnOutfits] = useState({});

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

  const handleDeletePhoto = () => {
    setUserPhoto(null);
    setPhotoPreview(null);
    setTryOnOutfits({});
  };

  const toggleTryOn = (outfitId) => {
    setTryOnOutfits(prev => ({
      ...prev,
      [outfitId]: !prev[outfitId]
    }));
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setLoading(true);
    setTimeout(() => {
      setOutfits(generateOutfits(mood, priceRange));
      setLoading(false);
    }, 1000);
  };

  const handlePriceChange = (range) => {
    setPriceRange(range);
    setLoading(true);
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
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Virtual Try-On Experience</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Photo Upload */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Upload Your Photo</h3>
                {photoPreview && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeletePhoto}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </Button>
                )}
              </div>
              <div className="w-full h-[400px] relative rounded-lg overflow-hidden">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors bg-muted/5"
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Your photo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground p-4">
                      <Camera className="w-6 h-6" />
                      <span className="text-center text-sm">Upload a full-body photo for the best try-on experience</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Right Column - Controls */}
            <div className="space-y-8">
              {/* Mood Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Your Style Mood</h3>
                <div className="w-full border rounded-lg bg-card">
                  <div className="overflow-x-auto">
                    <div className="flex gap-2 p-4 w-max">
                      {moodFilters.map((mood) => {
                        const Icon = mood.icon;
                        return (
                          <Button
                            key={mood.id}
                            variant={selectedMood === mood.id ? 'default' : 'outline'}
                            className="flex flex-col items-center gap-2 h-auto py-3 px-4 min-w-[90px]"
                            onClick={() => handleMoodSelect(mood.id)}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="text-sm whitespace-nowrap">{mood.label}</span>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Price Range (₹0 - ₹5000)</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => handlePriceInputChange(0, e.target.value)}
                      className="w-24"
                      min={0}
                      max={priceRange[1]}
                      placeholder="Min"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => handlePriceInputChange(1, e.target.value)}
                      className="w-24"
                      min={priceRange[0]}
                      max={5000}
                      placeholder="Max"
                    />
                  </div>
                  <Slider
                    value={priceRange}
                    onValueChange={handlePriceChange}
                    max={5000}
                    step={100}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Outfits Grid */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-6">Recommended Outfits</h3>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Finding perfect outfits for your mood...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {outfits.map((outfit) => (
                  <Card key={outfit.id} className="overflow-hidden">
                    <div className="relative aspect-[4/3]">
                      {tryOnOutfits[outfit.id] && photoPreview ? (
                        <>
                          <img
                            src={photoPreview}
                            alt="Your photo"
                            className="absolute inset-0 w-full h-full object-cover opacity-50"
                          />
                          <img 
                            src={outfit.image} 
                            alt={`Outfit for ${selectedMood}`}
                            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                            onError={(e) => {
                              e.target.src = 'https://source.unsplash.com/random/300x400/?fashion,outfit';
                            }}
                          />
                        </>
                      ) : (
                        <img 
                          src={outfit.image} 
                          alt={`Outfit for ${selectedMood}`}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://source.unsplash.com/random/300x400/?fashion,outfit';
                          }}
                        />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold">₹{outfit.price}</span>
                        <span className="text-sm text-muted-foreground">⭐ {outfit.rating}</span>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => toggleTryOn(outfit.id)}
                        disabled={!photoPreview}
                        variant={tryOnOutfits[outfit.id] ? "secondary" : "default"}
                      >
                        {tryOnOutfits[outfit.id] ? "Remove Try-On" : "Try On"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 