import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import { useEffect } from "react";
import axiosClient from "../axios-client";

export default function DefaultLayout() {
    const { user, token, setUser, setToken, notification } = useStateContext();

    if (!token) {
        return <Navigate to="/login" />;
    }

    const onLogout = (e) => {
        e.preventDefault();
        axiosClient.post("/logout").then(() => {
            setUser({});
            setToken(null);
        });
    };

    useEffect(() => {
        axiosClient.get("/user").then(({ data }) => {
            setUser(data);
        });
    }, []);

    return (
        <div id="defaultLayout">
            <aside>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/users">User</Link>
            </aside>
            <div className="content">
                <header>
                    <div>Laravel With React Application</div>
                    <div>
                        {user.name}
                        &nbsp;
                        &nbsp;
                        <a href="#" className="btn-logout" onClick={onLogout}>
                            Logout
                        </a>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
            </div>
            {notification && <div className="notification">{notification}</div>}
        </div>
    );
}
