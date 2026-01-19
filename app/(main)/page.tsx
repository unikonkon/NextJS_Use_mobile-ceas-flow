'use client';

import { useTabNavigation } from '@/hooks/useTabNavigation';
import { HomeTab, AnalyticsTab, WalletsTab, MoreTab } from '@/components/tabs';
import { BottomNav } from '@/components/navigation';

export default function MainPage() {
  const { activeTab, setActiveTab } = useTabNavigation('home');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'wallets':
        return <WalletsTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'more':
        return <MoreTab />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <>
      {renderTabContent()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  );
}
