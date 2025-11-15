import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../shared/constants/colors';

type IProps = {
  date: Date;
};

const DateDivider = ({ date }: IProps) => {
  const { t } = useTranslation();
  const label = getDateLabel(date, t);

  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
};

const getDateLabel = (date: Date, t: any): string => {
  const now = new Date();
  const messageDate = new Date(date);
  
  // Reset time to compare only dates
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const msgDate = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
  
  // Check if today
  if (msgDate.getTime() === today.getTime()) {
    return t('chats.dateDividers.today');
  }
  
  // Check if yesterday
  if (msgDate.getTime() === yesterday.getTime()) {
    return t('chats.dateDividers.yesterday');
  }
  
  // Check if within last 7 days - show day of week
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  if (msgDate > weekAgo) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return t(`chats.dateDividers.days.${days[messageDate.getDay()]}`);
  }
  
  // Check if same year - show date with month
  if (messageDate.getFullYear() === now.getFullYear()) {
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    return `${t(`chats.dateDividers.months.${months[messageDate.getMonth()]}`)} ${messageDate.getDate()}`;
  }
  
  // Different year - show full date
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  return `${t(`chats.dateDividers.months.${months[messageDate.getMonth()]}`)} ${messageDate.getDate()}, ${messageDate.getFullYear()}`;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  text: {
    marginHorizontal: 12,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default DateDivider;
