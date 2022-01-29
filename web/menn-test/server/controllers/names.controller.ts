import { Request, Response } from "express";
import { collections } from "../services/database.service";

interface NameReq {
  name: string
}

export const insertName = async (req: Request, res: Response) => {
    try {
        const {name} = req.body as NameReq;

        if (name == null || name.length == 0) {
            return res.status(400).json({message: 'Name null or empty.'});
        } else {
          const db = collections.names;
          const result = await db.findOne({name});

          if (result) {
            return res.status(400).json({message: 'Name already exists'});
          }

          const insertResult = await db.insertOne({name});

          if (!insertResult) {
            return res.status(500).json({message: "Error saving name."});
          }

          res.status(201).json({message: 'Name saved.', name: name});
        }
    } catch (e) {
        res.status(500).json({message: "Error saving name.", ev: e});
    }
}

export const getNames = async (req: Request, res: Response) => {
    const db = collections.names;
    const names = db.find();
    const toArray = await names.toArray();
    names.close();
    return res.status(200).json(toArray);
}
