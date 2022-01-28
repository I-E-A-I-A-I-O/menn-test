import { Request, Response } from "express";
import { collections } from "../services/database.service";
import admin from "firebase-admin";

interface NotiReq {
  body: string
}

export const notificationBroadcast = async (req: Request, res: Response) => {
    try {
        const {body} = req.body as NotiReq;
        const db = collections.tokens;
        const result = await db.find().project({_id: 0, token: true}).toArray();
        const arr = result.map((val) => {
            return val.token;
        });
        
        await admin.messaging().sendMulticast(
            {
                tokens: arr,
                android: {
                    priority: 'high',
                    notification: {
                        channelId: 'high-priority',
                    },
                },
                notification: {
                    body: body,
                    title: 'Notification'
                }
            }
        );
        res.status(201).json({arr});
    } catch (e) {
        res.status(500).json({message: "Error sending broadcast.", ev: e});
    }
}
