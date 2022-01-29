import Head from 'next/head'
import Link from 'next/link';
import { Component, useState } from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [name, onNameChanged] = useState("");
  const [message, onMessageChanged] = useState("");
  const [isError, onIsErrorChanged] = useState(false);
  const [showMessage, onShowMessageChanged] = useState(false);
  const [requestActive, onRequestActiveChange] = useState(false);
  const [lastName, onLastName] = useState("");

  const doPost = async () => {
    if (name.length == 0 || requestActive) {
      return;
    }

    onRequestActiveChange(true);

    const res = await fetch('/api/names', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({name}),
    });

    const body: {message: string, name?: string} = await res.json();

    if (res.status === 201) {
      onLastName(body.name);
    }

    onIsErrorChanged(res.status !== 201);
    onMessageChanged(body.message);
    onRequestActiveChange(false);
    onShowMessageChanged(true);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Admin Page</title>
        <meta name="description" content="Admin page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
      <h1 className={styles.title}>
          Create a name.
        </h1>
        { !showMessage ? 
          null
          : isError ? 
          <h2 className={isError ? styles.descriptionErr : styles.descriptionSus}>{message}</h2>
          : 
          <Link href={`/names/${lastName}`} passHref>
            <h4 className={styles.title}>
              <a>{message} Click to visit {lastName}&apos;s Page.</a>
            </h4>
          </Link>
        }
        <div className={styles.grid}>
          <a className={styles.card}>
            <input type={'text'} placeholder='Name' className={styles.input} 
            onChange={(e) => {onNameChanged(e.target.value)}} />
            <br/><br/>
            <button type='button' 
              className={styles.createButton} onClick={doPost} disabled={requestActive}
              >
              Create
            </button>
          </a>
        </div>
      </main>
    </div>
  )
}
