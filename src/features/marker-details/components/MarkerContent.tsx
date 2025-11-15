import type { Marker } from '@/src/api/reports/types';
import { AnimatedTabs } from '@/src/shared/components/AnimatedTabs/AnimatedTabs';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ChatView } from '../../chat/components';
import { MarkerDetailsContent } from './MarkerDetailsContent';
import { MarkerHeader } from './MarkerHeader';

type TabType = 'chat' | 'details';

const TABS = [
  { id: 'chat' as const, label: 'Chat', icon: 'chat-outline' },
  { id: 'details' as const, label: 'Details', icon: 'information-outline' },
];

type IProps = {
  marker: Marker;
  isJoined?: boolean;
  onJoinSuccess: () => void;
};

export const MarkerContent = ({
  marker,
  isJoined = false,
  onJoinSuccess,
}: IProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('chat');

  return (
    <>
      <MarkerHeader marker={marker} />

      <AnimatedTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as TabType)}
      />

      <View style={styles.content}>
        {activeTab === 'chat' ? (
          <ChatView
            chatId={marker.chatId}
            isJoined={isJoined}
            onJoinSuccess={onJoinSuccess}
          />
        ) : (
          <MarkerDetailsContent marker={marker} style={styles.details} />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  details: {
    marginTop: 16,
  }
});
