import React, { useEffect, useState } from "react";
import { EwLabelInputBox } from "./EwLabelInputBox";
import { getEventById, createNewEvent, updateEvent } from "../handlers/ewEventHandler";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import type { Event } from "../../shared/src/event";
import { formatDateDB } from "../utils/useCalendar";


const EwEventForm = () => {

    const [event, setEvent] = useState<Event>({
        id: "",
        eventName: "",
        host: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        eventCategory: "",
        entryFee: 0,
        additionalInfo: "",
        extras: []
    });
    
    const navigate = useNavigate();

    const {eventId} = useParams<{ eventId: string }>();

    const [searchParams] = useSearchParams();
    const eventDate: string | null = searchParams.get("date");

    useEffect (() => {
        if(eventId) {
            getEventById(eventId)
                .then((res) => {    
                    if(res) 
                        setEvent(res);
                    console.log(res);
                })
                .catch((error) => {
                    console.error("Das Event konnte nicht geladen werden.", error);
                });
        } else {
            if(eventDate){
                const d = new Date(eventDate);
                setEvent(values => ({...values, date: formatDateDB(d)}));
            }
        }
    }, [eventId]);

    const changeEventData = (e: React.ChangeEvent) => {
        const target = e.target as HTMLFormElement;
        const name: string = target.name;
        const value: any = target.value;
        
        setEvent(values => ({...values, [name]: value}))
    }

    const changeExtras = (e: React.ChangeEvent) => {
        const target = e.target as HTMLFormElement;
        const name: string = target.name;

        let extras = event.extras;
        if (extras.indexOf(name) > -1) {
            extras.splice(extras.indexOf(name, 0), 1);
        } else {
            extras.push(name);
        }
        setEvent(values => ({...values, extras: extras}))
        console.log(event);
    }

    const onCreate = async (e: React.SubmitEvent) => {
        console.log(e, event);
        e.preventDefault();

        const res = await createNewEvent(event);
        if(res.status == 201){
            navigate("/calendar");
        }
    }

    const onUpdate = async (e: React.SubmitEvent) => {
        console.log(e, event);
        e.preventDefault();

        const res = await updateEvent(event);
        if(res.status == 200){
            navigate("/calendar");
        }
    }

    return(
        <div>
            <h2>{eventId ? "Event bearbeiten" : "Neues Event anlegen"}</h2>
            <form onSubmit={eventId? onUpdate : onCreate}>
                <EwLabelInputBox labelVal="Name des Events:" inputName="eventName" inputVal={event?.eventName} 
                    handleChange={(e: React.ChangeEvent) => changeEventData(e)} required={true} />

                <EwLabelInputBox labelVal="Veranstalter:" inputName="host" inputVal={event?.host} 
                    handleChange={(e: React.ChangeEvent) => changeEventData(e)} required={true} />

                <EwLabelInputBox labelVal="Datum:" inputName="date" inputVal={event?.date} 
                    handleChange={(e: React.ChangeEvent) => changeEventData(e)} inputType="date" required={true} />
                    
                <EwLabelInputBox labelVal="Startzeit:" inputName="startTime" inputVal={event?.startTime} 
                    handleChange={(e: React.ChangeEvent) => changeEventData(e)} inputType="time" required={true} />
                
                <EwLabelInputBox labelVal="Ende:" inputName="endTime" inputVal={event?.endTime} 
                    handleChange={(e: React.ChangeEvent) => changeEventData(e)} inputType="time" />

                <EwLabelInputBox labelVal="Ort:" inputName="location" inputVal={event?.location} 
                    handleChange={(e: React.ChangeEvent) => changeEventData(e)} />

                <EwLabelInputBox labelVal="Kategorie:" inputName="eventCategory" inputVal={event?.eventCategory} 
                    handleChange={(e: React.ChangeEvent) => changeEventData(e)} />

                <EwLabelInputBox labelVal="Eintritt:" inputName="entryFee" inputVal={event?.entryFee} 
                    handleChange={(e: React.ChangeEvent) => changeEventData(e)} inputType="number" required={true} min={0} step="0.01" />
                
                <EwLabelInputBox labelVal="Weitere Infos:" inputName="additionalInfo" inputVal={event?.additionalInfo} 
                    handleChange={(e: React.ChangeEvent) => changeEventData(e)} inputType="textarea" />
                
                <label className="ew-label">
                    <span className="ew-label-text">Extras:</span>
                    <input className="ew-input-check" type="checkbox" name="comedyshow" onChange={e => changeExtras(e)} checked={event.extras.indexOf("comedyshow") > -1}/> Comedy-Show
                    <input className="ew-input-check" type="checkbox" name="darts" onChange={e => changeExtras(e)} checked={event.extras.indexOf("darts") > -1}/> Darts
                    <input className="ew-input-check" type="checkbox" name="dj" onChange={e => changeExtras(e)} checked={event.extras.indexOf("dj") > -1}/> DJ
                </label>
                <label className="ew-label">
                    <span className="ew-label-text"></span>
                    <input className="ew-input-check" type="checkbox" name="drivingService" onChange={e => changeExtras(e)} checked={event.extras.indexOf("drivingService") > -1}/> Fahrservice
                    <input className="ew-input-check" type="checkbox" name="grill" onChange={e => changeExtras(e)} checked={event.extras.indexOf("grill") > -1}/> Grill
                    <input className="ew-input-check" type="checkbox" name="kicker" onChange={e => changeExtras(e)} checked={event.extras.indexOf("kicker") > -1}/> Kicker
                </label>
                <label className="ew-label">
                    <span className="ew-label-text"></span>
                    <input className="ew-input-check" type="checkbox" name="livemusic" onChange={e => changeExtras(e)} checked={event.extras.indexOf("livemusic") > -1}/> Live-Musik
                    <input className="ew-input-check" type="checkbox" name="pizza" onChange={e => changeExtras(e)} checked={event.extras.indexOf("pizza") > -1}/> Pizza
                    <input className="ew-input-check" type="checkbox" name="dancefloor" onChange={e => changeExtras(e)} checked={event.extras.indexOf("dancefloor") > -1}/> Tanzfläche
                </label>
                <label className="ew-label">
                    <span className="ew-label-text"></span>
                    <input className="ew-input-check" type="checkbox" name="tea" onChange={e => changeExtras(e)} checked={event.extras.indexOf("tea") > -1}/> Tee-Stand
                    <input className="ew-input-check" type="checkbox" name="waffles" onChange={e => changeExtras(e)} checked={event.extras.indexOf("waffles") > -1}/> Waffel-Stand
                </label>
                <input type="submit" value={eventId ? "Speichern" : "Erstellen"} />
            </form>
        </div>
    )
}
//TODO: Kategorie --> selectbox

export {
    EwEventForm
}