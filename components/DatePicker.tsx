import type { Dayjs } from 'dayjs';
import type { FC } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import styles from '../styles/DatePicker.module.css';
import cn from 'classnames';

interface Props {
    date: Dayjs | null,
    setDate: (newValue: Dayjs | null) => void
    hour: number,
    setHour: (newValue: number) => void,
    channel: string,
    setChannel: (newValue: string) => void,
}

const DatePicker: FC<Props> = ({ date, setDate, hour, setHour, channel, setChannel }) => {

    const channelButtons = ['cnn', 'fox'];
    const hourButtons = [
        {hour: 0, hourString: '12AM'}, 
        {hour: 6, hourString: '6AM'}, 
        {hour: 12, hourString: '12PM'}, 
        {hour: 18, hourString: '6PM'}
    ];

    const currentDate = new Date().toLocaleString('sv', {timeZone: 'Europe/Paris'});
    const currentHour = parseInt(currentDate.split(' ')[1].split(':')[0]);
    const currentDay = currentDate.split(' ')[0];

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StaticDatePicker
                    displayStaticWrapperAs="desktop"
                    openTo='day'
                    disableHighlightToday={true}
                    minDate={dayjs('2022-08-29')}
                    maxDate={dayjs(currentDay)}
                    inputFormat='YYYY-MM-DD'
                    value={date}
                    onChange={(newValue) => setDate(newValue)}
                    renderInput={(params) => <>{params}</>}
                />
            </LocalizationProvider>
            <div className={styles.channelPicker}>
                <div className={styles.channelPickerFlex}>
                    {channelButtons.map((item, index) => {
                        return <button 
                            key={index} 
                            className={`${cn({ [styles.active]: channel === item })}`} 
                            onClick={() => setChannel(item)}
                        >
                            {item.toUpperCase()}
                        </button>
                    })}
                </div>
                <div className={styles.channelSlider}></div>
            </div>
            <div className={styles.hourPicker}>
                <div className={styles.hourPickerFlex}>
                    {hourButtons.map((item, index) => {
                        return <button 
                            key={index} 
                            className={`${cn({ [styles.active]: hour === item.hour })}`} 
                            onClick={() => setHour(item.hour)}
                            disabled={currentHour < item.hour && date?.format('YYYY-MM-DD') === currentDay}
                        >
                            {item.hourString}
                        </button>
                    })}
                </div>
                <div className={styles.hourSlider}></div>
            </div>
        </>
    )
}

export default DatePicker;
