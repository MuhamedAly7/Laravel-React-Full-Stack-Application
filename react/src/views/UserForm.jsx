import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";

export default function UserForm() {
    const { id } = useParams();
    const [user, setUser] = useState({
        id: null,
        name: "",
        email: "",
        password: "",
        password_Confirmation: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate();
    const { setNotification } = useStateContext();

    const onSubmit = (e) => {
        e.preventDefault();
        if (user.id) {
            axiosClient
                .put(`/users/${user.id}`, user)
                .then(() => {
                    setNotification("User was successfully created");
                    navigate("/users");
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        } else {
            axiosClient
                .post(`/users`, user)
                .then(() => {
                    setNotification("User was successfully updated");
                    navigate("/users");
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                });
        }
    };

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        axiosClient
            .get(`/users/${id}`)
            .then(({ data }) => {
                setLoading(false);
                setUser(data);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [id]);

    return (
        <>
            {user.id && <h1>Update User: {user.name}</h1>}
            {!user.id && <h1>Create New User</h1>}
            <div className="card animated fadeInDown">
                {loading && <div className="text-center">Loading...</div>}
                {errors && (
                    <div className="alert">
                        {Object.keys(errors).map((key) => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                )}
                {!loading && (
                    <form onSubmit={onSubmit}>
                        <input
                            onChange={(e) =>
                                setUser({ ...user, name: e.target.value })
                            }
                            value={user.name}
                            placeholder="Name"
                        />
                        <input
                            type="email"
                            onChange={(e) =>
                                setUser({ ...user, email: e.target.value })
                            }
                            value={user.email}
                            placeholder="Email"
                        />
                        <input
                            type="password"
                            onChange={(e) =>
                                setUser({ ...user, password: e.target.value })
                            }
                            placeholder="Password"
                        />
                        <input
                            type="password"
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    password_Confirmation: e.target.value,
                                })
                            }
                            placeholder="Password Confirmation"
                        />
                        <button type="submit" className="btn">
                            Save
                        </button>
                    </form>
                )}
            </div>
        </>
    );
}
