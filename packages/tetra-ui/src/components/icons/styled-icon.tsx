import Svg from "react-native-svg";
import { withUniwind } from "uniwind";

export const StyledSvg = withUniwind(Svg, {
  stroke: {
    fromClassName: "className",
    styleProperty: "backgroundColor",
  },
  width: {
    fromClassName: "className",
    styleProperty: "width",
  },
  height: {
    fromClassName: "className",
    styleProperty: "height",
  },
});
