import { useState, useEffect } from 'react';
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
import { 
  Home, 
  Search, 
  Bell, 
  User, 
  Heart, 
  MessageSquare, 
  Share2, 
  Camera, 
  Mail, 
  MoreHorizontal, 
  Bookmark, 
  Send, 
  Settings, 
  Image as ImageIcon,
  Shirt
} from 'lucide-react';
import FashionDashboard from '@/pages/fashion/FashionDashboard';
import FashionForecast from '@/components/fashion/FashionForecast';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SocialMediaApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname.replace('/', '');
    return path || 'home';
  });
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
  
  // Update activeTab when location changes
  useEffect(() => {
    const path = location.pathname.replace('/', '');
    setActiveTab(path || 'home');
  }, [location.pathname]);
  
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

  // Custom Icon Components using Lucide React
  const IconHome = () => <Home className="w-5 h-5 text-foreground" />;
  const IconSearch = () => <Search className="w-5 h-5 text-foreground" />;
  const IconBell = () => <Bell className="w-5 h-5 text-foreground" />;
  const IconUser = () => <User className="w-5 h-5 text-foreground" />;
  const IconHeart = ({ filled }) => (
    <Heart 
      className={`w-5 h-5 ${filled ? "text-red-500 fill-red-500" : "text-foreground"}`} 
    />
  );
  const IconComment = () => <MessageSquare className="w-5 h-5 text-foreground" />;
  const IconShare = () => <Share2 className="w-5 h-5 text-foreground" />;
  const IconCamera = () => <Camera className="w-5 h-5 text-foreground" />;
  const IconMessage = () => <Mail className="w-5 h-5 text-foreground" />;
  const IconMore = () => <MoreHorizontal className="w-5 h-5 text-foreground" />;
  const IconBookmark = ({ filled }) => (
    <Bookmark 
      className={`w-5 h-5 ${filled ? "text-primary fill-primary" : "text-foreground"}`} 
    />
  );
  const IconSend = () => <Send className="w-5 h-5 text-foreground" />;
  const IconSettings = () => <Settings className="w-5 h-5 text-foreground" />;
  const IconGallery = () => <ImageIcon className="w-5 h-5 text-foreground" />;
  const IconShirt = () => <Shirt className="w-5 h-5 text-foreground" />;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/${tab === 'home' ? '' : tab}`);
  };

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

      {/* Top Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 bg-background border-b z-[100]">
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">SocialApp</h1>
            <div className="pl-7">
              <ThemeToggle />
            </div>
          </div>
          <div className="flex items-center space-x-4 pr-12">
            <Button variant="ghost" size="sm" onClick={() => setNewPostDialog(true)} className="flex items-center justify-center w-10 h-10">
              <IconCamera className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleTabChange('notifications')} className="flex items-center justify-center w-10 h-10 relative">
              <IconBell className="w-5 h-5" />
              {notifications.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                >
                  {notifications.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-[72px] pb-20">
        {activeTab === 'home' && (
          <div className="p-6">
            {posts.map(post => (
              <Card key={post.id} className="mb-8 bg-card text-card-foreground">
                <CardHeader className="flex flex-row items-center justify-between p-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.avatar} />
                      <AvatarFallback>{post.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{post.fullName}</p>
                      <p className="text-xs text-muted-foreground">@{post.username}</p>
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
                <CardContent className="p-2">
                  <p className="mb-2 text-foreground text-sm">{post.content}</p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full rounded-lg"
                    />
                  )}
                </CardContent>
                <CardFooter className="flex justify-between p-2">
                  <div className="flex gap-4">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1 ${
                        likedPosts[post.id] ? 'text-blue-500' : 'text-muted-foreground hover:text-blue-500'
                      }`}
                    >
                      <IconHeart filled={likedPosts[post.id]} />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    <button
                      onClick={() => openCommentDialog(post.id)}
                      className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                    >
                      <IconComment />
                      <span className="text-sm">{post.comments}</span>
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
          </div>
        )}

        {activeTab === 'search' && (
          <div className="p-6">
            <div className="mb-3">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">
                  🔍
                </span>
                <Input 
                  type="text" 
                  placeholder="Search" 
                  className="pl-10" 
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
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">Notifications</h2>
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllNotifications}>
                  Clear all
                </Button>
              )}
            </div>
            
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <Bell className="w-12 h-12 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="flex items-center p-4 border-b last:border-0">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src="/api/placeholder/40/40" alt={notification.username || 'User'} />
                    <AvatarFallback>{(notification.username || 'U')[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{notification.username || 'User'}</span>
                      {' '}{notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 ml-2" 
                    onClick={() => clearNotification(notification.id)}
                  >
                    <IconMore />
                  </Button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Your Profile</h2>
              <Button variant="ghost" size="sm" onClick={() => setProfileEditDialog(true)}>
                <IconSettings />
              </Button>
            </div>
            <div className="flex items-center mb-8">
              <Avatar className="h-24 w-24 mr-6">
                <AvatarImage src={profile.avatar} alt="Profile" />
                <AvatarFallback>{profile.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-2xl mb-1">{profile.fullName}</h3>
                <p className="text-muted-foreground mb-2">@{profile.username}</p>
                <p className="text-sm mb-2">{profile.bio}</p>
                <Badge variant="outline" className="mt-1">Pro Member</Badge>
              </div>
            </div>
            
            <div className="flex justify-around mb-8 text-center">
              <div>
                <div className="font-bold text-xl">{profile.posts}</div>
                <div className="text-muted-foreground text-sm">Posts</div>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div>
                <div className="font-bold text-xl">{profile.followers.toLocaleString()}</div>
                <div className="text-muted-foreground text-sm">Followers</div>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div>
                <div className="font-bold text-xl">{profile.following}</div>
                <div className="text-muted-foreground text-sm">Following</div>
              </div>
            </div>
            
            <Tabs defaultValue="posts" className="w-full mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
              </TabsList>
              <TabsContent value="posts" className="mt-4">
                <div className="grid grid-cols-3 gap-2">
                  {posts
                    .filter(post => post.username === profile.username)
                    .map(post => (
                      <div key={post.id} className="aspect-square bg-muted rounded-md overflow-hidden">
                        <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                      </div>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="saved" className="mt-4">
                <div className="grid grid-cols-3 gap-2">
                  {posts
                    .filter(post => bookmarkedPosts[post.id])
                    .map(post => (
                      <div key={post.id} className="aspect-square bg-muted rounded-md overflow-hidden">
                        <img src={post.image} alt="Saved post" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  {Object.keys(bookmarkedPosts).filter(id => bookmarkedPosts[id]).length === 0 && (
                    <div className="col-span-3 text-center py-12">
                      <div className="flex justify-center mb-4">
                        <Bookmark className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">No saved posts yet</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {activeTab === 'fashion' && (
          <div className="pt-4">
            <FashionDashboard />
          </div>
        )}
      </main>

      {/* Bottom Navigation - Fixed */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-50">
        <div className="flex justify-around items-center h-16 px-6 max-w-screen-xl mx-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleTabChange('home')} 
            className={`flex flex-col items-center gap-1 h-auto py-2 ${activeTab === 'home' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <IconHome className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleTabChange('search')} 
            className={`flex flex-col items-center gap-1 h-auto py-2 ${activeTab === 'search' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <IconSearch className="w-5 h-5" />
            <span className="text-xs">Search</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleTabChange('fashion')} 
            className={`flex flex-col items-center gap-1 h-auto py-2 ${activeTab === 'fashion' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <IconShirt className="w-5 h-5" />
            <span className="text-xs">Fashion</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleTabChange('notifications')} 
            className={`flex flex-col items-center gap-1 h-auto py-2 ${activeTab === 'notifications' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <IconBell className="w-5 h-5" />
            <span className="text-xs">Notifications</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}