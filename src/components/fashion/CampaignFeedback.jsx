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
  const [selectedCampaign, setSelectedCampaign] = useState(mockCampaigns[0]);
  const [newComment, setNewComment] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState('');
  const [userReaction, setUserReaction] = useState(null);

  const handleCommentSubmit = () => {
    if (newComment.trim() && selectedSentiment) {
      const newCommentObj = {
        id: Date.now(),
        user: 'current_user',
        text: newComment.trim(),
        emotion: selectedSentiment
      };
      
      setSelectedCampaign(prev => {
        const updatedEmotions = { ...prev.emotions };
        
        // Update emotion values
        if (selectedSentiment && updatedEmotions.hasOwnProperty(selectedSentiment)) {
          updatedEmotions[selectedSentiment] = Math.min(100, updatedEmotions[selectedSentiment] + 25);
        }
        
        return {
          ...prev,
          emotions: updatedEmotions,
          comments: [...prev.comments, newCommentObj]
        };
      });
      
      setNewComment('');
      setSelectedSentiment('');
      toast.success('Comment added successfully');
    } else {
      toast.error('Please add both comment and sentiment');
    }
  };

  const handleUpload = (e) => {
    // Handle file upload logic here
    console.log('File uploaded:', e.target.files[0]);
  };

  const handleReaction = (reaction) => {
    if (userReaction === reaction) {
      // Remove reaction
      setUserReaction(null);
      setSelectedCampaign(prev => ({
        ...prev,
        reactions: {
          ...prev.reactions,
          [reaction]: prev.reactions[reaction] - 1
        }
      }));
      toast.info('Reaction removed');
    } else {
      // Add new reaction
      if (userReaction) {
        // Remove previous reaction
        setSelectedCampaign(prev => ({
          ...prev,
          reactions: {
            ...prev.reactions,
            [userReaction]: prev.reactions[userReaction] - 1
          }
        }));
      }
      setUserReaction(reaction);
      setSelectedCampaign(prev => ({
        ...prev,
        reactions: {
          ...prev.reactions,
          [reaction]: prev.reactions[reaction] + 1
        }
      }));
      toast.success(`Added ${reaction} reaction`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Campaign Feedback Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              id="campaign-upload"
            />
            <Button asChild>
              <label htmlFor="campaign-upload" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Upload Campaign Content
              </label>
            </Button>
          </div>

          {selectedCampaign && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={selectedCampaign.image}
                  alt={selectedCampaign.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex items-center gap-1 ${
                        userReaction === 'positive' ? 'text-green-500' : 'text-muted-foreground'
                      }`}
                      onClick={() => handleReaction('positive')}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{selectedCampaign.reactions.positive}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`flex items-center gap-1 ${
                        userReaction === 'negative' ? 'text-red-500' : 'text-muted-foreground'
                      }`}
                      onClick={() => handleReaction('negative')}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>{selectedCampaign.reactions.negative}</span>
                    </Button>
                  </div>
                  <Badge variant="secondary">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    {selectedCampaign.comments.length}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(selectedCampaign.emotions).map(([emotion, value]) => (
                  <div key={emotion} className="bg-card border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium capitalize text-foreground">{emotion}</span>
                      <Badge variant="outline">{value}%</Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Comments</h3>
                {selectedCampaign.comments.map((comment) => (
                  <div key={comment.id} className="bg-card border p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-foreground">@{comment.user}</span>
                      <Badge variant="outline" className="capitalize">
                        {comment.emotion}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.text}</p>
                  </div>
                ))}

                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <Textarea
                      placeholder="Add your comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="text-foreground flex-1"
                    />
                    <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select sentiment" />
                      </SelectTrigger>
                      <SelectContent>
                        {SENTIMENTS.map((sentiment) => (
                          <SelectItem key={sentiment.value} value={sentiment.value}>
                            {sentiment.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleCommentSubmit}
                    disabled={!newComment.trim() || !selectedSentiment}
                    className="self-end"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 