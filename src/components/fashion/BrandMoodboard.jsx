import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImageIcon, Plus, Sparkles } from 'lucide-react';

export function BrandMoodboard() {
  const [moodboard, setMoodboard] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (query) => {
    setSearchQuery(query);
    // Mock API call to get suggestions
    const mockSuggestions = [
      { id: 1, image: '/api/placeholder/200/200', emotion: 'empowering', likes: 120 },
      { id: 2, image: '/api/placeholder/200/200', emotion: 'bold', likes: 95 },
      { id: 3, image: '/api/placeholder/200/200', emotion: 'romantic', likes: 78 },
    ];
    setSuggestions(mockSuggestions);
  };

  const addToMoodboard = (item) => {
    setMoodboard([...moodboard, item]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Brand Moodboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <Input
            placeholder="Search for inspiration..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Button>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Suggestions
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {moodboard.map((item) => (
            <div key={item.id} className="relative group">
              <img
                src={item.image}
                alt="Moodboard item"
                className="w-full h-32 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <Button variant="destructive" size="sm">
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <div className="border-2 border-dashed rounded-lg flex items-center justify-center h-32">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <ScrollArea className="h-[200px]">
          <div className="grid grid-cols-2 gap-4">
            {suggestions.map((item) => (
              <div key={item.id} className="relative group">
                <img
                  src={item.image}
                  alt="Suggestion"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Button onClick={() => addToMoodboard(item)}>
                    Add to Moodboard
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className="bg-white bg-opacity-75 px-2 py-1 rounded text-sm">
                    {item.emotion}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 