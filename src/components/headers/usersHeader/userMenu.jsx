import { useState } from "react"
import { Link } from 'react-router-dom';

function UserMenu({ userData, onDisconnect }) {

    const [data, setData] = useState(userData);
    const [menuDisplay, setMenuDisplay] = useState(false);

    return (
        <div className="responsive-user-menu">
            <div className="responsive-icon-btn" onClick={() => setMenuDisplay(!menuDisplay)}>
                {menuDisplay ?
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="x-square" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                    </svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="person-fill" viewBox="0 0 16 16">
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                    </svg>
                    }
            </div>
            <ul className={menuDisplay ? "show" : "hide"}>
                <li>
                    <img className="profile-picture" src={data && data['profilePicture'] ? data['profilePicture'] : "/images/avatar-neutre.png"} alt="photo de profil de l'utilisateur"/>
                    <Link to={data ? "/utilisateur/" + data['username'] : null} className="username-view">{data && data['username']}</Link>
                </li>
                <li className="logout-btn">
                    <button onClick={onDisconnect}>Se Deconnecter</button>
                </li>
            </ul>
        </div>
    )
}

export default UserMenu;
