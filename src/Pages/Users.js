import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { useEffect, useState } from "react";
import "./Users.css";

export default function Users({ room }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const usersRef = collection(db, "users");

        // Récupérer les utilisateurs qui ont envoyé un message dans cette room
        const q = query(usersRef, where("room", "==", room));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            let usersList = [];
            snapshot.forEach((doc) => {
                usersList.push(doc.data());
            });
            setUsers(usersList);
        });

        return () => unsubscribe();
    }, [room]);

    return (
        <div className="users-sidebar">
            <h2>Users in {room}</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.uid} className={user.uid === auth.currentUser.uid ? "current-user" : ""}>
                        <img src={user.photoURL} alt={user.name} />
                        {user.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
