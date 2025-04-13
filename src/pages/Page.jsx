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
import { db } from "@/configs/firebase";
import {  collection, query, where, getDocs } from 'firebase/firestore';
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
import { toast } from 'sonner';

export default function SocialMediaApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname.replace('/', '');
    return path || 'home';
  });
  const [likedPosts, setLikedPosts] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const snapshot = await getDocs(collection(db, 'post'))
        // Transform each Firestore document into your "post" shape
        const fetchedPosts = snapshot.docs.map((doc, idx) => {
          const data = doc.data()
          return {
            // Use doc.id or some unique key for `id`
            id: doc.id,
            
            // You don't have username in Firestore, so fill with a placeholder
            username: `user_${idx + 1}`,
            
            // fullName is also missing, so just insert random or static
            fullName: `Full Name ${idx + 1}`,
            
            // For avatar, pick a static or random placeholder
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
            
            // Firestore "description" → old "content"
            content: data.description || 'No description',
            
            // Firestore "imageUrls" → old "image"
            // If multiple URLs, pick first, or default if none
            image: data.imageUrls?.[0] || 'https://placehold.co/800x500',
            
            // Firestore doesn't have "likes"/"comments", so set placeholders
            likes: 42,
            comments: 7,

            // Firestore has "createdAt" → old "time" 
            // You might do something like "2h", or parse the date
            time: data.createdAt
              ? 'Just now' // or parse how long ago
              : 'Just now'
          }
        })
        
        setPosts(fetchedPosts)
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }

    fetchData()
  }, [])
  /* const [posts, setPosts] = useState([
    {
      id: 1,
      username: 'sarah_designs',
      fullName: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      content: 'Just finished my latest UI design project! So excited to share it with everyone soon.',
      image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=500&fit=crop',
      likes: 124,
      comments: 18,
      time: '2h'
    },
    {
      id: 2,
      username: 'tech_dave',
      fullName: 'Dave Williams',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      content: 'Attended an amazing workshop on React performance optimizations today. Here are some highlights from the event!',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop',
      likes: 89,
      comments: 12,
      time: '4h'
    },
    {
      id: 3,
      username: 'travel_with_emma',
      fullName: 'Emma Chen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      content: 'Sunrise hike in the mountains this morning. Worth waking up at 5am!',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=500&fit=crop',
      likes: 243,
      comments: 36,
      time: '6h'
    }
  ]); */
  
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
  const [searchResults, setSearchResults] = useState([
    { id: 1, image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=300&fit=crop', category: 'business' },
    { id: 2, image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=300&fit=crop', category: 'technology' },
    { id: 3, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=300&fit=crop', category: 'nature' },
    { id: 4, image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=300&fit=crop', category: 'design' },
    { id: 5, image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=300&h=300&fit=crop', category: 'pets' },
    { id: 6, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop', category: 'people' },
    { id: 7, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop', category: 'portrait' },
    { id: 8, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop', category: 'portrait' },
    { id: 9, image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop', category: 'profile' },
    { id: 10, image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=300&fit=crop', category: 'business' },
    { id: 11, image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=300&fit=crop', category: 'technology' },
    { id: 12, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=300&fit=crop', category: 'nature' }
  ]);
  
  // Notification state
  const [notifications, setNotifications] = useState([]);
  
  // Profile state
  const [profile, setProfile] = useState({
    username: 'your_username',
    fullName: 'Your Name',
    bio: 'Digital creator and photography enthusiast',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    posts: 248,
    followers: 12400,
    following: 142,
    images: [
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=300&fit=crop'
    ]
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
    // Add to notifications list (keeping this for the notifications tab)
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setNotifications(prev => [notification, ...prev]);
    
    // Show toast notification instead of alert
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast.warning(message);
        break;
      default:
        toast.info(message);
        break;
    }
  };
  
  const showAlert = (message, type = 'info') => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast.warning(message);
        break;
      default:
        toast.info(message);
        break;
    }
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
      image: imagePreview || null,
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
    
    // Simulate search results with different images based on query
    if (e.target.value.trim() !== '') {
      const query = e.target.value.toLowerCase();
      const filteredResults = [
        { id: 1, image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=300&fit=crop', category: 'business' },
        { id: 2, image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=300&fit=crop', category: 'technology' },
        { id: 3, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=300&fit=crop', category: 'nature' },
        { id: 4, image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=300&fit=crop', category: 'design' },
        { id: 5, image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=300&h=300&fit=crop', category: 'pets' },
        { id: 6, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop', category: 'people' },
        { id: 7, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop', category: 'portrait' },
        { id: 8, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop', category: 'portrait' },
        { id: 9, image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop', category: 'profile' },
        { id: 10, image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=300&fit=crop', category: 'business' },
        { id: 11, image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=300&fit=crop', category: 'technology' },
        { id: 12, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=300&fit=crop', category: 'nature' }
      ].filter(result => result.category.includes(query));
      
      setSearchResults(filteredResults.length > 0 ? filteredResults : [
        { id: 1, image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=300&fit=crop', category: 'business' },
        { id: 2, image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=300&fit=crop', category: 'technology' },
        { id: 3, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=300&fit=crop', category: 'nature' },
        { id: 4, image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=300&fit=crop', category: 'design' },
        { id: 5, image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=300&h=300&fit=crop', category: 'pets' },
        { id: 6, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop', category: 'people' },
        { id: 7, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop', category: 'portrait' },
        { id: 8, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop', category: 'portrait' },
        { id: 9, image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop', category: 'profile' },
        { id: 10, image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=300&fit=crop', category: 'business' },
        { id: 11, image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=300&fit=crop', category: 'technology' },
        { id: 12, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=300&fit=crop', category: 'nature' }
      ]);
    } else {
      setSearchResults([
        { id: 1, image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=300&fit=crop', category: 'business' },
        { id: 2, image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=300&fit=crop', category: 'technology' },
        { id: 3, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=300&fit=crop', category: 'nature' },
        { id: 4, image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=300&fit=crop', category: 'design' },
        { id: 5, image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=300&h=300&fit=crop', category: 'pets' },
        { id: 6, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop', category: 'people' },
        { id: 7, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop', category: 'portrait' },
        { id: 8, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop', category: 'portrait' },
        { id: 9, image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop', category: 'profile' },
        { id: 10, image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=300&fit=crop', category: 'business' },
        { id: 11, image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=300&fit=crop', category: 'technology' },
        { id: 12, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=300&fit=crop', category: 'nature' }
      ]);
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
  const IconComment = () => <MessageSquare className="w-5 h-5 text-primary" />;
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
                      <AvatarImage src={post.avatar} alt={post.username} />
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
                    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                      <img
                        src={post.image}
                        alt="Post"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
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
                      className="flex items-center gap-1 text-foreground hover:text-primary"
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
                <div key={item.id} className="aspect-square rounded-md overflow-hidden">
                  <img 
                    src={item.image} 
                    alt="Search result" 
                    className="w-full h-full object-cover" 
                  />
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
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleTabChange('profile')} 
            className={`flex flex-col items-center gap-1 h-auto py-2 ${activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <IconUser className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </nav>

      {/* Profile Edit Dialog */}
      {profileEditDialog && (
        <Dialog open={profileEditDialog} onOpenChange={setProfileEditDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile.avatar} alt="Profile" />
                  <AvatarFallback>{profile.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <IconGallery className="mr-2 h-4 w-4" />
                    Change Picture
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="fullName" className="text-right text-sm font-medium">
                  Name
                </label>
                <Input
                  id="fullName"
                  defaultValue={profile.fullName}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="username" className="text-right text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  defaultValue={profile.username}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="bio" className="text-right text-sm font-medium">
                  Bio
                </label>
                <Textarea
                  id="bio"
                  defaultValue={profile.bio}
                  className="col-span-3"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setProfileEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => updateProfile({
                fullName: document.getElementById('fullName').value,
                username: document.getElementById('username').value,
                bio: document.getElementById('bio').value
              })}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* New Post Dialog */}
      <Dialog open={newPostDialog} onOpenChange={setNewPostDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea 
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="min-h-[100px]"
            />
            
            <div className="flex justify-between items-center">
              <label className="cursor-pointer">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageSelect} 
                  className="hidden" 
                />
                <div className="flex items-center gap-2 text-primary hover:text-primary/80">
                  <IconGallery className="h-5 w-5" />
                  <span>Add Photo</span>
                </div>
              </label>
              
              {selectedImage && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                  className="text-destructive hover:text-destructive/80"
                >
                  Remove Photo
                </Button>
              )}
            </div>
            
            {imagePreview && (
              <div className="relative mt-2 rounded-lg overflow-hidden">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-auto max-h-[300px] object-contain bg-muted"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setNewPostContent('');
              setSelectedImage(null);
              setImagePreview(null);
              setNewPostDialog(false);
            }}>
              Cancel
            </Button>
            <Button onClick={createNewPost} disabled={newPostContent.trim() === '' && !selectedImage}>
              Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comment Dialog */}
      <Dialog open={commentDialog} onOpenChange={setCommentDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto">
            {currentPostId && comments[currentPostId] && comments[currentPostId].length > 0 ? (
              <div className="space-y-4 mb-4">
                {comments[currentPostId].map(comment => (
                  <div key={comment.id} className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{comment.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <p className="font-semibold text-sm">@{comment.username}</p>
                        <span className="text-xs text-muted-foreground">{comment.time}</span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-muted-foreground text-sm">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 pt-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback>{profile.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex items-center gap-2">
              <Input 
                placeholder="Add a comment..." 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    addComment();
                  }
                }}
              />
              <Button 
                size="sm" 
                onClick={addComment} 
                disabled={newComment.trim() === ''}
              >
                <IconSend />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}