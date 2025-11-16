import { Colors } from '@/src/shared/constants/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type IProps = {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  showBackButton?: boolean;
};

export const SheetHeader = ({ title, subtitle, onClose, showBackButton = false }: IProps) => {
  const router = useRouter();

  const handlePress = () => {
    if (onClose) {
      onClose();
    } else if (showBackButton) {
      router.back();
    }
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {showBackButton && (
            <Pressable style={styles.backButton} onPress={handlePress}>
              <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
            </Pressable>
          )}
          <Text style={[styles.title, showBackButton && styles.titleWithBack]}>{title}</Text>
          {!showBackButton && onClose && (
            <Pressable style={styles.closeButton} onPress={handlePress}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </Pressable>
          )}
        </View>
        {subtitle && (
          <View style={[styles.metaRow, showBackButton && styles.metaRowWithBack]}>
            <Text style={styles.metaText}>{subtitle}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  header: {
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  titleWithBack: {
    marginLeft: 12,
  },
  backButton: {
    padding: 4,
    marginRight: -4,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
  metaRow: {
    paddingHorizontal: 16,
    marginTop: 4,
  },
  metaRowWithBack: {
    paddingHorizontal: 16,
    marginLeft: 44,
  },
  metaText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
