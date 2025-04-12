import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Tag, 
  ShoppingBag, 
  Share2, 
  Plus, 
  Search,
  X,
  Star,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

const mockItems = [
  {
    id: 1,
    image: '/api/placeholder/200/300',
    brand: 'Zara',
    name: 'Oversized Blazer',
    price: '$89.99',
    tags: ['formal', 'workwear', 'trendy'],
    emotions: ['confident', 'professional'],
    rating: 4.5,
    ratingCount: 12
  },
  {
    id: 2,
    image: '/api/placeholder/200/300',
    brand: 'H&M',
    name: 'Denim Jacket',
    price: '$49.99',
    tags: ['casual', 'streetwear', 'versatile'],
    emotions: ['chill', 'cool'],
    rating: 4.2,
    ratingCount: 8
  },
  {
    id: 3,
    image: 'https://source.unsplash.com/random/300x400/?fashion,outfit',
    brand: 'Nike',
    name: 'Sporty Outfit',
    price: '$129.99',
    tags: ['sporty', 'casual', 'active'],
    emotions: ['energetic', 'active'],
    rating: 4.8,
    ratingCount: 15
  },
  {
    id: 4,
    image: 'https://source.unsplash.com/random/300x400/?fashion,formal',
    brand: 'Gucci',
    name: 'Formal Suit',
    price: '$899.99',
    tags: ['formal', 'luxury', 'elegant'],
    emotions: ['sophisticated', 'elegant'],
    rating: 4.9,
    ratingCount: 20
  }
];

const tryOnItems = [
  {
    id: 't1',
    image: 'https://source.unsplash.com/random/300x400/?fashion,summer',
    brand: 'H&M',
    name: 'Summer Dress',
    price: '$39.99',
    tags: ['summer', 'casual', 'dress'],
    emotions: ['happy', 'relaxed']
  },
  {
    id: 't2',
    image: 'https://source.unsplash.com/random/300x400/?fashion,accessories',
    brand: 'Zara',
    name: 'Statement Necklace',
    price: '$29.99',
    tags: ['accessories', 'statement', 'trendy'],
    emotions: ['bold', 'confident']
  }
];

