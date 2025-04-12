import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ImageIcon, Plus, Sparkles, X, Search } from 'lucide-react';
import { toast } from 'sonner';

export function BrandMoodboard() {
  const [moodboard, setMoodboard] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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
              <Button variant="secondary" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Generate
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