import schedule from "node-schedule";
import ChatSetting from "./model/chatSettingModel";
import Chat from "./model/chatModel";

const find24HrViewMsg = async () => {
  const conversationIds = (await ChatSetting.find({ delete24View: true })).map(
    (data) => data.conversationId
  );
  const getMsgs = await Chat.find({ conversationId: { $in: conversationIds } });
  for (const msg of getMsgs) {
    const originalDate = new Date(msg.createdAt);

    originalDate.setHours(originalDate.getHours() + 24);
    const expiryDate = originalDate.toISOString();

    const trend = msg._id;
    schedule.scheduleJob(
      expiryDate,
      async function () {
        await Chat.deleteOne({ _id: msg._id });
      }.bind(null, trend)
    );
  }
};

// every day 12AM
schedule.scheduleJob("0 0 0 * * *", async function () {
  find24HrViewMsg();
});
find24HrViewMsg();
