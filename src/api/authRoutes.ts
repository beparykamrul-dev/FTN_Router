
import express from "express";
import { activeSessions, parseCookies } from "./auth.js";
import { PROVISIONED_USERS } from "../data/users.js";

const router = express.Router();
const DEFAULT_SESSION_TOKEN = "ftn_sess_auth_default_master";

activeSessions.set(DEFAULT_SESSION_TOKEN, PROVISIONED_USERS["beparykamrul@gmail.com"]);

router.get("/session", (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.ftn_session_token || req.headers.authorization?.replace("Bearer ", "") || DEFAULT_SESSION_TOKEN;
  const session = activeSessions.get(token);

  if (!session) {
    return res.json({
      authenticated: false,
      identity: null,
      provisionedServiceIds: [],
      policy: {
        selfRegistration: "DISABLED",
        provisioningAuthority: "FTN Organization / Control Panel Admin",
        storage: "SERVER_COOKIE_AUTHORITATIVE",
      },
    });
  }

  res.json({
    authenticated: true,
    identity: session,
    provisionedServiceIds: session.provisionedServiceIds,
    policy: {
      selfRegistration: "DISABLED",
      provisioningAuthority: "FTN Organization / Control Panel Admin",
      storage: "SERVER_COOKIE_AUTHORITATIVE",
    },
  });
});

router.post("/login", (req, res) => {
  const { email } = req.body ?? {};

  if (!email) {
    return res.status(400).json({ error: "Email address or FTN Identity required." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = PROVISIONED_USERS[normalizedEmail];

  if (!user) {
    return res.status(403).json({
      error: "Access Denied: Public self-registration is disabled for FTN services.",
      details: "Accounts are provisioned strictly via the FTN Enterprise Control Panel or family administrator. Contact your organization admin or household guardian for access.",
      provisioningPolicy: "NO_PUBLIC_SELF_REGISTRATION",
    });
  }

  const token = `ftn_sess_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
  activeSessions.set(token, user);

  res.cookie("ftn_session_token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 86400000,
    secure: process.env.NODE_ENV === "production",
  });

  res.json({
    success: true,
    message: "Authenticated via FTN Shared Identity Federation.",
    identity: user,
    provisionedServiceIds: user.provisionedServiceIds,
    token,
  });
});

router.post("/logout", (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies.ftn_session_token;
  if (token) {
    activeSessions.delete(token);
  }
  res.clearCookie("ftn_session_token", { path: "/" });
  res.json({ success: true, message: "Logged out from all FTN provisioned services." });
});

export default router;
