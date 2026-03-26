import type { Event } from "../../shared/src/event";
import { formatDateGerman } from "../utils/useSummary";
import {useNavigate} from "react-router-dom";

const EwEventCard = (props: any) => {
    const event: Event = props.event;

    const navigate = useNavigate();

    return (
        <div className="eventCard">
            <span className="eventCard-title">{event.eventName}</span>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <table className="cardInfo">
                    <tbody>
                        <tr>
                            <td>Wann:</td>
                            <td>{formatDateGerman(new Date(event.date))} {event.startTime}</td>
                        </tr>
                        <tr>
                            <td>Wo:</td>
                            <td>{event.location}</td>
                        </tr>
                        <tr>
                            <td>Host:</td>
                            <td>{event.host}</td>
                        </tr>
                    </tbody>
                </table>
                <span style={{fontSize: "40px"}} onClick={() => navigate(`/event/${event.id}`)}>{"〉"}</span>
            </div>
        </div>
    )
}

export {
    EwEventCard
}