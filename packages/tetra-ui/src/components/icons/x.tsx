import { Path } from "react-native-svg";
import { StyledSvg } from "./styled-icon";

export const X = (props: React.ComponentProps<typeof StyledSvg>) => {
  return (
    <StyledSvg
      {...props}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <Path d="M18 6 6 18" />
      <Path d="m6 6 12 12" />
    </StyledSvg>
  );
};
