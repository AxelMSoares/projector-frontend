import { useState } from "react";
import { Link } from 'react-router-dom';

function NavMenu() {

    const [menuDisplay, setMenuDisplay] = useState(false);

    return (
        <>
            <nav className="responsive-nav-menu">
                <div className="responsive-list-menu">
                    <div className="list-icon" onClick={() => setMenuDisplay(true)}>
                        <p>Menu</p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="list" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                        </svg>
                    </div>
                    <ul className={menuDisplay ? "show-nav-menu" : "hide-nav-menu"}>
                        <li><button onClick={() => setMenuDisplay(false)}>Fermer</button></li>
                        <li><Link className="page-link" to="/nouveau-projet">Nouveau Projet</Link></li>
                        <li><Link className="page-link" to="/mes-projets">Mes Projets</Link></li>
                        <li><Link className="page-link" to="/projets/participations">Mes participations</Link> </li>
                    </ul>
                </div>
            </nav>
        </>
    );
}

export default NavMenu;
