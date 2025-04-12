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
      empowering: 65,
      casual: 45,
      bold: 55,
      romantic: 40,
    },
    comments: [
      { id: 1, user: 'fashionista123', text: 'Love the empowering vibes!', emotion: 'empowering' },
      { id: 2, user: 'stylequeen', text: 'The bold colors are amazing!', emotion: 'bold' },
    ],
  },
];

export function CampaignFeedback() {
  const [selectedCampaign, setSelectedCampaign] = useState(mockCampaigns[0]);
  const [newComment, setNewComment] = useState('');

  const handleUpload = (e) => {
    // Handle file upload logic here
    console.log('File uploaded:', e.target.files[0]);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      // Add comment logic here
      setNewComment('');
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
                    <Badge variant="secondary">
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      {selectedCampaign.reactions.positive}
                    </Badge>
                    <Badge variant="secondary">
                      <ThumbsDown className="w-3 h-3 mr-1" />
                      {selectedCampaign.reactions.negative}
                    </Badge>
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

                <div className="flex gap-2">
                  <Textarea
                    placeholder="Add your comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="text-foreground"
                  />
                  <Button onClick={handleCommentSubmit}>Send</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 