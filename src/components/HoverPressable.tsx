import { useState } from 'react';
import { Pressable, type PressableProps, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle> | ((state: PressableStateCallbackType & { hovered: boolean }) => StyleProp<ViewStyle>);
};

export function HoverPressable({ style, onHoverIn, onHoverOut, ...props }: Props) {
  const [hovered, setHovered] = useState(false);
  const state = props.accessibilityState;
  return <Pressable {...props}
    aria-checked={props['aria-checked'] ?? state?.checked}
    aria-expanded={props['aria-expanded'] ?? state?.expanded}
    aria-selected={props['aria-selected'] ?? state?.selected}
    aria-disabled={props['aria-disabled'] ?? state?.disabled}
    onHoverIn={event => { setHovered(true); onHoverIn?.(event); }}
    onHoverOut={event => { setHovered(false); onHoverOut?.(event); }}
    style={value => typeof style === 'function' ? style({ ...value, hovered }) : style}
  />;
}
