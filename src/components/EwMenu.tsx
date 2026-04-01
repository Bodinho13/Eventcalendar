import { NavLink, Outlet } from "react-router-dom"


const EwMenu = () => {


    return (
        <div>
            <main>
                <section className="menu">
                    <NavLink className={"menu-item"} style={({ isActive }) => {
                        return {
                            display: "block",
                            color: isActive ? "red" : "",
                        }
                    }} to={'/calendar'} >
                        Kalender
                    </NavLink>
                    <NavLink className={"menu-item"} style={({ isActive }) => {
                        return {
                            display: "block",
                            color: isActive ? "red" : "",
                        }
                    }} to={'/summary'}>
                        Übersicht Events
                    </NavLink>
                </section>
                <Outlet />
            </main>
        </div>
    )
}

export {
    EwMenu
}