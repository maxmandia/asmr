import React from "react";

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Tailwind,
  Text,
} from "@react-email/components";

function PaymentMessageNotificationEmail({
  paymentType,
  amount,
}: {
  paymentType: string;
  amount: number;
}) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Text>🤫</Text>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              You have recieved a payment of <strong>{amount * 100}</strong> on{" "}
              <strong>Hush ASMR.</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">Hi,</Text>
            <Text className="text-[14px] leading-[24px] text-black">
              You recieved a {paymentType} amounting to{" "}
              <strong>{amount * 100}</strong>.
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              If you were not expecting this invitation, you can ignore this
              email. If you are concerned about your account&apos;s safety,
              please reply to this email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default PaymentMessageNotificationEmail;
