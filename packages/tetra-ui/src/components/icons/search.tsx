import { Circle, Path } from "react-native-svg";
import { StyledSvg } from "./styled-icon";

export const Search = (props: React.ComponentProps<typeof StyledSvg>) => {
  return (
    <StyledSvg
      {...props}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <Path d="m21 21-4.34-4.34" />
      <Circle cx="11" cy="11" r="8" />
    </StyledSvg>
  );
};
