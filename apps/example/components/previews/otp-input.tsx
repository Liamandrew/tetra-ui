import {
  OTPInput,
  OTPInputGroup,
  OTPInputSeparator,
  OTPInputSlot,
} from "@/components/ui/otp-input";

export function OTPInputPreview() {
  return (
    <OTPInput maxLength={6}>
      <OTPInputGroup>
        <OTPInputSlot index={0} />
        <OTPInputSlot index={1} />
        <OTPInputSlot index={2} />
      </OTPInputGroup>
      <OTPInputSeparator />
      <OTPInputGroup>
        <OTPInputSlot index={3} />
        <OTPInputSlot index={4} />
        <OTPInputSlot index={5} />
      </OTPInputGroup>
    </OTPInput>
  );
}
