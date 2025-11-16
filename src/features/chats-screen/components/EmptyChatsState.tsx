import { Colors } from '@/src/shared/constants/colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

const EmptyChatsState = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <MaterialIcons name="chat-bubble-outline" size={64} color={Colors.textTertiary} />
      <Text style={styles.emptyText}>{t('chats.noChats')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textTertiary,
    marginTop: 16,
  },
});

export default EmptyChatsState;
