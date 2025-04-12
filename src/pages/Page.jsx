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
  const [notifications, setNotifications] = useState([
    { id: 1, username: 'mike_dev', type: 'like', content: 'liked your post', time: '1h' },
    { id: 2, username: 'design_lover', type: 'comment', content: 'commented on your photo', time: '2h' },
    { id: 3, username: 'travel_fan', type: 'follow', content: 'started following you', time: '3h' },
    { id: 4, username: 'photo_master', type: 'like', content: 'liked your comment', time: '4h' },
    { id: 5, username: 'web_designer', type: 'follow', content: 'started following you', time: '5h' }
  ]);
  
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
  
  // Functions
  const toggleLike = (postId) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
    
    // Add a notification if it's a new like
    if (!likedPosts[postId]) {
      const notification = {
        id: Date.now(),
        username: 'your_username',
        type: 'like',
        content: 'liked a post',
        time: 'Just now'
      };
      // In a real app, this would be sent to the post owner
    }
  };
  
  const toggleBookmark = (postId) => {
    setBookmarkedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
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
      const notification = {
        id: Date.now(),
        username: 'your_username',
        type: 'follow',
        content: 'started following you',
        time: 'Just now'
      };
      // In a real app, this would be sent to the user being followed
    }
  };
  
  const openCommentDialog = (postId) => {
    setCurrentPostId(postId);
    setCommentDialog(true);
  };
  
  const addComment = () => {
    if (newComment.trim() === '') return;
    
    const comment = {
      id: Date.now(),
      username: 'your_username',
      content: newComment,
      time: 'Just now'
    };
    
    setComments(prev => ({
      ...prev,
      [currentPostId]: [...(prev[currentPostId] || []), comment]
    }));
    
    // Update comment count in post
    setPosts(prev => 
      prev.map(post => 
        post.id === currentPostId 
          ? { ...post, comments: post.comments + 1 } 
          : post
      )
    );
    
    setNewComment('');
    setCommentDialog(false);
    
    // Add notification when commenting
    const notification = {
      id: Date.now(),
      username: 'your_username',
      type: 'comment',
      content: 'commented on your post',
      time: 'Just now'
    };
    // In a real app, this would be sent to the post owner
  };
  
  const createNewPost = () => {
    if (newPostContent.trim() === '') return;
    
    const newPost = {
      id: Date.now(),
      username: profile.username,
      fullName: profile.fullName,
      avatar: profile.avatar,
      content: newPostContent,
      image: '/api/placeholder/400/250',
      likes: 0,
      comments: 0,
      time: 'Just now'
    };
    
    setPosts(prev => [newPost, ...prev]);
    setNewPostContent('');
    setNewPostDialog(false);
    
    // Update post count in profile
    setProfile(prev => ({
      ...prev,
      posts: prev.posts + 1
    }));
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
  };
  
  const sharePost = (postId) => {
    // Simulate share functionality
    alert(`Post ${postId} shared!`);
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
    <div className="max-w-md mx-auto bg-gray-50 h-screen overflow-y-auto">
      {/* Top Header */}
      <div className="bg-background p-4 flex justify-between items-center sticky top-0 z-10 border-b">
        <h1 className="text-2xl font-bold text-primary">SocialApp</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setNewPostDialog(true)}>
            <IconCamera />
          </Button>
          <Button variant="ghost" size="sm">
            <IconMessage />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="home" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="home" className="pb-20 p-3 mt-0">
          {posts.map(post => (
            <Card key={post.id} className="mb-4">
              <CardHeader className="p-4 pb-2 pt-3">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={post.avatar} alt={post.username} />
                    <AvatarFallback>{post.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{post.fullName}</div>
                    <div className="text-xs text-muted-foreground">@{post.username} • {post.time} ago</div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8">
                        <IconMore />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toggleFollow(post.username)}>
                        {following[post.username] ? 'Unfollow' : 'Follow'} @{post.username}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleBookmark(post.id)}>
                        {bookmarkedPosts[post.id] ? 'Remove from' : 'Save to'} bookmarks
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Copy link
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500">
                        Report post
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-1 pb-2">
                <p className="mb-3">{post.content}</p>
                <img 
                  src={post.image} 
                  alt="Post content" 
                  className="rounded-md w-full mb-2" 
                />
              </CardContent>
              <CardFooter className="p-0">
                <div className="flex justify-between items-center w-full px-4 py-2">
                  <div className="flex gap-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1 px-2" 
                      onClick={() => toggleLike(post.id)}
                    >
                      <IconHeart filled={likedPosts[post.id]} />
                      <span>{likedPosts[post.id] ? post.likes + 1 : post.likes}</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1 px-2"
                      onClick={() => openCommentDialog(post.id)}
                    >
                      <IconComment />
                      <span>{comments[post.id]?.length || post.comments}</span>
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="px-2"
                      onClick={() => sharePost(post.id)}
                    >
                      <IconShare />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="px-2"
                      onClick={() => toggleBookmark(post.id)}
                    >
                      <IconBookmark filled={bookmarkedPosts[post.id]} />
                    </Button>
                  </div>
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
                  <AvatarImage src="/api/placeholder/40/40" alt={notification.username} />
                  <AvatarFallback>{notification.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{notification.username}</span>
                    {' '}{notification.content}
                  </p>
                  <p className="text-xs text-muted-foreground">{notification.time} ago</p>
                </div>
                {notification.type === 'follow' && (
                  <Button 
                    size="sm" 
                    variant={following[notification.username] ? "outline" : "secondary"}
                    onClick={() => toggleFollow(notification.username)}
                  >
                    {following[notification.username] ? 'Following' : 'Follow'}
                  </Button>
                )}
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
                {profile.images.map((image) => (
                  <div key={image.id} className="aspect-square bg-muted rounded-md overflow-hidden">
                    <img src={image.src} alt="Post" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="saved" className="mt-2">
              <div className="grid grid-cols-3 gap-1">
                {Object.keys(bookmarkedPosts)
                  .filter(id => bookmarkedPosts[id])
                  .map((id) => {
                    const post = posts.find(p => p.id === parseInt(id));
                    return post ? (
                      <div key={id} className="aspect-square bg-muted rounded-md overflow-hidden">
                        <img src={post.image} alt="Saved post" className="w-full h-full object-cover" />
                      </div>
                    ) : null;
                  })}
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
              className="flex flex-col items-center data-[state=active]:bg-transparent py-1 px-0"
            >
              <IconHome />
              <span className="text-xs mt-1">Home</span>
            </TabsTrigger>
            <TabsTrigger 
              value="search" 
              className="flex flex-col items-center data-[state=active]:bg-transparent py-1 px-0"
            >
              <IconSearch />
              <span className="text-xs mt-1">Search</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="flex flex-col items-center data-[state=active]:bg-transparent py-1 px-0"
            >
              <IconBell />
              <span className="text-xs mt-1">Alerts</span>
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="flex flex-col items-center data-[state=active]:bg-transparent py-1 px-0"
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
            <Button size="sm" disabled={!newComment.trim()} onClick={addComment}>
              <IconSend />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* New Post Dialog */}
      <Dialog open={newPostDialog} onOpenChange={setNewPostDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create new post</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile.avatar} alt={profile.username} />
                  <AvatarFallback>{profile.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium">{profile.username}</div>
              </div>
              <Textarea 
                placeholder="What's on your mind?" 
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-20"
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" className="flex gap-2 items-center">
                <IconGallery />
                <span>Add Photo</span>
              </Button>
              <Button onClick={createNewPost} disabled={!newPostContent.trim()}>
                Post
              </Button>
            </div>
          </div>
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