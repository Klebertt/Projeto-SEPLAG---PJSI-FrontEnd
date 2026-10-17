import { useState } from 'react';
import { Pressable, type PressableProps, type PressableStateCallbackType, type StyleProp, type ViewStyle } from 'react-native';

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle> | ((state: PressableStateCallbackType & { hovered: boolean }) => StyleProp<ViewStyle>);
};

// O estado de hover existe na web; no toque o feedback utiliza pressed.
export function HoverPressable({ style, onHoverIn, onHoverOut, ...props }: Props) {
  const [hovered, setHovered] = useState(false);
  return <Pressable {...props}
    onHoverIn={(event) => { setHovered(true); onHoverIn?.(event); }}
    onHoverOut={(event) => { setHovered(false); onHoverOut?.(event); }}
    style={(state) => typeof style === 'function' ? style({ ...state, hovered }) : style}
  />;
}
