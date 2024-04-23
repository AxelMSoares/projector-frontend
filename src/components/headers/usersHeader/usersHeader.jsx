import { useState } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

function UsersHeader({onConnect}) {

	const [data, setData] = useState(Cookies.get('userData') ? JSON.parse(Cookies.get('userData')) : null);

	// console.log(data['username']);

	const onLogoutHandler = (e) => {
		e.preventDefault();
		// Destroy the cookies
		onConnect(false);
		Cookies.remove('jwt', { path: '/' });
		Cookies.remove('userData', { path: '/' });
		window.location.href = '/';
	}

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
						<li><Link className="page-link" to="/nouveau-projet">Nouveau Projet</Link></li>
						<li><Link className="page-link" to="/mes-projets">Mes Projets</Link></li>
					</ul>
				</div>
				<div className="nav-bar-right">
					<ul>
						<li> Bienvenue: <span className="username-view"> { data['username'] } </span></li>
						<li id="logout-btn"><a className="page-link" href="" onClick={onLogoutHandler}>Se Deconnecter</a></li>
					</ul>
				</div>
			</div>
		</nav>
	</header>
    )
}

export default UsersHeader;