import { useState } from "react";
import { Link } from 'react-router-dom';

function NavMenu() {

    const [menuDisplay, setMenuDisplay] = useState(false);

    return (
        <>
            <nav className="responsive-nav-menu">
                <div className="responsive-list-menu">
                    <div className="list-icon" onClick={() => setMenuDisplay(!menuDisplay)}>
                        {menuDisplay ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="x-square" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                            </svg>
                            : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="list" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
                            </svg>}
                    </div>
                    <ul className={menuDisplay ? "show" : "hide"}>
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