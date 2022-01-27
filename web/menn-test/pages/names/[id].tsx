import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import styles from '../../styles/Home.module.css'

interface NamePageProps {
    userName: string
}

export default function Name({ userName }: NamePageProps) {
    return (
        <div className={styles.container}>
          <Head>
            <title>{userName}'s Page</title>
            <meta name="description" content="Auto generated name page" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <main className={styles.main}>
          <h1 className={styles.title}>
              This page is for {userName}!
            </h1>
            <div className={styles.grid}>
              <a className={styles.card}>
              <button type='button' 
                  className={styles.createButton} 
                  >
                  Send Notification
                </button>
                <br/><br/>
                <button type='button' 
                  className={styles.createButton}
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
    const res = await fetch(`${process.env.API_URL}/api/names`, {
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
