import { Link } from 'react-router-dom';
import { useState } from 'react';

function PublicHeader() {
    const [menuDisplay, setMenuDisplay] = useState(false);

    return (
        <header>
            <nav className="nav-bar">
                <div className="header-container">
                    <div className="public-nav-bar-left">
                        <ul>
                            <li>
                                <Link to="/">
                                    <img src="/images/projector_logo.png" id="logo-link" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="public-nav-bar-right">
                        <div className="responsive-icon-btn" onClick={() => setMenuDisplay(!menuDisplay)}>
                            {menuDisplay ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="x-square" viewBox="0 0 16 16">
                                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                </svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="person-fill" viewBox="0 0 16 16">
                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                </svg>} 
                        </div>
                        <ul className="desktop">
                            <li id="sign-up-btn"><Link className="page-link" to="/inscription">S'inscrire</Link></li>
                            <li id="sign-in-btn"><Link className="page-link" to="/connexion">Se connecter</Link></li>
                        </ul>
                        <ul className={menuDisplay ? "show" : "hide"}>
                            <li><Link className="sign-up" to="/inscription">S'inscrire</Link></li>
                            <li><Link className="sign-in" to="/connexion">Se connecter</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default PublicHeader;