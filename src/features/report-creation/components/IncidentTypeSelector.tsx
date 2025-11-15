import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../shared/constants/colors';

type IncidentType = 'fire' | 'rescue';

type IProps = {
  selectedType: IncidentType;
  onTypeChange: (type: IncidentType) => void;
  fireLabel: string;
  rescueLabel: string;
  disabled?: boolean;
};

export const IncidentTypeSelector = ({
  selectedType,
  onTypeChange,
  fireLabel,
  rescueLabel,
  disabled = false,
}: IProps) => {
  return (
    <View style={styles.typeButtons}>
      <Pressable
        style={[
          styles.typeButton,
          selectedType === 'fire' && styles.typeButtonActive,
        ]}
        onPress={() => onTypeChange('fire')}
        disabled={disabled}
      >
        <Text
          style={[
            styles.typeButtonText,
            selectedType === 'fire' && styles.typeButtonTextActive,
          ]}
        >
          {fireLabel}
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.typeButton,
          selectedType === 'rescue' && styles.typeButtonActive,
        ]}
        onPress={() => onTypeChange('rescue')}
        disabled={disabled}
      >
        <Text
          style={[
            styles.typeButtonText,
            selectedType === 'rescue' && styles.typeButtonTextActive,
          ]}
        >
          {rescueLabel}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  typeButtonTextActive: {
    color: Colors.primary,
  },
});
