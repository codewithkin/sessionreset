import { Pressable, PressableProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps extends PressableProps {
  scale?: number;
  children: React.ReactNode;
}

export function PressableScale({
  scale = 0.96,
  children,
  style,
  ...props
}: PressableScaleProps) {
  const animatedScale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(animatedScale.value, { damping: 0.8 }) }],
  }));

  return (
    <AnimatedPressable
      style={[style, animatedStyle]}
      onPressIn={() => {
        animatedScale.value = scale;
      }}
      onPressOut={() => {
        animatedScale.value = 1;
      }}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}
