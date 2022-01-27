// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

interface NameReq {
  name: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != 'POST') {
    return res.status(405).json({message: 'Method not allowed.'});
  }

  try {
    const {name} = req.body as NameReq;

    if (name == null || name.length == 0) {
      res.status(400).json({message: 'Name null or empty.'});
    } else {
      res.status(201).json({message: 'Name saved.'});
    }
  } catch (e) {
    res.status(400).json({message: "Couldn't parse request.", ev: e});
  }
}


