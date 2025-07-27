import { Heading } from '@tetra-ui/native/components/heading';
import { View } from 'react-native';

export const ScreenHeading = (props: React.PropsWithChildren) => {
  return (
    <View className="bg-background p-4">
      <Heading level="1" {...props} />
    </View>
  );
};
