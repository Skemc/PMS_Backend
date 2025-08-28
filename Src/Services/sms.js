import Vonage from "@vonage/server-sdk";
import { onError, onSuccess } from "../Utils/response";

const vonage = new Vonage({
  apiKey: process.env.SMS_API_KEY,
  apiSecret: process.env.SMS_API_SECRET,
});

const sendSms = async (res, to, text) => {
  const from = "Medical App";
  return await vonage.message.sendSms(
    from,
    to,
    text,
    {
      type: "unicode",
    },
    (err, responseData) => {
      if (err) {
        return onError(res, 500, "Message not sent");
      } else {
        if (responseData.messages[0]["status"] === "0") {
          return onSuccess(res, 500, "Message not sent");
        } else {
          return onError(
            res,
            500,
            `Message failed with error: ${responseData.messages[0]["error-text"]}`
          );
        }
      }
    }
  );
};

export default sendSms;