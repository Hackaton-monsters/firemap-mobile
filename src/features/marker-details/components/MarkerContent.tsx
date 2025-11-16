import type { Marker } from '@/src/api/reports/types';
import { TabbedContent } from '@/src/shared/components/TabbedContent';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { StyleSheet, View } from 'react-native';
import { ChatView } from '../../chat/components';
import { MarkerDetailsContent } from './MarkerDetailsContent';
import { MarkerHeader } from './MarkerHeader';

const TABS = [
  { id: 'chat', label: 'Chat', icon: 'chat-outline' },
  { id: 'details', label: 'Details', icon: 'information-outline' },
];

type IProps = {
  marker: Marker;
  onNavigateToMarkerPress?: (marker: Marker) => void;
};

export const MarkerContent = ({
  marker,
  onNavigateToMarkerPress,
}: IProps) => {
  return (
    <View style={[{ flex: 1 }]}>
      <MarkerHeader marker={marker} onNavigateToMarkerPress={onNavigateToMarkerPress} />

      <TabbedContent
        tabs={TABS}
        initialTab="chat"
        renderContent={(activeTab) => {
          if (activeTab === 'chat') {
            return (
              <ChatView
                chatId={marker.chatId}
                isJoined={marker.isMember}
              />
            );
          }
          return (
            <BottomSheetScrollView style={styles.details} showsVerticalScrollIndicator={false}>
              <MarkerDetailsContent marker={marker} />
            </BottomSheetScrollView>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  details: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
});
