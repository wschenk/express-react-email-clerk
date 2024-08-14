// src/index.js
import express, { Express, Request, Response } from "express";
import React from "react";
import process from "node:process";
import dotenv from "dotenv";
import Email from "./emails/template";
import {
  ClerkExpressRequireAuth,
  ClerkExpressWithAuth,
  LooseAuthProp,
  WithAuthProp,
} from "@clerk/clerk-sdk-node";

import { Resend } from "resend";

dotenv.config();

if (process.env.RESEND_API === undefined) {
  console.log("Please set RESEND_API");
  process.exit(1);
}

const resend = new Resend(process.env.RESEND_API);

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server + Clerk");
});

// This is an example of how to send an email
app.post("/email", async (req: Request, res: Response) => {
  const results = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "wschenk@gmail.com",
    subject: "Test email",
    react: <Email />,
  });

  console.log("Email sent");
  console.log(results);
  res.send("Email sent");
});

// Use the lax middleware that returns an empty auth object when unauthenticated
app.get(
  "/protected-route",
  ClerkExpressRequireAuth({
    // Add options here
    // See the Middleware options section for more details
  }),
  (req: WithAuthProp<Request>, res: Response) => {
    res.json(req.auth);
  }
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
