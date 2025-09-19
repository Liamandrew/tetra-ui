import {
  Button,
  ButtonIcon,
  type ButtonProps,
} from '@repo/tetra-ui/components/button';
import { ChevronLeft, ChevronRight } from '@repo/tetra-ui/components/icons';
import { View } from 'react-native';
import { ScreenHeading } from '@/components/screen-heading';
import { ScreenScrollView } from '@/components/screen-scrollview';
import { Section } from '@/components/section';

const buttonExamples: ButtonProps[] = [
  {
    id: 'icon',
    children: (
      <ButtonIcon>
        <ChevronRight />
      </ButtonIcon>
    ),
    size: 'icon',
  },
  {
    id: 'size-sm',
    children: 'Size Small',
    size: 'sm',
  },
  {
    id: 'size-default',
    children: 'Size Default',
    size: 'default',
  },
  {
    id: 'size-default-busy',
    children: 'Size Default Busy',
    size: 'default',
    busy: true,
  },
  {
    id: 'size-default-disabled',
    children: 'Size Default Disabled',
    size: 'default',
    disabled: true,
  },
] as const;

export default function ButtonScreen() {
  return (
    <ScreenScrollView>
      <ScreenHeading>Button</ScreenHeading>

      <Section title="Default">
        {buttonExamples.map(({ id, ...props }) => (
          <Button key={id} {...props} variant="default" />
        ))}
      </Section>

      <Section title="Secondary">
        {buttonExamples.map(({ id, ...props }) => (
          <Button key={id} {...props} variant="secondary" />
        ))}
      </Section>

      <Section title="Destructive">
        {buttonExamples.map(({ id, ...props }) => (
          <Button key={id} {...props} variant="destructive" />
        ))}
      </Section>

      <Section title="Outline">
        {buttonExamples.map(({ id, ...props }) => (
          <Button key={id} {...props} variant="outline" />
        ))}
      </Section>

      <Section title="Ghost">
        {buttonExamples.map(({ id, ...props }) => (
          <Button key={id} {...props} variant="ghost" />
        ))}
      </Section>

      <Section title="Link">
        {buttonExamples.map(({ id, ...props }) => (
          <View className="h-12" key={id}>
            <Button
              key={id}
              {...props}
              className="self-center"
              variant="link"
            />
          </View>
        ))}
      </Section>

      <Section title="With Icons">
        <Button>
          <ButtonIcon>
            <ChevronLeft />
          </ButtonIcon>
          Back
        </Button>

        <Button>
          Next
          <ButtonIcon>
            <ChevronRight />
          </ButtonIcon>
        </Button>

        <Button>
          <ButtonIcon>
            <ChevronLeft />
          </ButtonIcon>
          Multiple Icons
          <ButtonIcon>
            <ChevronRight />
          </ButtonIcon>
        </Button>

        <Button size="sm">
          <ButtonIcon>
            <ChevronLeft />
          </ButtonIcon>
          Multiple Icons
          <ButtonIcon>
            <ChevronRight />
          </ButtonIcon>
        </Button>
      </Section>
    </ScreenScrollView>
  );
}
