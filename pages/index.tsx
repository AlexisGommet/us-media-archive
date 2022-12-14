import type { NextPage, GetStaticProps } from 'next';
import type { Dayjs } from 'dayjs';
import Spinner from '../components/Spinner';
import dayjs from 'dayjs';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import CNN_Logo from '/assets/CNN-logo.png';
import FOX_Logo from '/assets/FOX-logo.png';
import { useState } from 'react';
import DatePicker from '../components/DatePicker';

export const getStaticProps: GetStaticProps = async () => {

    const startDay = new Date().toLocaleString('sv', {timeZone: 'Europe/Paris'}).split(' ')[0];
  
    return {
        props: {
            startDay
        },
        revalidate: 60
    }
}

interface Props {
    startDay: string
}

const Home: NextPage<Props> = ({ startDay }) => {

    const [date, setDate] = useState<Dayjs | null>(dayjs(startDay));
    const [hour, setHour] = useState(0);
    const [channel, setChannel] = useState('cnn');
    const [buttonClicked, setButtonClicked] = useState(false);

    const DatePickerProps =  { date, setDate, hour, setHour, channel, setChannel };

    return (
        <>
            <Head>
                <title>US Media Archive/Comparator</title>
                <meta name="description" content="US Media Archive/Comparator" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.container}>
                <main>
                    <h1>US Media Archive/Comparator</h1>
                    <h4>Compare the alternate realities of US media at different dates and times</h4>
                    <h6>Screenshots taken at 12AM, 6AM, 12PM and 6PM UTC+2 Paris</h6>
                    <div className={styles.row}>
                        <Image src={CNN_Logo} alt="CNN Logo" placeholder="blur" priority/>
                        <Image src={FOX_Logo} alt="FOX Logo" placeholder="blur" priority/>
                    </div>
                    <DatePicker {...DatePickerProps}/>
                    {!buttonClicked ? 
                        <button onClick={() => setButtonClicked(true)}>
                            <Link href={`/explore/${date?.format('YYYY-MM-DD')}-${hour < 10 ? `0${hour}` : hour}-${channel}`}>
                                Let&apos;s compare
                            </Link>
                        </button>
                    :
                        <Spinner />
                    }
                </main>
            </div>
        </>
    )
}

export default Home;
