'use client';

import { useState, useCallback, useMemo } from 'react';

export type TabType = 'home' | 'wallets' | 'analytics' | 'more';

interface UseTabNavigationReturn {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isActive: (tab: TabType) => boolean;
}

export function useTabNavigation(initialTab: TabType = 'home'): UseTabNavigationReturn {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  const isActive = useCallback((tab: TabType) => activeTab === tab, [activeTab]);

  return useMemo(() => ({
    activeTab,
    setActiveTab,
    isActive,
  }), [activeTab, isActive]);
}
