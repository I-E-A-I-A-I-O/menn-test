// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";
import ClientPromise from './utils/mongodb';

interface NameReq {
  name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {  
  if (req.method == 'POST') {
    try {
      const {name} = req.body as NameReq;
  
      if (name == null || name.length == 0) {
        res.status(400).json({message: 'Name null or empty.'});
      } else {
        const conn = await ClientPromise;
        const db = conn.db();
        const result = await db.collection("names").findOne({name});
  
        if (result) {
          return res.status(400).json({message: 'Name already exists'});
        }
  
        const insertResult = await db.collection("names").insertOne({name});
  
        if (!insertResult) {
          return res.status(500).json({message: "Error saving name."});
        }
  
        res.status(201).json({message: 'Name saved.'});
      }
    } catch (e) {
      res.status(500).json({message: "Error saving name.", ev: e});
    }
  }
  else if (req.method == 'GET') {
    const conn = await ClientPromise;
    const db = conn.db();
    const names = db.collection("names").find();
    const toArray = await names.toArray();
    names.close();
    return res.status(200).json(toArray);
  }
  else {
    return res.status(405).json({yeah: "a", message: 'Method not alloweds.', method: req.method});
  }
}


