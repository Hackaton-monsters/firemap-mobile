import type { Marker } from '@/src/api/reports/types';
import { AnimatedTabs } from '@/src/shared/components/AnimatedTabs/AnimatedTabs';
import { useBottomTabBarHeight } from '@/src/shared/hooks/useBottomTabBarHeight';
import { StyledBottomSheet } from '@/src/shared/uikit/BottomSheet/StyledBottomSheet';
import type BottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { useEffect, useMemo, useRef, useState } from 'react';
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
  marker: Marker | null;
  currentUserId?: string;
  isJoined?: boolean;
};

export const MarkerBottomSheet = ({
  marker,
  currentUserId,
  isJoined = false,
}: IProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [joined, setJoined] = useState(isJoined);
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const snapPoints = useMemo(() => ['90%'], []);
  const tabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    if (marker) {
      bottomSheetRef.current?.expand();
      setActiveTab('chat');
    } else {
      bottomSheetRef.current?.close();
    }
  }, [marker]);

  const handleJoinSuccess = () => {
    setJoined(true);
  };

  if (!marker) return null;

  return (
    <StyledBottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
    >
      <BottomSheetView style={[styles.contentContainer, { paddingBottom: tabBarHeight }]}>
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
              isJoined={joined}
              onJoinSuccess={handleJoinSuccess}
            />
          ) : (
            <MarkerDetailsContent marker={marker} />
          )}
        </View>
      </BottomSheetView>
    </StyledBottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    height: '100%',
  },
  content: {
    flex: 1,
  },
});
