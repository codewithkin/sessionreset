import { Platform, Pressable, PressableProps } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { springs } from "@/lib/tokens";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps extends PressableProps {
  scale?: number;
  haptic?: boolean;
  children: React.ReactNode;
}

export function PressableScale({
  scale = 0.96,
  haptic = true,
  children,
  style,
  onPressIn,
  onPressOut,
  ...props
}: PressableScaleProps) {
  const animatedScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(animatedScale.value, springs.press) }],
  }));

  const handlePressIn = (e: any) => {
    animatedScale.value = scale;
    if (haptic && Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    animatedScale.value = 1;
    onPressOut?.(e);
  };

  return (
    <AnimatedPressable
      style={[style, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}
