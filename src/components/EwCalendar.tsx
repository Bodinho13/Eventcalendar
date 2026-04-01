import { EwDateTile } from "./EwDateTile";
import { EwTextTile } from "./EwTextTile";
import { calcDaysOfMonth, months, weekdays, isSameDate } from "../utils/useCalendar";
import { getEventsInPeriod } from "../handlers/ewEventHandler";
import { useEffect, useState } from "react";
import type { Event } from "../../shared/src/event";

const EwCalendar = () => {
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());
    const firstOfMonth: Date = new Date(year, month -1, 1);
    const daysOfMonth: number = calcDaysOfMonth(month, year);
    const days = [];
    const weekTiles = [];

    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        getEventsInPeriod(firstOfMonth, new Date(year, month -1, daysOfMonth))
            .then((res) => {
                if(res.length > 0) {
                    setEvents(res);
                }
            })
            .catch((error) => {
                console.error("Events konnten nicht geladen werden!", error);
            });
    }, [month, year]);

    for (let i = 0; i < weekdays.length; i++){
        weekTiles.push(<EwTextTile text={weekdays[i]} />)
    }

    const daysLastMonth = calcDaysOfMonth(month - 1, year);
    for(let i = firstOfMonth.getDay() === 0 ? 6 : firstOfMonth.getDay() - 1; i > 0; i--) {
        days.push(<EwDateTile date={new Date(year, month -2, daysLastMonth - i + 1)} active={false} />)
    }

    for(let i = 1; i <= daysOfMonth; i++){
        let event = events.find(e => isSameDate(new Date(year, month - 1, i), new Date(e.date)));
        days.push(<EwDateTile date={new Date(year, month -1, i)} active={new Date(year, month -1, i) >= today} event={event} />);
    }

    const changeMonth = (nextMonth: boolean) => {
        if(nextMonth) {
            if(month == 12) {
                setMonth(1);
                setYear(year + 1);
            } else
                setMonth(month +1);
        } else {
            if(month == 1) {
                setMonth(12);
                setYear(year -1);
            } else 
                setMonth(month -1);
        }
    }

    return (
        <div>
            <div className="calendarTitle">
                <span className="changeMonthSpan" onClick={() => changeMonth(false)}>{"<< " + months[month -1]}</span>
                <h2>{months[month]} {year}</h2>
                <span className="changeMonthSpan" onClick={() => changeMonth(true)}>{months[month +1] + " >>"}</span>
            </div>
            <div className="calendarWeek">
                {weekTiles}
                {days}
            </div>
        </div>
    );
}

export {
    EwCalendar
}