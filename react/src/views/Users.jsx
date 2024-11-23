import { useEffect, useState } from "react";
import axiosClient from "../axios-client";

function Users() {
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUsers();
    }, [])

    const getUsers = () => {
        setLoading(false);
        axiosClient.get('/users')
        .then(({data}) => {
            // setUsers(data);
            console.log(data);
        })
        .catch(() => {
            setLoading(false)
        })
    }

    return (
        <div>
            Users
        </div>
    );
}

export default Users;
