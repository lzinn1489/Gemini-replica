import { apiRequest } from "./queryClient";
import type { Conversation, Message } from "@shared/schema";

export interface ChatResponse {
  userMessage: Message;
  aiMessage: Message;
  error?: string;
}

export const chatApi = {
  async getConversations(): Promise<Conversation[]> {
    const response = await apiRequest("GET", "/api/conversations");
    return response.json();
  },

  async createConversation(title: string): Promise<Conversation> {
    const response = await apiRequest("POST", "/api/conversations", { title });
    return response.json();
  },

  // Delete conversation
  deleteConversation: async (conversationId: string) => {
    const response = await fetch(`/api/conversations/${conversationId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete conversation");
    }

    return response.json();
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await apiRequest("GET", `/api/conversations/${conversationId}/messages`);
    return response.json();
  },

  async sendMessage(conversationId: string, content: string): Promise<ChatResponse> {
    const response = await apiRequest("POST", `/api/conversations/${conversationId}/messages`, { content });
    return response.json();
  },

  // Get user profile
  getUserProfile: async () => {
    const response = await fetch("/api/user/profile", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return response.json();
  },

  // Update user profile
  updateUserProfile: async (data: { name?: string; bio?: string; preferences?: Record<string, any> }) => {
    const response = await fetch("/api/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to update user profile");
    }

    return response.json();
  },
};