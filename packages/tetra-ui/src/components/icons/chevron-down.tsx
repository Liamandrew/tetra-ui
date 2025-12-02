import { Path } from "react-native-svg";
import { StyledSvg } from "./styled-icon";

export const ChevronDown = (props: React.ComponentProps<typeof StyledSvg>) => {
  return (
    <StyledSvg
      {...props}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <Path d="m6 9 6 6 6-6" />
    </StyledSvg>
  );
};
