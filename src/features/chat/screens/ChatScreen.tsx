import { Marker } from '@/src/api/reports/types';
import { ChatView } from '@/src/features/chat/components';
import { MarkerDetailsContent } from '@/src/features/marker-details/components/MarkerDetailsContent';
import { MarkerHeader } from '@/src/features/marker-details/components/MarkerHeader';
import { TabbedContent } from '@/src/shared/components/TabbedContent';
import { Colors } from '@/src/shared/constants/colors';
import { deserializeMarkerFromParams } from '@/src/shared/helpers/router-params-serializer';
import { useMapNavigationStore } from '@/src/shared/stores/map-navigation.store';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { KeyboardAvoidingView, KeyboardProvider } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TABS = [
  { id: 'chat', label: 'Chat', icon: 'chat-outline' },
  { id: 'details', label: 'Details', icon: 'information-outline' },
];

export function ChatDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setPendingMarker = useMapNavigationStore((state) => state.setPendingMarker);

  const marker = deserializeMarkerFromParams(params as Record<string, string>);
  const chatId = marker.chatId;

  const handleNavigateToMarkerPress = (marker: Marker) => {
    setPendingMarker(marker);
    router.push('/(main)/map');
  };

  return (
    <KeyboardProvider>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={router.back}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </Pressable>
          <MarkerHeader marker={marker} onNavigateToMarkerPress={handleNavigateToMarkerPress} />
        </View>

        <TabbedContent
          tabs={TABS}
          initialTab="chat"
          renderContent={(activeTab) => {
            if (activeTab === 'chat') {
              return (
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior="padding"
                  keyboardVerticalOffset={0}
                >
                  <ChatView
                    chatId={chatId}
                    isJoined={true}
                  />
                </KeyboardAvoidingView>
              );
            }
            return (
              <ScrollView style={styles.details} showsVerticalScrollIndicator={false}>
                <MarkerDetailsContent marker={marker} />
              </ScrollView>
            );
          }}
        />
      </View>
    </KeyboardProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  details: {
    flex: 1,
    marginTop: 16,
    marginHorizontal: 16,
  },
  backButton: {
    padding: 4,
    marginRight: -4,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
