import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  BarChart2, 
  ThumbsUp, 
  ThumbsDown, 
  Heart, 
  MessageSquare 
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockCampaigns = [
  {
    id: 1,
    title: 'Summer Collection 2024',
    image: '/api/placeholder/400/200',
    uploadDate: '2024-04-01',
    reactions: {
      positive: 120,
      negative: 15,
      neutral: 45,
    },
    emotions: {
      empowering: 0,
      casual: 0,
      bold: 0,
      romantic: 0,
    },
    comments: [],
  },
];

const SENTIMENTS = [
  { value: 'empowering', label: 'Empowering' },
  { value: 'casual', label: 'Casual' },
  { value: 'bold', label: 'Bold' },
  { value: 'romantic', label: 'Romantic' },
];

export function CampaignFeedback() {
  const [selectedSentiment, setSelectedSentiment] = useState('empowering');
  const [imagePreview, setImagePreview] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [emotions, setEmotions] = useState({
    empowering: 0,
    casual: 0,
    bold: 0,
    romantic: 0,
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setImagePreview(null);
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim() || !selectedSentiment) {
      toast({
        title: "Error",
        description: "Please enter a comment and select a sentiment",
        variant: "destructive",
      });
      return;
    }

    const newCommentObj = {
      id: Date.now(),
      text: newComment,
      timestamp: new Date().toISOString(),
      sentiment: selectedSentiment,
    };

    setComments([...comments, newCommentObj]);
    setNewComment('');

    // Update emotions based on the selected sentiment
    setEmotions(prev => ({
      ...prev,
      [selectedSentiment]: Math.min(prev[selectedSentiment] + 25, 100)
    }));
  };

  return (
    <Card className="w-full max-w-3xl mx-auto p-6">
      <CardHeader className="px-0">
        <CardTitle>Campaign Feedback Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 px-0">
        {/* Image Upload Section */}
        <div className="flex items-center gap-6">
          <div className="flex-1 min-w-0">
            {imagePreview ? (
              <div className="relative w-full h-48">
                <img
                  src={imagePreview}
                  alt="Campaign preview"
                  className="object-cover rounded-lg w-full h-full"
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center p-4">
                <p className="text-muted-foreground text-center break-words max-w-full">
                  No image uploaded
                </p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <Button
              onClick={() => document.getElementById('campaign-upload').click()}
              className="w-[140px]"
              variant="outline"
            >
              Upload Image
            </Button>
            <input
              type="file"
              id="campaign-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {imagePreview && (
              <Button
                onClick={handleDeleteImage}
                className="w-[140px]"
                variant="destructive"
              >
                Delete Image
              </Button>
            )}
          </div>
        </div>

        {/* Comment Input Section */}
        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex-1 min-w-0">
              <Textarea
                placeholder="Add your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px] w-full"
              />
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Select
                value={selectedSentiment}
                onValueChange={setSelectedSentiment}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select sentiment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empowering">Empowering</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="romantic">Romantic</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleCommentSubmit} 
                className="w-[140px]"
                disabled={!newComment.trim() || !selectedSentiment}
              >
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* Emotion Sliders Section */}
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(emotions).map(([emotion, value]) => (
            <div key={emotion} className="bg-card border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium capitalize text-foreground truncate">{emotion}</span>
                <Badge variant="outline">{value}%</Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all duration-300"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Comments Section */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-foreground break-words">{comment.text}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(comment.timestamp).toLocaleString()}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0">{comment.sentiment}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 