import moment from "moment";
import { MessagesList } from "../types";

class MainApi {
  static async getMessagesList(): Promise<MessagesList> {
    try {
      const response = await fetch("/api/messages");
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const { messages } = await response.json();
      return messages;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  }
}

export default MainApi;
