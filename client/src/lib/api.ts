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
    const response = await apiRequest("DELETE", `/api/conversations/${conversationId}`);
    return response.json();
  },</old_str>

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
    const response = await apiRequest("GET", "/api/user/profile");
    return response.json();
  },

  // Update user profile
  updateUserProfile: async (data: { name?: string; bio?: string; preferences?: Record<string, any> }) => {
    const response = await apiRequest("PUT", "/api/user/profile", data);
    return response.json();
  },
};