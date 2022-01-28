import {Request, Response} from "express";
import { collections } from "../services/database.service";

interface TokenReq {
  token: string,
  deviceId: string
}

export const saveToken = async (req: Request, res: Response) => {
    try {
        const {token, deviceId} = req.body as TokenReq;
        const db = collections.tokens;
        const result = await db.findOne({deviceId});

        if (result) {
          await db.updateOne({deviceId}, {token});
          return res.status(400).json({message: 'Token updated.'});
        }

        const insertResult = await db.insertOne({deviceId, token});

        if (!insertResult) {
          return res.status(500).json({message: "Error saving token."});
        }

        res.status(201).json({message: 'Token saved.'});
    } catch (e) {
        res.status(500).json({message: "Error saving token.", ev: e});
    }
}
