import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConversationSchema, insertMessageSchema, updateUserProfileSchema } from "@shared/schema";
import { setupAuth, requireAuth } from "./auth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Get user profile (protected)
  app.get("/api/user/profile", requireAuth, async (req, res) => {
    try {
      const profile = await storage.getUserProfile(req.user!.id);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  // Update user profile (protected)
  app.put("/api/user/profile", requireAuth, async (req, res) => {
    try {
      const validatedData = updateUserProfileSchema.parse(req.body);
      const updatedProfile = await storage.updateUserProfile(req.user!.id, validatedData);
      res.json(updatedProfile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update user profile" });
      }
    }
  });

  // Get all conversations (protected)
  app.get("/api/conversations", requireAuth, async (req, res) => {
    try {
      const conversations = await storage.getConversations(req.user!.id);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Create new conversation (protected)
  app.post("/api/conversations", requireAuth, async (req, res) => {
    try {
      const validatedData = insertConversationSchema.parse({
        ...req.body,
        userId: req.user!.id,
      });
      const conversation = await storage.createConversation(validatedData);
      res.json(conversation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid conversation data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create conversation" });
      }
    }
  });

  // Delete conversation (protected)
  app.delete("/api/conversations/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteConversation(req.params.id, req.user!.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete conversation" });
    }
  });

  // Get messages for a conversation (protected)
  app.get("/api/conversations/:id/messages", requireAuth, async (req, res) => {
    try {
      // Verify user owns this conversation
      const conversation = await storage.getConversation(req.params.id, req.user!.id);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      const messages = await storage.getMessages(req.params.id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Send message and get AI response (protected)
  app.post("/api/conversations/:id/messages", requireAuth, async (req, res) => {
    try {
      const conversationId = req.params.id;
      const { content } = req.body;

      if (!content || typeof content !== 'string') {
        return res.status(400).json({ message: "Message content is required" });
      }

      // Verify user owns this conversation
      const conversation = await storage.getConversation(conversationId, req.user!.id);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      // Create user message
      const userMessage = await storage.createMessage({
        conversationId,
        content,
        role: "user",
      });

      // Call Google Gemini API using REST API
      const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
      
      try {
        // Get conversation context for better responses
        const messages = await storage.getMessages(conversationId);
        const contextMessages = messages.slice(-10); // Last 10 messages for context
        
        let prompt = content;
        if (contextMessages.length > 1) {
          const context = contextMessages.slice(0, -1).map(msg => 
            `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content}`
          ).join('\n');
          prompt = `Contexto da conversa:\n${context}\n\nPergunta atual: ${content}\n\nResponda em português brasileiro de forma natural e útil:`;
        } else {
          prompt = `Responda em português brasileiro de forma natural e útil: ${content}`;
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': apiKey
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            }
          })
        });

        if (!response.ok) {
          throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não consegui processar sua solicitação.";

        // Create AI response message
        const aiMessage = await storage.createMessage({
          conversationId,
          content: aiResponse || "Desculpe, não consegui processar sua solicitação.",
          role: "assistant",
        });

        // Return both messages with conversation ID for consistency
        res.json({
          userMessage: userMessage,
          aiMessage: aiMessage,
          conversationId: conversationId
        });

      } catch (apiError) {
        console.error("Google Gemini API Error:", apiError);
        
        // Create error response message
        const errorMessage = await storage.createMessage({
          conversationId,
          content: "Desculpe, ocorreu um erro ao processar sua solicitação. Verifique sua conexão e tente novamente.",
          role: "assistant",
        });

        // Return both messages with conversation ID for consistency
        res.json({
          userMessage: userMessage,
          aiMessage: errorMessage,
          conversationId: conversationId
        });
      }

    } catch (error) {
      console.error("Message handling error:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
