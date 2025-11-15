import type { Marker } from '@/src/api/reports/types';
import { AnimatedTabs } from '@/src/shared/components/AnimatedTabs/AnimatedTabs';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ChatView } from './ChatView';
import { MarkerDetailsContent } from './MarkerDetailsContent';
import { MarkerHeader } from './MarkerHeader';

type TabType = 'chat' | 'details';

const TABS = [
  { id: 'chat' as const, label: 'Chat', icon: 'chat-outline' },
  { id: 'details' as const, label: 'Details', icon: 'information-outline' },
];

type IProps = {
  marker: Marker;
  currentUserId?: string;
  isJoined?: boolean;
  onJoinSuccess: () => void;
};

export const MarkerContent = ({
  marker,
  currentUserId,
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
            currentUserId={currentUserId}
            isJoined={isJoined}
            onJoinSuccess={onJoinSuccess}
          />
        ) : (
          <MarkerDetailsContent marker={marker} />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
