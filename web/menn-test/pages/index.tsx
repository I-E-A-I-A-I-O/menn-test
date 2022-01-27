import Head from 'next/head'
import { useState } from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [name, onNameChanged] = useState("");
  const [message, onMessageChanged] = useState("");
  const [isError, onIsErrorChanged] = useState(false);
  const [showMessage, onShowMessageChanged] = useState(false);
  const [requestActive, onRequestActiveChange] = useState(false);

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
    const body: {message: string} = await res.json();
    onIsErrorChanged(res.status != 201);
    onMessageChanged(body.message);
    onRequestActiveChange(false);
    onShowMessageChanged(true);

    setTimeout(() => {
      onShowMessageChanged(false);
    }, 8000);
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
          : <h2 className={isError ? styles.descriptionErr : styles.descriptionSus}>{message}</h2>
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
