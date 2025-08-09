import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../constants/env";

class SignalRService {
  constructor() {
    this.connection = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  async connect() {
    try {
      if (this.connection && this.isConnected) {
        console.log("SignalR already connected");
        return;
      }

      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      this.connection = new HubConnectionBuilder()
        .withUrl(`${config.api.baseURL}/chathub`, {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      // Set up event handlers
      this.connection.onclose((error) => {
        console.log("SignalR connection closed:", error);
        this.isConnected = false;
      });

      this.connection.onreconnecting((error) => {
        console.log("SignalR reconnecting:", error);
        this.isConnected = false;
      });

      this.connection.onreconnected((connectionId) => {
        console.log("SignalR reconnected:", connectionId);
        this.isConnected = true;
      });

      // Start connection
      await this.connection.start();
      this.isConnected = true;
      console.log("SignalR Connected successfully");

      // Join user's personal notification group
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const user = JSON.parse(userData);
        await this.joinUserGroup(user.id);
      }
    } catch (error) {
      console.error("SignalR connection failed:", error);
      this.isConnected = false;
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.connection) {
        await this.connection.stop();
        this.connection = null;
        this.isConnected = false;
        console.log("SignalR disconnected");
      }
    } catch (error) {
      console.error("Error disconnecting SignalR:", error);
    }
  }

  async joinUserGroup(userId) {
    try {
      if (this.connection && this.isConnected) {
        await this.connection.invoke("JoinUserGroup", userId.toString());
        console.log(`Joined user group: ${userId}`);
      }
    } catch (error) {
      console.error("Error joining user group:", error);
    }
  }

  async joinConversationGroup(conversationId) {
    try {
      if (this.connection && this.isConnected) {
        await this.connection.invoke(
          "JoinConversationGroup",
          conversationId.toString()
        );
        console.log(`Joined conversation group: ${conversationId}`);
      }
    } catch (error) {
      console.error("Error joining conversation group:", error);
    }
  }

  async leaveConversationGroup(conversationId) {
    try {
      if (this.connection && this.isConnected) {
        await this.connection.invoke(
          "LeaveConversationGroup",
          conversationId.toString()
        );
        console.log(`Left conversation group: ${conversationId}`);
      }
    } catch (error) {
      console.error("Error leaving conversation group:", error);
    }
  }

  // Register for new message notifications
  onNewMessage(callback) {
    if (this.connection) {
      this.connection.on("NotifyNewMessage", callback);
      this.listeners.set("NotifyNewMessage", callback);
    }
  }

  // Register for match notifications
  onNewMatch(callback) {
    if (this.connection) {
      this.connection.on("NotifyNewMatch", callback);
      this.listeners.set("NotifyNewMatch", callback);
    }
  }

  // Register for general notifications
  onNotification(callback) {
    if (this.connection) {
      this.connection.on("ReceiveNotification", callback);
      this.listeners.set("ReceiveNotification", callback);
    }
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.connection) {
      this.listeners.forEach((callback, eventName) => {
        this.connection.off(eventName, callback);
      });
      this.listeners.clear();
    }
  }

  // Send a message notification
  async sendMessageNotification(conversationId, message) {
    try {
      if (this.connection && this.isConnected) {
        await this.connection.invoke(
          "SendMessageToConversation",
          conversationId,
          message
        );
      }
    } catch (error) {
      console.error("Error sending message notification:", error);
    }
  }

  // Check connection status
  isConnectionActive() {
    return this.connection && this.isConnected;
  }
}

const signalRService = new SignalRService();
export default signalRService;
