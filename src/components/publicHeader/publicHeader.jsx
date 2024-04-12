import { Link } from 'react-router-dom';

function PublicHeader() {
    return (
        <header>
            <nav className="nav-bar">
                <div className="header-container">
                    <div className="nav-bar-left">
                        <ul>
                            <li>
                                <Link to="/">
                                    <p id="logo-link">Projector</p>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="nav-bar-right">
                        <ul>
                            <li id="sign-up-btn"><Link className="page-link" to="/inscription">S'inscrire</Link></li>
                            <li id="sign-in-btn"><Link className="page-link" to="/connexion">Se Connecter</Link></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default PublicHeader;