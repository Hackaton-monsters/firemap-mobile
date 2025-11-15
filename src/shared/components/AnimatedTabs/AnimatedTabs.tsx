import { Colors } from '@/src/shared/constants/colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

type Tab = {
  id: string;
  label: string;
  icon: string;
};

type IProps = {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
};

export const AnimatedTabs = ({ tabs, activeTab, onTabChange }: IProps) => {
  const animValues = useRef(
    tabs.reduce((acc, tab) => {
      acc[tab.id] = new Animated.Value(tab.id === activeTab ? 1 : 0);
      return acc;
    }, {} as Record<string, Animated.Value>)
  ).current;

  useEffect(() => {
    tabs.forEach((tab) => {
      Animated.spring(animValues[tab.id], {
        toValue: activeTab === tab.id ? 1 : 0,
        useNativeDriver: false,
        damping: 20,
        stiffness: 300,
      }).start();
    });
  }, [activeTab]);

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const animValue = animValues[tab.id];

        const iconScale = animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1],
        });

        const indicatorWidth = animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 50],
        });

        const backgroundScale = animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.9, 1],
        });

        return (
          <Pressable
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabChange(tab.id)}
          >
            <Animated.View
              style={[
                styles.tabBackground,
                {
                  transform: [{ scale: backgroundScale }],
                  opacity: animValue,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.tabContent,
                {
                  transform: [{ scale: iconScale }],
                },
              ]}
            >
              <MaterialCommunityIcons
                name={tab.icon as any}
                size={20}
                color={isActive ? Colors.primary : Colors.textSecondary}
              />
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab.label}
              </Text>
            </Animated.View>
            <Animated.View
              style={[
                styles.activeIndicator,
                {
                  width: indicatorWidth,
                  opacity: animValue,
                },
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  tab: {
    flex: 1,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary + '15',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
});
