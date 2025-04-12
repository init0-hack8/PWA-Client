import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImageIcon, Plus, Sparkles, X, Search } from 'lucide-react';
import { toast } from 'sonner';

const GEMINI_API_KEY = 'AIzaSyCXCFLv0J3y4oKbOnxH6e3OZoDCkxVfC8I';

export function BrandMoodboard() {
  const [moodboard, setMoodboard] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef(null);

  const listAvailableModels = async () => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`);
      const data = await response.json();
      console.log('Available models:', data);
      return data;
    } catch (error) {
      console.error('Error listing models:', error);
      return null;
    }
  };

  const generateSuggestions = async () => {
    try {
      setIsGenerating(true);
      
      // First, list available models to ensure we're using the correct one
      const models = await listAvailableModels();
      if (!models) {
        throw new Error('Could not fetch available models');
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate fashion moodboard suggestions based on the following query: ${searchQuery || 'general fashion trends'}. 
              Provide 3 suggestions with emotions and styles. Format each suggestion as: "Emotion: Style description"
              Example format:
              Elegant: Classic black dress with pearl accessories
              Edgy: Leather jacket with ripped jeans
              Bohemian: Flowy maxi dress with layered jewelry"`
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API request failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from API');
      }

      const generatedText = data.candidates[0].content.parts[0].text;
      const suggestions = generatedText.split('\n')
        .filter(line => line.trim() && line.includes(':'))
        .map((line, index) => {
          const [emotion, ...styleParts] = line.split(':').map(part => part.trim());
          const style = styleParts.join(':').trim();
          return {
            id: index + 1,
            image: `https://source.unsplash.com/random/300x400/?${style.toLowerCase().replace(/\s+/g, ',')},fashion`,
            emotion: emotion || 'trendy',
            style: style || 'fashion trend',
            likes: Math.floor(Math.random() * 100) + 50
          };
        });

      if (suggestions.length === 0) {
        throw new Error('No valid suggestions generated');
      }

      setSuggestions(suggestions);
      toast.success('Generated new suggestions!');
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast.error(`Failed to generate suggestions: ${error.message}`);
      // Fallback to mock data if API fails
      const mockSuggestions = [
        { id: 1, image: 'https://source.unsplash.com/random/300x400/?fashion,trendy', emotion: 'Trendy', style: 'Modern street style', likes: 85 },
        { id: 2, image: 'https://source.unsplash.com/random/300x400/?fashion,classic', style: 'Timeless elegance', likes: 92 },
        { id: 3, image: 'https://source.unsplash.com/random/300x400/?fashion,bohemian', emotion: 'Bohemian', style: 'Free-spirited chic', likes: 78 }
      ];
      setSuggestions(mockSuggestions);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleGenerateClick = async () => {
    if (searchQuery.trim()) {
      await generateSuggestions();
    } else {
      toast.error('Please enter a search query first');
    }
  };

  const addToMoodboard = (item) => {
    setMoodboard([...moodboard, item]);
    toast.success('Added to moodboard');
  };

  const removeFromMoodboard = (itemId) => {
    setMoodboard(moodboard.filter(item => item.id !== itemId));
    toast.success('Removed from moodboard');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const handleFiles = (files) => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const validFiles = Array.from(files).filter(file => validImageTypes.includes(file.type));

    if (validFiles.length === 0) {
      toast.error('Please upload valid image files (JPEG, PNG, GIF, WEBP)');
      return;
    }

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newItem = {
          id: Date.now() + Math.random(),
          image: e.target.result,
          emotion: 'custom',
          likes: 0
        };
        setMoodboard(prev => [...prev, newItem]);
      };
      reader.readAsDataURL(file);
    });
    toast.success('Images uploaded successfully');
  };

  const handleFileInputChange = (e) => {
    if (e.target.files.length) {
      handleFiles(e.target.files);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Brand Moodboard</CardTitle>
        <p className="text-sm text-muted-foreground">
          Create your brand's visual identity by collecting inspiring images
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {/* Search Section */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for inspiration..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9 bg-background"
                />
              </div>
              <Button 
                variant="secondary" 
                className="flex items-center gap-2"
                onClick={handleGenerateClick}
                disabled={isGenerating}
              >
                <Sparkles className="w-4 h-4" />
                {isGenerating ? 'Generating...' : 'Generate'}
              </Button>
            </div>

            {/* Suggestions Section */}
            <ScrollArea className="h-[200px] rounded-lg border bg-muted/40">
              <div className="grid grid-cols-2 gap-4 p-4">
                {suggestions.map((item) => (
                  <div key={item.id} className="relative group overflow-hidden rounded-lg">
                    <img
                      src={item.image}
                      alt="Suggestion"
                      className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end">
                        <span className="text-white text-sm font-medium">
                          {item.emotion}
                        </span>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          onClick={() => addToMoodboard(item)}
                          className="bg-background hover:bg-background/90 text-foreground"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Moodboard Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {moodboard.map((item) => (
              <div key={item.id} className="relative group aspect-square rounded-lg overflow-hidden">
                <img
                  src={item.image}
                  alt="Moodboard item"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="destructive"
                    size="sm"
                    className="absolute bottom-2 right-2"
                    onClick={() => removeFromMoodboard(item.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div 
              className={`aspect-square rounded-lg transition-colors cursor-pointer flex flex-col items-center justify-center
                ${isDragging 
                  ? 'border-2 border-primary bg-primary/10' 
                  : 'border-2 border-dashed border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
                }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileInputChange}
              />
              <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center px-4">
                {isDragging ? 'Drop images here' : 'Click or drag images here'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 