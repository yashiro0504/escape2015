"use client";

import React from 'react';
import StoreHydrator from './StoreHydrator';
import AchievementNotification from './AchievementNotification';
import SystemAlertNotification from './SystemAlertNotification';

export default function PhoneWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black flex flex-col overflow-hidden">
      <div 
        className="w-full h-full overflow-y-auto overflow-x-hidden relative overscroll-contain flex flex-col"
        style={{ 
          background: 'linear-gradient(135deg, #0c0c1d 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%)',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div className="w-full flex-1 flex flex-col min-h-0">
          {children}
        </div>
        <StoreHydrator />
        <AchievementNotification />
        <SystemAlertNotification />
      </div>
    </div>
  );
}
