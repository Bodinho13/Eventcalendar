import type { Event } from "../../shared/src/event";
import { formatDateGerman } from "../utils/useSummary";

const EwEventCard = (props: any) => {
    const event: Event = props.event;


    return (
        <div className="eventCard">
            <span className="eventCard-title">{event.eventName}</span>
            <div>Wann: {formatDateGerman(new Date(event.date))} {event.startTime}</div>
            <div>Wo: {event.location}</div>
            <div>Host: {event.host}</div>
        </div>
    )
}

export {
    EwEventCard
}