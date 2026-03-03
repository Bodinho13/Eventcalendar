import axios from "axios";
import type { Event } from "../../shared/src/event"; 
import { formatDateDB } from "../utils/useCalender";

const getAllEvents = (): Promise<Event[]> => {
    return axios.get<Event[]>('http://localhost:8080/events')
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error("There was an error fetching the events.", error);
            return [];
        });
}

const getEventById = (id: string): Promise<Event> => {
    return axios.get<Event>(`http://localhost:8080/events/${id}`)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error("There was an error fetching the event with the id: " + id, error);
            return error;
        });
}

const getEventsInPeriod = (startDate: Date, endDate: Date): Promise<Event[]> => {
    return axios.get<Event>('http://localhost:8080/events/range', {params: {start: formatDateDB(startDate), end: formatDateDB(endDate)}})
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error("There was an error fetching events in the period "+ startDate + " - " + endDate , error);
            return error;
        })
}

const createNewEvent = (newEvent: Event): Promise<Response> => {
    return axios.post('http://localhost:8080/events', newEvent)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.error("There was an error creating a new event.", error);
            return error;
        });
}

const updateEvent = (event: Event): Promise<Response> => {
    const url = "http://localhost:8080/events/" + event.id;
    console.log(event, url);
    return axios.put(`http://localhost:8080/events/${event.id}`, event)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.error("There was an error updating the event.", error);
            return error;
        })
}

export {
    getAllEvents,
    getEventById,
    getEventsInPeriod,
    createNewEvent,
    updateEvent
}