import {
  Choicebox,
  ChoiceboxItem,
  ChoiceboxItemDescription,
  ChoiceboxItemHeader,
  ChoiceboxItemTitle,
} from "@/components/ui/choicebox";

export function ChoiceboxPreview() {
  return (
    <Choicebox defaultValue="standard" type="single">
      <ChoiceboxItem value="standard">
        <ChoiceboxItemHeader>
          <ChoiceboxItemTitle>Standard shipping</ChoiceboxItemTitle>
          <ChoiceboxItemDescription>4–5 business days</ChoiceboxItemDescription>
        </ChoiceboxItemHeader>
      </ChoiceboxItem>
      <ChoiceboxItem value="express">
        <ChoiceboxItemHeader>
          <ChoiceboxItemTitle>Express shipping</ChoiceboxItemTitle>
          <ChoiceboxItemDescription>1–2 business days</ChoiceboxItemDescription>
        </ChoiceboxItemHeader>
      </ChoiceboxItem>
    </Choicebox>
  );
}
