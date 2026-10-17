import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import { colors } from '../styles/theme';

const paths = {
  search: 'M21 21l-5-5 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  file: 'M14 2H5v20h14V7z M14 2v6h5 M8 12h8 M8 16h6',
  document: 'M5 3h14v18H5z M8 7h8 M8 11h8 M8 15h5',
  clock: 'M12 3a9 9 0 1 0 9 9 M12 3v9l7 4',
  calendar: 'M4 5h16v16H4z M4 10h16 M8 2v6 M16 2v6',
  money: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M15 8H10a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H9 M12 6v2 M12 16v2',
  building: 'M3 21h18 M5 21V5l7-3 7 3v16 M9 21v-6h6v6 M9 7h1 M14 7h1 M9 11h1 M14 11h1',
  edit: 'M14 5l5 5 M3 21l5-1L21 7a2 2 0 0 0-5-5L3 15z M13 21h8',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8 M10 21h4',
  chevron: 'M6 9l6 6 6-6',
  check: 'M5 12l4 4L19 6',
  close: 'M6 6l12 12 M6 18L18 6',
  arrow: 'M19 12H5 M11 6l-6 6 6 6',
  filter: 'M4 6h16 M7 12h10 M10 18h4',
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 18, color = colors.accent }: { name: IconName; size?: number; color?: string }) {
  return (
    <View aria-hidden accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d={paths[name]} stroke={color} strokeWidth={1.65} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
    </View>
  );
}
