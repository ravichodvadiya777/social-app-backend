import schedule from "node-schedule";
import storyHelper from "../db/storyHelper";
import { Types } from "mongoose";

export const restart = async () => {
  const getStory = await storyHelper.find();
  for (const story of getStory) {
    // add 24 hr
    const addDate = new Date(story.createdAt);
    addDate.setHours(addDate.getHours() + 24);

    if (new Date() > addDate) {
      // delete story
      await storyHelper.deleteOne({ _id: new Types.ObjectId(story._id) });
    } else {
      // set schedule for delete story
      const originalDate = new Date(story.createdAt);

      originalDate.setHours(originalDate.getHours() + 24);
      const expiryDate = originalDate.toISOString();

      const trend = story._id;
      schedule.scheduleJob(
        expiryDate,
        async function () {
          await storyHelper.deleteOne({ _id: new Types.ObjectId(story._id) });
        }.bind(null, trend)
      );
    }
  }
};
