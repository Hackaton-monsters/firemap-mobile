import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CustomTabBar } from '../../shared/components/CustomTabBar/CustomTabBar';

export default function MainLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: t('tabs.map'),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: t('tabs.chats'),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
        }}
      />
    </Tabs>
  );
}
