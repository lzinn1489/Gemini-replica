import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  bio: text("bio"),
  preferences: text("preferences"), // JSON string
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  conversationId: text("conversation_id").references(() => conversations.id).notNull(),
  content: text("content").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  imageUrl: text("image_url"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const selectUserSchema = createSelectSchema(users);

// User profile schema for storing additional user information
export const updateUserProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  preferences: z.record(z.any()).optional(),
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  title: true,
  userId: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  conversationId: true,
  content: true,
  role: true,
  imageUrl: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;