
import { Request, Response } from "express";

// --- Mock state (will be moved to DB) ---
export const activeSessions = new Map<string, any>();

export const parseCookies = (cookieHeader?: string): Record<string, string> => {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;
  cookieHeader.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    const name = parts[0]?.trim();
    if (!name) return;
    const value = parts.slice(1).join("=").trim();
    list[name] = decodeURIComponent(value);
  });
  return list;
};

export const getSession = (req: Request) => {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.ftn_session_token || req.headers.authorization?.replace("Bearer ", "");
  return token ? activeSessions.get(token) : null;
};
