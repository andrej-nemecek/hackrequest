import { boolean } from "drizzle-orm/pg-core";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name"),
  email: text("email"),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
});

export const tickets = pgTable("tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  summary: text("title"),
  email: text("email"),
  description: text("description"),
  type: text("type"),
  status: text("status"),
  projectId: uuid("project_id"),
  created_at: text("created_at"),
  confirmed: boolean("confirmed").default(false),
});

export const userProjects = pgTable("user_projects", {
  userId: uuid("user_id").references(() => users.id),
  projectId: uuid("project_id").references(() => projects.id),
});
