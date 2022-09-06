import type { NextPage, GetServerSideProps } from 'next';
import Link from 'next/link';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/Explore.module.css';
import { useEffect, useRef, useState } from 'react';
import DatePicker from '../../components/DatePicker';
import { useRouter } from 'next/router';
import arrow from '/assets/right-arrow.svg';
import cn from 'classnames';
import FOX_64 from 'assets/FOX-64.js';
import CNN_64 from 'assets/CNN-64.js';
import Spinner from '../../components/Spinner';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {

    const { params } = query;

    if(typeof params === 'undefined' || typeof params === 'object'){
        return {
            notFound: true
        }
    }

    const split = params.split('-');

    const paramDate = `${split[0]}-${split[1]}-${split[2]}`;
    const paramHour = parseInt(split[3]);
    const paramChannel = split[4];

    const currentDate = new Date().toLocaleString('sv', {timeZone: 'Europe/Paris'});
    const currentHour = parseInt(currentDate.split(' ')[1].split(':')[0]);
    const currentDay = currentDate.split(' ')[0];
    

    if(!([0, 6, 12, 18].includes(paramHour)) || 
        paramDate > currentDay || 
        (currentHour < paramHour && paramDate === currentDay) ||  
        paramDate < '2022-08-29' || 
        split.length !== 5 || 
        !(['fox', 'cnn'].includes(paramChannel)))
    {
        return {
            notFound: true
        }
    }
    
    return {
        props: {
            paramDate, 
            paramHour,
            paramChannel
        },
    }
}

interface Props {
    paramDate: string, 
    paramHour: number,
    paramChannel: string
}

const Explore: NextPage<Props> = ({ paramDate, paramHour, paramChannel }) => {

    const router = useRouter();
    
    const [date, setDate] = useState<Dayjs | null>(dayjs(paramDate));
    const [hour, setHour] = useState(paramHour);
    const [channel, setChannel] = useState(paramChannel);
    const [menuOpen, setMenuOpen] = useState(false);
    const [error, setError] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);

    const firstRender = useRef(true);

    const DatePickerProps =  { date, setDate, hour, setHour, channel, setChannel };

    const channelUpper = channel.toUpperCase();
    const dateFormat = date?.format('YYYY-MM-DD');
    const hourString = `${hour < 10 ? `0${hour}` : hour}`;
    const urlString = `${channelUpper}/${dateFormat}-${hourString}`;
    const title = `Explore | ${channelUpper} ${date?.format('DD/MM/YYYY')} ${hour}h`;

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        if (!buttonClicked) router.push(`/explore/${dateFormat}-${hourString}-${channel}`, undefined, { shallow: true });
        setError(false);
    }, [dateFormat, hourString, channel, router, buttonClicked])

    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content="US Media Archive/Comparator" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {!buttonClicked ?
                <button className={styles.homeButton} onClick={() => setButtonClicked(true)}>
                    <Link href='/'>HOME</Link>
                </button>
            :
                <Spinner />
            }
            <nav className={`${cn(styles.nav, { [styles.menuActive]: !menuOpen })}`}>
                <DatePicker {...DatePickerProps}/>
                <div className={`${cn(styles.arrowContainer, { [styles.arrowContainerActive]: !menuOpen })}`}>
                    <div className={styles.arrowContainer2} onClick={() => setMenuOpen(!menuOpen)}>
                        <Image 
                            src={arrow}
                            alt='arrow' 
                            className={menuOpen ? styles.arrowActive : styles.arrow} 
                            quality={100} 
                            priority
                            width={20}
                            height={20}
                        />
                    </div>
                </div>
            </nav>
            <main className={styles.imageWrapper}>
                {error ? <p className={styles.error}>An error occurred while fetching the image</p> : 
                <Image 
                    key={urlString}
                    src={`https://storage.googleapis.com/us-media-archive.appspot.com/images/${urlString}.jpg`} 
                    alt={urlString} 
                    blurDataURL={channel === 'cnn' ? CNN_64 : FOX_64} 
                    placeholder='blur'
                    quality={100}
                    width={1200}
                    height={channel === 'cnn' ? 6465 : 18958}
                    onError={() => setError(true)}
                    unoptimized
                    priority
                />}
            </main>
        </>
    )
}

export default Explore;
