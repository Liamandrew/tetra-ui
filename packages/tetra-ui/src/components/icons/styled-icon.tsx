import Svg from "react-native-svg";
import { withUniwind } from "uniwind";

export const StyledSvg = withUniwind(Svg, {
  style: {
    fromClassName: "className",
  },
});
