import { Path } from "react-native-svg";
import { StyledSvg } from "./styled-icon";

export const ChevronRight = (props: React.ComponentProps<typeof StyledSvg>) => {
  return (
    <StyledSvg
      {...props}
      fill="none"
      height="24"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
    >
      <Path d="m9 18 6-6-6-6" />
    </StyledSvg>
  );
};
