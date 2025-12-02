import { Circle } from "react-native-svg";
import { StyledSvg } from "./styled-icon";

export const EllipsisVertical = (
  props: React.ComponentProps<typeof StyledSvg>
) => {
  return (
    <StyledSvg
      {...props}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <Circle cx="12" cy="12" r="1" />
      <Circle cx="12" cy="5" r="1" />
      <Circle cx="12" cy="19" r="1" />
    </StyledSvg>
  );
};
