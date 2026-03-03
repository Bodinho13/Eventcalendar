import { useEffect, useState } from "react";
import type { Event } from "../../shared/src/event";
import { getAllEvents } from "../handlers/ewEventHandler";
import { EwEventCard } from "./EwEventCard";


const EwSummary = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const eventCards = [];

    useEffect(() => {
        getAllEvents()
            .then(res => {
                if(res.length > 0){
                    setEvents(res);
                }
            })
    }, []);

    for(const event of events){
        eventCards.push(<EwEventCard event={event}/>);
    }

    return(
        <div>
            <h2>Übersicht über alle Events</h2>
            {eventCards}
        </div>
    )
}

export {
    EwSummary
}