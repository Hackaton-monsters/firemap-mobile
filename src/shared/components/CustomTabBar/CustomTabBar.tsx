import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

type TabIconProps = {
  name: string;
  color: string;
  size: number;
};

const TabIcon = ({ name, color, size }: TabIconProps) => {
  const iconMap: Record<string, any> = {
    map: 'map-outline',
    chats: 'chat-outline',
    settings: 'cog-outline',
  };
  
  return <MaterialCommunityIcons name={iconMap[name] || 'circle'} size={size} color={color} />;
};

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const animatedValues = useRef(
    state.routes.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    animatedValues.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: state.index === index ? 1 : 0,
        useNativeDriver: false,
        damping: 20,
        stiffness: 300,
      }).start();
    });
  }, [state.index]);

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
          height: 68 + (insets.bottom > 0 ? insets.bottom : 12),
        },
      ]}
    >
      {/* Shadow overlay */}
      <View style={styles.shadowOverlay} />

      <View style={styles.tabsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;
          const animatedValue = animatedValues[index];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Animated styles
          const iconScale = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.15],
          });

          const indicatorWidth = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 40],
          });

          const backgroundScale = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.85, 1],
          });

          const iconName = route.name === 'map' ? 'map' : route.name === 'chats' ? 'chats' : 'settings';

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
            >
              <Animated.View
                style={[
                  styles.tabBackground,
                  {
                    transform: [{ scale: backgroundScale }],
                    opacity: animatedValue,
                  },
                ]}
              />

              <Animated.View
                style={[
                  styles.iconContainer,
                  {
                    transform: [{ scale: iconScale }],
                  },
                ]}
              >
                <TabIcon
                  name={iconName}
                  color={isFocused ? Colors.primary : Colors.textSecondary}
                  size={24}
                />
              </Animated.View>

              {/* Active indicator */}
              <Animated.View
                style={[
                  styles.activeIndicator,
                  {
                    width: indicatorWidth,
                    opacity: animatedValue,
                  },
                ]}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    backgroundColor: 'white',
  },
  shadowOverlay: {
    ...StyleSheet.absoluteFillObject,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  tabBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary + '15',
    borderRadius: 16,
    marginHorizontal: 8,
  },
  iconContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.3,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
});
