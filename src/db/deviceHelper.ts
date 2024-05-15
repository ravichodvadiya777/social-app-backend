import { Types } from "mongoose";
import Device, { DeviceType } from "../model/deviceModel";

const deviceHelper = {
  insertOne: async (data: DeviceType) => {
    try {
      const old = await Device.findOne(data);
      if (!old) {
        await Device.create(data);
      }
      return;
    } catch (error) {
      console.error("Error inserting device:", error);
      throw error;
    }
  },

  find: async (user: Types.ObjectId) => {
    try {
      const result = await Device.find({ user: user });
      return result;
    } catch (error) {
      console.error("Error removing device:", error);
      throw error;
    }
  },

  deleteOne: async (fcmToken: string) => {
    try {
      await Device.findOneAndDelete({ fcmToken: fcmToken });
      return;
    } catch (error) {
      console.error("Error removing device:", error);
      throw error;
    }
  },
};
export default deviceHelper;
