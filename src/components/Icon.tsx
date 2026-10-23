import { View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../styles/theme';

const paths = {
  arrow: 'm15 18-6-6 6-6 M9 12h10', bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4',
  calendar: 'M16 3v4M8 3v4M3 10h18', chevron: 'm8 10 4 4 4-4', close: 'm6 6 12 12 m0-12L6 18',
  edit: 'M12 20h9 M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z',
  eye: 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z',
  filter: 'M4 7h16 M7 12h10 M10 17h4', history: 'M3 12a9 9 0 1 0 3-6.7L3 8 M3 3v5h5 M12 7v5l3 2',
  logout: 'M10 17l5-5-5-5 M15 12H3 M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5',
  plus: 'M12 5v14 M5 12h14', search: 'm20 20-4-4', user: 'M4 21a8 8 0 0 1 16 0',
  check: 'M5 12l4 4L19 6', menu: 'M3 6h18 M3 12h18 M3 18h18',
  file: 'M14 2H5v20h14V7z M14 2v6h5 M8 12h8 M8 16h6',
  document: 'M5 3h14v18H5z M8 7h8 M8 11h8 M8 15h5',
  clock: 'M12 3a9 9 0 1 0 9 9 M12 3v9l7 4',
  money: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M15 8H10a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H9 M12 6v2 M12 16v2',
  building: 'M3 21h18 M5 21V5l7-3 7 3v16 M9 21v-6h6v6 M9 7h1 M14 7h1 M9 11h1 M14 11h1',
} as const;
export type IconName = keyof typeof paths;

export function Icon({ name, size = 20, color = colors.accent }: { name: IconName; size?: number; color?: string }) {
  return <View aria-hidden accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d={paths[name]} />
      {name === 'search' && <Circle cx={11} cy={11} r={7} />}
      {name === 'eye' && <Circle cx={12} cy={12} r={2.5} />}
      {name === 'user' && <Circle cx={12} cy={8} r={4} />}
      {name === 'calendar' && <Rect x={3} y={5} width={18} height={16} rx={2} />}
    </Svg>
  </View>;
}
