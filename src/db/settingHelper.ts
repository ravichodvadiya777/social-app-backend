import { Types } from "mongoose";
import Settings, { Setting } from "../model/settingModel";

const settingHelper = {
  insertOne: async (user: Types.ObjectId) => {
    try {
      await Settings.create({ user: user });
      return;
    } catch (error) {
      console.error("Error retrieving users:", error);
      throw error;
    }
  },

  patch: async (user: Types.ObjectId, data: Setting) => {
    try {
      await Settings.findOneAndUpdate({ user: user }, { $set: data });
      return;
    } catch (error) {
      console.error("Error retrieving users:", error);
      throw error;
    }
  },

  get: async (user: Types.ObjectId) => {
    try {
      const result = await Settings.findOne({ user: user });
      return result;
    } catch (error) {
      console.error("Error retrieving users:", error);
      throw error;
    }
  },
};

export default settingHelper;
