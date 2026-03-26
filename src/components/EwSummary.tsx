import { useEffect, useState } from "react";
import type { Event } from "../../shared/src/event";
import { getAllEvents, deleteEvents } from "../handlers/ewEventHandler";
import { EwEventCard } from "./EwEventCard";


const EwSummary = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [selected, setSelected] = useState<Event[]>([]);
    const [selectMode, setSelectMode] = useState(false);
    const eventCards = [];

    useEffect(() => {
        getAllEvents()
            .then(res => {
                if(res.length > 0){
                    setEvents(res.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
                }
            })
    }, [selectMode]);

    const selectEvent = (ev: Event) => {
        const index = selected.indexOf(ev);
        if(index == -1) 
            setSelected(events => [...events, ev]);
        else {
            let newSel = selected.copyWithin(0, 0);
            newSel.splice(index, 1);
            setSelected(newSel);
        }
    }

    const cancelSelect = () => {
        setSelectMode(false);
        setSelected([]);
        console.log("Abbrechen:", selected);
    }

    const deleteSelEvents = () => {
        console.log(selected);
        deleteEvents(selected)
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                console.error("Something went wrong while deleting events.", error);
            });
        setSelectMode(false);
        setSelected([]);
    }

    for(const event of events){
        eventCards.push(
            <div style={{display: "flex"}}>
                {selectMode ? 
                    <input className="eventCard-check" type="checkbox" onChange={() => selectEvent(event)} /*style={{visibility: selectMode ? "visible" : "hidden"}}*//>
                    : ""
                }
                <EwEventCard event={event}/>
            </div>
        );
    }

    return(
        <div>
            <div className="summaryTitle">
                <span>Übersicht über alle Events</span>
                {selectMode ? "" : <button id="btn-select" onClick={() => setSelectMode(true)}>Auswählen</button>}
            </div>
            <div className="cardSection">
                {eventCards}
            </div>
            {selectMode ?
                <div className="footer-buttons">
                    <button id="btn-delete" onClick={() => deleteSelEvents()}>Löschen</button>
                    <button id="btn-cancel" onClick={() => cancelSelect()}>Abbrechen</button>
                </div>
                : ""
            }
        </div>
    )
}

export {
    EwSummary
}