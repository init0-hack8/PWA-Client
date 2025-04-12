import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FashionForecast } from './FashionForecast';
import { TryOnMoodFilter } from './TryOnMoodFilter';
import { BrandMoodboard } from './BrandMoodboard';
import { CollaborativeCloset } from './CollaborativeCloset';
import { Button } from '@/components/ui/button';
import { Home, Search, Bell, User, Shirt } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Fashion() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('forecast');

  // Update activeTab when location changes
  useEffect(() => {
    const path = location.pathname.replace('/', '');
    if (path === 'fashion') {
      setActiveTab('forecast');
    }
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/${tab === 'home' ? '' : tab}`);
  };

  return (
    <div className="min-h-screen bg-background overflow-y-auto">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Fashion Hub</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4 sticky top-0 z-10 bg-background">
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
            <TabsTrigger value="tryon">Try On</TabsTrigger>
            <TabsTrigger value="moodboard">Moodboard</TabsTrigger>
            <TabsTrigger value="closet">Closet</TabsTrigger>
          </TabsList>
          <div className="bg-background pb-24">
            <TabsContent value="forecast" className="mt-0">
              <div className="bg-background">
                <FashionForecast />
              </div>
            </TabsContent>
            <TabsContent value="tryon" className="mt-0">
              <div className="bg-background">
                <TryOnMoodFilter />
              </div>
            </TabsContent>
            <TabsContent value="moodboard" className="mt-0">
              <div className="bg-background">
                <BrandMoodboard />
              </div>
            </TabsContent>
            <TabsContent value="closet" className="mt-0">
              <div className="bg-background">
                <CollaborativeCloset />
              </div>
            </TabsContent>
          </div>
    <div className="fixed inset-0 bg-background overflow-y-auto">
      <div className="relative min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Fashion Hub</h1>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4 sticky top-0 z-10 bg-background">
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
              <TabsTrigger value="tryon">Try On</TabsTrigger>
              <TabsTrigger value="moodboard">Moodboard</TabsTrigger>
              <TabsTrigger value="closet">Closet</TabsTrigger>
            </TabsList>
            <div className="bg-background pb-24">
              <TabsContent value="forecast" className="mt-0">
                <div className="bg-background">
                  <FashionForecast />
                </div>
              </TabsContent>
              <TabsContent value="tryon" className="mt-0">
                <div className="bg-background">
                  <TryOnMoodFilter />
                </div>
              </TabsContent>
              <TabsContent value="moodboard" className="mt-0">
                <div className="bg-background">
                  <BrandMoodboard />
                </div>
              </TabsContent>
              <TabsContent value="closet" className="mt-0">
                <div className="bg-background">
                  <CollaborativeCloset />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 shadow-lg z-[100]">
        <div className="flex justify-around items-center h-16 px-6 max-w-screen-xl mx-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleTabChange('home')}
            className="flex flex-col items-center gap-1 h-auto py-2 text-muted-foreground"
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleTabChange('search')}
            className="flex flex-col items-center gap-1 h-auto py-2 text-muted-foreground"
          >
            <Search className="w-5 h-5" />
            <span className="text-xs">Search</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center gap-1 h-auto py-2 text-primary"
          >
            <Shirt className="w-5 h-5" />
            <span className="text-xs">Fashion</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleTabChange('notifications')}
            className="flex flex-col items-center gap-1 h-auto py-2 text-muted-foreground"
          >
            <Bell className="w-5 h-5" />
            <span className="text-xs">Alerts</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleTabChange('profile')}
            className="flex flex-col items-center gap-1 h-auto py-2 text-muted-foreground"
          >
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
} 