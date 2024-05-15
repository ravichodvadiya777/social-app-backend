import Device from "../model/deviceModel";
import admin from "./firebase/firebaseConfig";

const pushNotification = async (
  title: string,
  body: string,
  text: { [key: string]: string },
  user_id: string[]
) => {
  const tokens = [];
  const User_tokens = await Device.find({
    user: { $in: [user_id] },
  }).select("fcmToken _id");

  for (let i = 0; i < User_tokens.length; i++) {
    tokens.push(User_tokens[i].fcmToken);
  }

  if (tokens.length == 0) return;

  const bodyObject = {
    notification: {
      title: title,
      body: body,
    },
    tokens: tokens,
    data: text,
  };

  return new Promise((resolve) => {
    admin
      .messaging()
      .sendMulticast(bodyObject)
      .then((response) => {
        console.log(response.responses, "************************");
        console.log(response.failureCount, "===================");
        if (response.failureCount > 0) {
          response.responses.forEach(async (resp, idx) => {
            if (
              !resp.success &&
              (resp.error.code == "messaging/invalid-argument" ||
                resp.error.code ==
                  "messaging/registration-token-not-registered")
            ) {
              await Device.findByIdAndDelete(User_tokens[idx]._id);
            }
          });
        }
        resolve(response);
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        // reject(error);
      });
  });
};

export default pushNotification;
