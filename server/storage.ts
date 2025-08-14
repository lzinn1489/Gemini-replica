import { type User, type InsertUser, type Conversation, type InsertConversation, type Message, type InsertMessage, users, conversations, messages } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, and, desc } from "drizzle-orm";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { existsSync, mkdirSync } from "fs";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getConversations(userId: string): Promise<Conversation[]>;
  getConversation(id: string, userId: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  deleteConversation(id: string, userId: string): Promise<void>;

  getMessages(conversationId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  updateUserProfile(userId: string, data: { name?: string; bio?: string; preferences?: Record<string, any> }): Promise<any>;
  getUserProfile(userId: string): Promise<any>;
}

// Ensure database directory exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbDir = join(__dirname, '../database');
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

const sqlite = new Database(join(dbDir, 'chat.db'));
const db = drizzle(sqlite);

// Create tables if they don't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    bio TEXT,
    preferences TEXT,
    created_at INTEGER DEFAULT CURRENT_TIMESTAMP NOT NULL
  );

  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    created_at INTEGER DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at INTEGER DEFAULT CURRENT_TIMESTAMP NOT NULL
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL REFERENCES conversations(id),
    content TEXT NOT NULL,
    role TEXT NOT NULL,
    image_url TEXT,
    created_at INTEGER DEFAULT CURRENT_TIMESTAMP NOT NULL
  );
`);

export class SQLiteStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      name: null,
      bio: null,
      preferences: null,
      createdAt: new Date(),
    };

    await db.insert(users).values(user);
    return user;
  }

  async getConversations(userId: string): Promise<Conversation[]> {
    const result = await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.updatedAt));
    return result;
  }

  async getConversation(id: string, userId: string): Promise<Conversation | undefined> {
    const result = await db
      .select()
      .from(conversations)
      .where(and(eq(conversations.id, id), eq(conversations.userId, userId)))
      .limit(1);
    return result[0];
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const now = new Date();
    const conversation: Conversation = {
      ...insertConversation,
      id,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(conversations).values(conversation);
    return conversation;
  }

  async deleteConversation(id: string, userId: string): Promise<void> {
    // First delete all messages in this conversation
    await db.delete(messages).where(eq(messages.conversationId, id));

    // Then delete the conversation
    await db.delete(conversations).where(and(eq(conversations.id, id), eq(conversations.userId, userId)));
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    const result = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
    return result;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      ...insertMessage,
      imageUrl: insertMessage.imageUrl ?? null,
      id,
      createdAt: new Date(),
    };

    await db.insert(messages).values(message);

    // Update conversation's updatedAt timestamp
    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, insertMessage.conversationId));

    return message;
  }

  async updateUserProfile(userId: string, data: { name?: string; bio?: string; preferences?: Record<string, any> }): Promise<any> {
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.preferences !== undefined) updateData.preferences = JSON.stringify(data.preferences);

    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId));

    // Return updated user
    return this.getUser(userId);
  }

  async getUserProfile(userId: string): Promise<any> {
    const user = await this.getUser(userId);
    if (user && user.preferences && typeof user.preferences === 'string') {
      try {
        user.preferences = JSON.parse(user.preferences);
      } catch {
        user.preferences = {};
      }
    }
    return user;
  }
}

export const storage = new SQLiteStorage();