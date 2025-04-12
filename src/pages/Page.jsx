import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function SocialMediaApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [likedPosts, setLikedPosts] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: 'sarah_designs',
      fullName: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40',
      content: 'Just finished my latest UI design project! So excited to share it with everyone soon.',
      image: '/api/placeholder/400/250',
      likes: 124,
      comments: 18,
      time: '2h'
    },
    {
      id: 2,
      username: 'tech_dave',
      fullName: 'Dave Williams',
      avatar: '/api/placeholder/40/40',
      content: 'Attended an amazing workshop on React performance optimizations today. Here are some highlights from the event!',
      image: '/api/placeholder/400/250',
      likes: 89,
      comments: 12,
      time: '4h'
    },
    {
      id: 3,
      username: 'travel_with_emma',
      fullName: 'Emma Chen',
      avatar: '/api/placeholder/40/40',
      content: 'Sunrise hike in the mountains this morning. Worth waking up at 5am!',
      image: '/api/placeholder/400/250',
      likes: 243,
      comments: 36,
      time: '6h'
    }
  ]);
  
  // Comment state
  const [comments, setComments] = useState({
    1: [
      { id: 1, username: 'mike_dev', content: 'Looks amazing! Can\'t wait to see it.', time: '1h' },
      { id: 2, username: 'design_lover', content: 'Your work is always so inspiring!', time: '45m' }
    ],
    2: [
      { id: 1, username: 'react_expert', content: 'Did they talk about the new concurrent mode?', time: '2h' }
    ],
    3: [
      { id: 1, username: 'mountain_hiker', content: 'What a beautiful view! Which mountain is this?', time: '5h' },
      { id: 2, username: 'early_bird', content: 'Totally worth it for views like that!', time: '4h' }
    ]
  });
  
  // Dialog states
  const [newPostDialog, setNewPostDialog] = useState(false);
  const [commentDialog, setCommentDialog] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [profileEditDialog, setProfileEditDialog] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(Array(12).fill(null).map((_, i) => ({
    id: i,
    image: `/api/placeholder/${150}/${150}`
  })));
  
  // Notification state
  const [notifications, setNotifications] = useState([]);
  
  // Profile state
  const [profile, setProfile] = useState({
    username: 'your_username',
    fullName: 'Your Name',
    bio: 'Digital creator and photography enthusiast',
    avatar: '/api/placeholder/80/80',
    posts: 248,
    followers: 12400,
    following: 142,
    images: Array(9).fill(null).map((_, i) => ({ id: i, src: `/api/placeholder/${150}/${150}` }))
  });
  
  // Following state (for follow/unfollow functionality)
  const [following, setFollowing] = useState({});
  
  // New states for photo upload and alerts
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Functions
  const showNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setNotifications(prev => [notification, ...prev]);
    
    // Show temporary alert
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };
  
  const showAlert = (message, type = 'info') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };
  
  const toggleLike = (postId) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      const isLiked = likedPosts[postId];
      setLikedPosts(prev => ({
        ...prev,
        [postId]: !isLiked
      }));
      
      setPosts(prev => 
        prev.map(p => 
          p.id === postId 
            ? { ...p, likes: p.likes + (isLiked ? -1 : 1) } 
            : p
        )
      );
      
      showNotification(
        isLiked 
          ? `You unliked @${post.username}'s post` 
          : `You liked @${post.username}'s post`,
        isLiked ? 'info' : 'success'
      );
    }
  };
  
  const toggleBookmark = (postId) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      const isBookmarked = bookmarkedPosts[postId];
      setBookmarkedPosts(prev => ({
        ...prev,
        [postId]: !isBookmarked
      }));
      
      showNotification(
        isBookmarked 
          ? `Removed @${post.username}'s post from bookmarks` 
          : `Saved @${post.username}'s post to bookmarks`,
        'success'
      );
    }
  };
  
  const toggleFollow = (username) => {
    setFollowing(prev => ({
      ...prev,
      [username]: !prev[username]
    }));
    
    // Update follower count in profile if user follows/unfollows
    if (username === profile.username) {
      setProfile(prev => ({
        ...prev,
        followers: prev.followers + (following[username] ? -1 : 1)
      }));
    }
    
    // Add notification when following someone
    if (!following[username]) {
      showNotification(`You started following @${username}`, 'success');
    } else {
      showNotification(`You unfollowed @${username}`, 'info');
    }
  };
  
  const openCommentDialog = (postId) => {
    setCurrentPostId(postId);
    setCommentDialog(true);
  };
  
  const addComment = () => {
    if (newComment.trim() === '') return;
    
    const post = posts.find(p => p.id === currentPostId);
    if (post) {
      const comment = {
        id: Date.now(),
        username: profile.username,
        content: newComment,
        time: 'Just now'
      };
      
      setComments(prev => ({
        ...prev,
        [currentPostId]: [...(prev[currentPostId] || []), comment]
      }));
      
      setPosts(prev => 
        prev.map(p => 
          p.id === currentPostId 
            ? { ...p, comments: p.comments + 1 } 
            : p
        )
      );
      
      showNotification(
        `You commented on @${post.username}'s post`,
        'success'
      );
      
      setNewComment('');
      setCommentDialog(false);
    }
  };
  
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showAlert('Image size should be less than 5MB', 'error');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const createNewPost = () => {
    if (newPostContent.trim() === '' && !selectedImage) {
      showNotification('Please add some content or an image', 'error');
      return;
    }
    
    const newPost = {
      id: Date.now(),
      username: profile.username,
      fullName: profile.fullName,
      avatar: profile.avatar,
      content: newPostContent,
      image: selectedImage ? imagePreview : '/api/placeholder/400/250',
      likes: 0,
      comments: 0,
      time: 'Just now'
    };
    
    setPosts(prev => [newPost, ...prev]);
    setNewPostContent('');
    setSelectedImage(null);
    setImagePreview(null);
    setNewPostDialog(false);
    
    setProfile(prev => ({
      ...prev,
      posts: prev.posts + 1
    }));

    showNotification('Post created successfully!', 'success');
  };
  
  const deletePost = (postId) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setPosts(prev => prev.filter(p => p.id !== postId));
      showNotification(`Post by @${post.username} deleted successfully`, 'success');
    }
  };
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    
    // Simulate search results - in a real app this would query backend
    if (e.target.value.trim() !== '') {
      setSearchResults(
        Array(Math.floor(Math.random() * 8) + 4).fill(null).map((_, i) => ({
          id: i,
          image: `/api/placeholder/${150}/${150}`
        }))
      );
    } else {
      setSearchResults(
        Array(12).fill(null).map((_, i) => ({
          id: i,
          image: `/api/placeholder/${150}/${150}`
        }))
      );
    }
  };
  
  const updateProfile = (newProfileData) => {
    setProfile(prev => ({
      ...prev,
      ...newProfileData
    }));
    setProfileEditDialog(false);
    showNotification('Profile updated successfully!', 'success');
  };
  
  const sharePost = (postId) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      const shareData = {
        title: `Post by @${post.username}`,
        text: post.content,
        url: window.location.href
      };
      
      if (navigator.share) {
        navigator.share(shareData)
          .then(() => showNotification('Post shared successfully!', 'success'))
          .catch(() => showNotification('Sharing failed', 'error'));
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(`${post.content}\n\nShared from SocialApp`);
        showNotification('Post link copied to clipboard!', 'success');
      }
    }
  };
  
  const clearNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Custom Icon Components using text/emoji
  const IconHome = () => <span className="text-base">🏠</span>;
  const IconSearch = () => <span className="text-base">🔍</span>;
  const IconBell = () => <span className="text-base">🔔</span>;
  const IconUser = () => <span className="text-base">👤</span>;
  const IconHeart = ({ filled }) => <span className={`text-base ${filled ? "text-red-500" : ""}`}>❤️</span>;
  const IconComment = () => <span className="text-base">💬</span>;
  const IconShare = () => <span className="text-base">↗️</span>;
  const IconCamera = () => <span className="text-base">📷</span>;
  const IconMessage = () => <span className="text-base">✉️</span>;
  const IconMore = () => <span className="text-base">⋯</span>;
  const IconBookmark = ({ filled }) => <span className={`text-base ${filled ? "text-primary" : ""}`}>🔖</span>;
  const IconSend = () => <span className="text-base">📤</span>;
  const IconSettings = () => <span className="text-base">⚙️</span>;
  const IconGallery = () => <span className="text-base">🖼️</span>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Notifications/Alerts Section */}
      <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
        {alert.show && (
          <Alert
            variant={alert.type === 'error' ? 'destructive' : 'default'}
            className="animate-in slide-in-from-right duration-300"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <div className="flex-1">
                <AlertDescription>
                  {alert.message}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}
      </div>

      {/* Top Header */}
      <div className="bg-background p-4 flex justify-between items-center sticky top-0 z-10 border-b">
        <h1 className="text-2xl font-bold text-primary">SocialApp</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setNewPostDialog(true)}>
            <IconCamera />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setActiveTab('notifications')}>
            <div className="relative">
              <IconBell />
              {notifications.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                >
                  {notifications.length}
                </Badge>
              )}
            </div>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="home" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="home" className="pb-20 p-3 mt-0">
          {posts.map(post => (
            <Card key={post.id} className="mb-4 bg-card text-card-foreground">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>{post.username[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{post.fullName}</p>
                    <p className="text-sm text-muted-foreground">@{post.username}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-foreground hover:text-primary">
                    <IconMore />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-popover text-popover-foreground">
                    <DropdownMenuItem 
                      onClick={() => toggleFollow(post.username)}
                      className={following[post.username] ? 'text-primary' : ''}
                    >
                      {following[post.username] ? 'Unfollow' : 'Follow'} @{post.username}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => deletePost(post.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      Delete Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-foreground">{post.content}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full rounded-lg"
                  />
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-4">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1 ${
                      likedPosts[post.id] ? 'text-blue-500' : 'text-muted-foreground hover:text-blue-500'
                    }`}
                  >
                    <IconHeart filled={likedPosts[post.id]} />
                    <span>{post.likes}</span>
                  </button>
                  <button
                    onClick={() => openCommentDialog(post.id)}
                    className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                  >
                    <IconComment />
                    <span>{post.comments}</span>
                  </button>
                  <button
                    onClick={() => sharePost(post.id)}
                    className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                  >
                    <IconShare />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleBookmark(post.id)}
                    className={`flex items-center gap-1 ${
                      bookmarkedPosts[post.id] ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    <IconBookmark filled={bookmarkedPosts[post.id]} />
                  </button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="search" className="pt-2 pb-20 p-3 mt-0">
          <div className="mb-4">
            <div className="relative">
              <span className="absolute left-2.5 top-2.5 text-muted-foreground">
                🔍
              </span>
              <Input 
                type="text" 
                placeholder="Search" 
                className="pl-8" 
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {searchResults.map((item) => (
              <div key={item.id} className="aspect-square bg-muted rounded-md overflow-hidden">
                <img src={item.image} alt="Search result" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="pt-2 pb-20 p-3 mt-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Notifications</h2>
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllNotifications}>
                Clear all
              </Button>
            )}
          </div>
          
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mx-auto mb-2 text-muted-foreground">🔔</div>
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className="flex items-center p-3 border-b last:border-0">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src="/api/placeholder/40/40" alt={notification.username || 'User'} />
                  <AvatarFallback>{(notification.username || 'U')[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{notification.username || 'User'}</span>
                    {' '}{notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 ml-1" 
                  onClick={() => clearNotification(notification.id)}
                >
                  <IconMore />
                </Button>
              </div>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="profile" className="pt-2 pb-20 p-3 mt-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Your Profile</h2>
            <Button variant="ghost" size="sm" onClick={() => setProfileEditDialog(true)}>
              <IconSettings />
            </Button>
          </div>
          <div className="flex items-center mb-6">
            <Avatar className="h-20 w-20 mr-4">
              <AvatarImage src={profile.avatar} alt="Profile" />
              <AvatarFallback>{profile.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-xl">{profile.fullName}</h3>
              <p className="text-muted-foreground">@{profile.username}</p>
              <p className="text-sm my-1">{profile.bio}</p>
              <Badge variant="outline" className="mt-1">Pro Member</Badge>
            </div>
          </div>
          
          <div className="flex justify-around mb-6 text-center">
            <div>
              <div className="font-bold">{profile.posts}</div>
              <div className="text-muted-foreground text-sm">Posts</div>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div>
              <div className="font-bold">{profile.followers.toLocaleString()}</div>
              <div className="text-muted-foreground text-sm">Followers</div>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div>
              <div className="font-bold">{profile.following}</div>
              <div className="text-muted-foreground text-sm">Following</div>
            </div>
          </div>
          
          <Tabs defaultValue="posts" className="w-full mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="mt-2">
              <div className="grid grid-cols-3 gap-1">
                {posts
                  .filter(post => post.username === profile.username)
                  .map(post => (
                    <div key={post.id} className="aspect-square bg-muted rounded-md overflow-hidden">
                      <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                    </div>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="saved" className="mt-2">
              <div className="grid grid-cols-3 gap-1">
                {posts
                  .filter(post => bookmarkedPosts[post.id])
                  .map(post => (
                    <div key={post.id} className="aspect-square bg-muted rounded-md overflow-hidden">
                      <img src={post.image} alt="Saved post" className="w-full h-full object-cover" />
                    </div>
                  ))}
                {Object.keys(bookmarkedPosts).filter(id => bookmarkedPosts[id]).length === 0 && (
                  <div className="col-span-3 text-center py-8">
                    <div className="text-4xl mx-auto mb-2 text-muted-foreground">🔖</div>
                    <p className="text-muted-foreground">No saved posts yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-2 flex justify-around z-10">
          <TabsList className="grid w-full grid-cols-4 bg-transparent h-auto gap-1">
            <TabsTrigger 
              value="home" 
              className="flex flex-col items-center data-[state=active]:text-primary py-1 px-0"
            >
              <IconHome />
              <span className="text-xs mt-1">Home</span>
            </TabsTrigger>
            <TabsTrigger 
              value="search" 
              className="flex flex-col items-center data-[state=active]:text-primary py-1 px-0"
            >
              <IconSearch />
              <span className="text-xs mt-1">Search</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="flex flex-col items-center data-[state=active]:text-primary py-1 px-0"
            >
              <IconBell />
              <span className="text-xs mt-1">Alerts</span>
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="flex flex-col items-center data-[state=active]:text-primary py-1 px-0"
            >
              <IconUser />
              <span className="text-xs mt-1">Profile</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
      
      {/* Comment Dialog */}
      <Dialog open={commentDialog} onOpenChange={setCommentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          <div className="max-h-64 overflow-y-auto">
            {currentPostId && comments[currentPostId]?.map(comment => (
              <div key={comment.id} className="flex py-2 border-b last:border-0">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback>{comment.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="text-sm font-medium">{comment.username}</p>
                    <p className="text-xs text-muted-foreground ml-2">{comment.time} ago</p>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
            {currentPostId && (!comments[currentPostId] || comments[currentPostId].length === 0) && (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>Y</AvatarFallback>
            </Avatar>
            <Textarea 
              placeholder="Add a comment..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 min-h-0 h-10 py-2"
            />
            <Button 
              size="sm" 
              disabled={!newComment.trim()} 
              onClick={addComment}
              className="text-primary hover:text-primary/80"
            >
              <IconSend />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* New Post Dialog */}
      <Dialog open={newPostDialog} onOpenChange={setNewPostDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer bg-primary/10 p-2 rounded-lg hover:bg-primary/20"
              >
                <IconCamera />
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={createNewPost}>Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Profile Edit Dialog */}
      <Dialog open={profileEditDialog} onOpenChange={setProfileEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex justify-center mb-2">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar} alt={profile.username} />
                <AvatarFallback>{profile.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm" htmlFor="fullName">Full Name</label>
              <Input 
                id="fullName"
                value={profile.fullName}
                onChange={(e) => setProfile({...profile, fullName: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm" htmlFor="username">Username</label>
              <Input 
                id="username"
                value={profile.username}
                onChange={(e) => setProfile({...profile, username: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm" htmlFor="bio">Bio</label>
              <Textarea 
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                className="min-h-20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProfileEditDialog(false)}>Cancel</Button>
            <Button onClick={() => updateProfile(profile)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}