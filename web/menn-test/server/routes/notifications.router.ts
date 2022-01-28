import express from "express";
import { notificationBroadcast } from "../controllers/notifications.controller";

export const notificationRouter = express.Router();

notificationRouter.post('/', notificationBroadcast);