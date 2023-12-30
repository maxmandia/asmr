import React from "react";

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type Message = ({
  sender: {
    id: string;
    email: string;
    handle: string;
    profile_picture_url: string | null;
  };
  receiver: {
    id: string;
    email: string;
    handle: string;
  };
} & {
  id: number;
  senderId: string;
  receiverId: string;
  createdAt: Date;
  message: string | null;
  isTip: boolean;
  tipPrice: string | null;
  wasRead: boolean;
  wasNotified: boolean;
})[];

function NotificationEmail({
  messages,
  uniqueSenders,
}: {
  messages: Message;
  uniqueSenders: Set<string>;
}) {
  if (!messages || !messages[0]) {
    return null;
  }

  let message;

  if (uniqueSenders.size > 2) {
    const sendersArray = Array.from(uniqueSenders);
    const firstTwoSenders = sendersArray.slice(0, 2).join(", ");
    message = `${firstTwoSenders}, and others`;
  } else {
    message = Array.from(uniqueSenders).join(", ");
  }

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Text>🤫</Text>
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              You have <strong>{messages.length}</strong> unread notifcation
              {messages.length > 1 ? "s" : ""} on <strong>Hush ASMR.</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hi <strong>@{messages[0].receiver.handle},</strong>
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              Users including <strong>{message}</strong> have sent you messages
              that are awaiting your response. You can view them by clicking the
              button below.
            </Text>
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#9C4CD0] px-[20px] py-[12px] text-center text-[12px] font-semibold text-white no-underline"
                href={"https://hushasmr.com/messages"}
              >
                View message{messages.length > 1 ? "s" : ""}
              </Button>
            </Section>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This invitation was intended for{" "}
              <span className="text-black">
                @{messages[0].receiver.handle}.{" "}
              </span>
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

export default NotificationEmail;
