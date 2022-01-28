import { NextApiRequest, NextApiResponse } from "next";

interface NameReq {
  userName: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {  
  if (req.method != 'POST') {
    return res.status(405).json({message: 'Method not allowed.', link: ""});
  }
  
  try {
    const {userName} = req.body as NameReq;

    if (userName == null || userName.length == 0) {
      res.status(400).json({message: 'Name null or empty.', link: ""});
    } else {
      const linkRes = await fetch(`https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.FIREBASE_WEB_KEY}`, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            dynamicLinkInfo: {
                domainUriPrefix: process.env.URL_PREFIX,
                link: `${process.env.URL_PREFIX}/names/${userName}`,
                androidInfo: {
                  androidPackageName: "com.myapp"
                }
              }
          })
      })

      if (linkRes.status != 200) {
          return res.status(500).json({message: "Error generating the link.", link: ""});
      }

      const jBody = await linkRes.json();
      res.status(201).json({message: 'Link copied to clipboard.', link: jBody.shortLink});
    }
  } catch (e) {
    res.status(500).json({message: "Error generating the link.", link: ""});
  }
}
