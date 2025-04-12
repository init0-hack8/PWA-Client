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
  Search 
} from 'lucide-react';

const mockItems = [
  {
    id: 1,
    image: '/api/placeholder/200/300',
    brand: 'Zara',
    name: 'Oversized Blazer',
    price: '$89.99',
    tags: ['formal', 'workwear', 'trendy'],
    emotions: ['confident', 'professional'],
  },
  {
    id: 2,
    image: '/api/placeholder/200/300',
    brand: 'H&M',
    name: 'Denim Jacket',
    price: '$49.99',
    tags: ['casual', 'streetwear', 'versatile'],
    emotions: ['chill', 'cool'],
  },
];

export function CollaborativeCloset() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && selectedItem) {
      // Add tag logic here
      setNewTag('');
    }
  };

  const filteredItems = mockItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Collaborative Closet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`relative group cursor-pointer ${
                  selectedItem?.id === item.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col justify-end p-4">
                  <div className="text-white">
                    <p className="font-semibold">{item.brand}</p>
                    <p>{item.name}</p>
                    <p className="text-sm">{item.price}</p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedItem && (
          <div className="space-y-4">
            <h3 className="font-semibold">Item Details</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <Button onClick={handleAddTag}>
                <Tag className="w-4 h-4 mr-2" />
                Add Tag
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Emotions</h4>
              <div className="flex gap-2">
                {selectedItem.emotions.map((emotion) => (
                  <Badge key={emotion} variant="outline">
                    {emotion}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline">
                <ShoppingBag className="w-4 h-4 mr-2" />
                View Similar Products
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 