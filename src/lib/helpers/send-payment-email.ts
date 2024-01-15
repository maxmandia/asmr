import { resend } from "~/config/resend";
import PaymentMessageNotificationEmail from "~/components/PaymentNotificationEmail";

export async function sendPaymentEmail(
  email: string,
  paymentType: string,
  amount: number,
) {
  await resend.emails.send({
    from: "hi@messaging.hushasmr.com",
    to: email,
    subject: `You recieved a payment!`,
    react: PaymentMessageNotificationEmail({
      paymentType,
      amount,
    }) as any,
  });
}
