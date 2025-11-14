import { Circle, Path } from "react-native-svg";
import { StyledSvg } from "./styled-icon";

export const Sun = (props: React.ComponentProps<typeof StyledSvg>) => {
  return (
    <StyledSvg
      {...props}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <Circle cx="12" cy="12" r="4" />
      <Path d="M12 2v2" />
      <Path d="M12 20v2" />
      <Path d="m4.93 4.93 1.41 1.41" />
      <Path d="m17.66 17.66 1.41 1.41" />
      <Path d="M2 12h2" />
      <Path d="M20 12h2" />
      <Path d="m6.34 17.66-1.41 1.41" />
      <Path d="m19.07 4.93-1.41 1.41" />
    </StyledSvg>
  );
};
