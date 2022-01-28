import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useState } from "react";
import styles from '../../styles/Home.module.css'

interface NamePageProps {
    userName: string
}

export default function Name({ userName }: NamePageProps) {
    const [message, onMessageChanged] = useState("");
    const [showMessage, onShowMessageChanged] = useState(false);
    const [requestActive, onRequestActiveChange] = useState(false);
  
    const doLinkPost = async () => {
      onRequestActiveChange(true);
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({userName}),
      });

      const body: {message: string, link: string}  = await res.json();

      if (res.status == 201) {
        onMessageChanged(`Share link: ${body.link}`);
      }
      else {
        onMessageChanged(body.message);
      }

      onRequestActiveChange(false);
      onShowMessageChanged(true);
    }

    const postNotification = async () => {
      onRequestActiveChange(true);
      await fetch('/api/notifications', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({body: `Notification from admin`})
      });
      onRequestActiveChange(false);
    }

    return (
        <div className={styles.container}>
          <Head>
            <title>{userName} Page</title>
            <meta name="description" content="Auto generated name page" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <main className={styles.main}>
          <h1 className={styles.title}>
              This page is for {userName}!
            </h1>
            { !showMessage ? 
              null
              : <h2 className={styles.description}>{message}</h2>
            }
            <div className={styles.grid}>
              <a className={styles.card}>
              <button type='button' 
                  className={styles.createButton} 
                  disabled={requestActive}
                  onClick={postNotification}
                  >
                  Send Notification
                </button>
                <br/><br/>
                <button type='button' 
                  className={styles.createButton}
                  onClick={doLinkPost}
                  disabled={requestActive}
                  >
                  Share
                </button>
              </a>
            </div>
          </main>
        </div>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const res = await fetch(`${process.env.WEB_URL_PREFIX}/api/names`, {
        method: 'GET'
      });
    const names: {name: string}[] = await res.json();
    const paths = names.map((name) => ({
        params: { id: name.name }
    }))
    return {
        paths: paths,
        fallback: false
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { id } = context.params;
    return {
        props: { userName: id }
    }
}
