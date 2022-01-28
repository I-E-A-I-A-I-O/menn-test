import {Request, Response} from "express";

interface NameReq {
    userName: string
  }
  
export const createLink = async (req: Request, res: Response) => {    
  try {
    const {userName} = req.body as NameReq;

    if (userName == null || userName.length == 0) {
      return res.status(400).json({message: 'Name null or empty.', link: ""});
    } else {
      const linkRes = await fetch(`https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.FIREBASE_WEB_KEY}`, {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            suffix: {
              option: "SHORT"
            },
            dynamicLinkInfo: {
                domainUriPrefix: process.env.URL_PREFIX,
                link: `${process.env.URL_PREFIX}/names/${userName}`,
                androidInfo: {
                  androidPackageName: "com.myapp",
                  androidFallbackLink: /*`${process.env.WEB_URL_PREFIX}/download`*/ "https://play.google.com/store/apps/details?id=com.instagram.android",
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