export function CollaborativeCloset() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [closetItems, setClosetItems] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [showTryOnDialog, setShowTryOnDialog] = useState(false);
  const [selectedTryOnItems, setSelectedTryOnItems] = useState([]);

  const handleAddTag = () => {
    if (newTag.trim() && selectedItem) {
      // Add tag logic here
      setNewTag('');
    }
  };

  const handleRating = (rating) => {
    if (!selectedItem) return;
    
    const updatedItems = closetItems.map(item => {
      if (item.id === selectedItem.id) {
        const newRating = ((item.rating * item.ratingCount) + rating) / (item.ratingCount + 1);
        return {
          ...item,
          rating: newRating,
          ratingCount: item.ratingCount + 1
        };
      }
      return item;
    });
    
    setClosetItems(updatedItems);
    setSelectedItem(updatedItems.find(item => item.id === selectedItem.id));
    setUserRating(rating);
    toast.success('Rating submitted successfully');
  };

  const handleShare = async () => {
    if (!selectedItem) return;

    try {
      const shareData = {
        title: selectedItem.name,
        text: `Check out this ${selectedItem.category} from ${selectedItem.brand}!`,
        url: selectedItem.image
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(shareData.text);
        toast.success('Item details copied to clipboard');
      }
    } catch (error) {
      toast.error('Failed to share item');
    }
  };

  const handleAddItem = (item) => {
    if (closetItems.some(existingItem => existingItem.id === item.id)) {
      toast.error('This item is already in your closet');
      return;
    }
    setClosetItems([...closetItems, item]);
    setSelectedItem(item);
    setShowAddDialog(false);
    toast.success('Item added to your closet');
  };

  const handleRemoveItem = (itemId) => {
    setClosetItems(closetItems.filter(item => item.id !== itemId));
    setSelectedItem(null);
    toast.success('Item removed from your closet');
  };

  const importFromTryOn = (items) => {
    const newItems = items.map(item => ({
      ...item,
      id: Date.now() + Math.random(), // Generate unique ID
      rating: 0,
      ratingCount: 0
    }));
    
    setClosetItems([...closetItems, ...newItems]);
    toast.success(`${newItems.length} items imported from TryOn`);
  };

  const handleAddFromTryOn = () => {
    setShowTryOnDialog(true);
  };

  const handleSelectTryOnItem = (item) => {
    setSelectedTryOnItems(prev => {
      if (prev.some(i => i.id === item.id)) {
        return prev.filter(i => i.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const handleImportSelected = () => {
    if (selectedTryOnItems.length === 0) {
      toast.error('Please select at least one item to import');
      return;
    }
    importFromTryOn(selectedTryOnItems);
    setShowTryOnDialog(false);
    setSelectedTryOnItems([]);
  };

  const filteredItems = mockItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Card className="w-full max-w-4xl mx-auto p-4 sm:p-6">
      <CardHeader className="px-0 pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl sm:text-2xl">Your Closet</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Add and manage your fashion items
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleAddFromTryOn}
              className="flex-1 sm:flex-none flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Import from TryOn
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAddDialog(true)}
              className="flex-1 sm:flex-none flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Items
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        {closetItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your closet is empty</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Start adding items to your collaborative closet
            </p>
            <Button 
              variant="outline"
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Your First Item
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {closetItems.map((item) => (
              <div 
                key={item.id} 
                className="relative group aspect-square rounded-lg overflow-hidden cursor-pointer border"
                onClick={() => setSelectedItem(item)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://source.unsplash.com/random/300x400/?fashion,clothing';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-medium truncate">{item.name}</h3>
                    <p className="text-white/80 text-sm truncate">{item.brand}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TryOn Import Dialog */}
        {showTryOnDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-4 sm:p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Select Items to Import from TryOn</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setShowTryOnDialog(false);
                    setSelectedTryOnItems([]);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                {tryOnItems.map((item) => (
                  <div 
                    key={item.id}
                    className={`relative group aspect-square rounded-lg overflow-hidden cursor-pointer border ${
                      selectedTryOnItems.some(i => i.id === item.id) ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleSelectTryOnItem(item)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://source.unsplash.com/random/300x400/?fashion,clothing';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-white font-medium truncate">{item.name}</h3>
                        <p className="text-white/80 text-sm truncate">{item.brand}</p>
                        <p className="text-white/80 text-sm truncate">{item.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowTryOnDialog(false);
                    setSelectedTryOnItems([]);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImportSelected}
                  disabled={selectedTryOnItems.length === 0}
                >
                  Import Selected ({selectedTryOnItems.length})
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Add Item Dialog */}
        {showAddDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-4 sm:p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Select an Item to Add</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowAddDialog(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {mockItems.map((item) => (
                  <div 
                    key={item.id}
                    className="relative group aspect-square rounded-lg overflow-hidden cursor-pointer border"
                    onClick={() => handleAddItem(item)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://source.unsplash.com/random/300x400/?fashion,clothing';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-white font-medium truncate">{item.name}</h3>
                        <p className="text-white/80 text-sm truncate">{item.brand}</p>
                        <p className="text-white/80 text-sm truncate">{item.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Item Details */}
        {selectedItem && (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="text-lg font-semibold truncate">{selectedItem.name}</h3>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleShare}
                  className="flex-1 sm:flex-none flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleRemoveItem(selectedItem.id)}
                  className="flex-1 sm:flex-none flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Brand</p>
                <p className="font-medium">{selectedItem.brand}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-medium">{selectedItem.price}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Tags</p>
              <div className="flex flex-wrap gap-2">
                {selectedItem.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Emotions</p>
              <div className="flex flex-wrap gap-2">
                {selectedItem.emotions.map((emotion) => (
                  <Badge key={emotion} variant="outline">
                    {emotion}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Rating</p>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(selectedItem.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({selectedItem.ratingCount} reviews)
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 