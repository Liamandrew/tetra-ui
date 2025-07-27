import { cssInterop } from 'nativewind';
import Svg from 'react-native-svg';

cssInterop(Svg, {
  className: {
    target: 'style',
    nativeStyleToProp: { width: true, height: true, stroke: true },
  },
});

export const StyledSvg = Svg;
