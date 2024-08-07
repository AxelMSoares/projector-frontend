import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserMenu from './userMenu';
import NavMenu from './navMenu';
import Cookies from 'js-cookie';
import DOMPurify from 'dompurify';

function UsersHeader({ onConnect, userData }) {

	const [data, setData] = useState(userData);

	useEffect(() => {
		setData(userData);
	}, [userData]);

	const onLogoutHandler = (e) => {
		e.preventDefault();
		onConnect(false);
		// Destroy the csrf token, the jwt and userData in the Cookies
		Cookies.remove('jwt');
		Cookies.remove('userData');
		Cookies.remove('csrfToken');
		// Redirect to the home page
		window.location.href = '/';
	}

	const onDisconnect = () => {
		onConnect(false);
		// Destroy the csrf token, the jwt and userData in the Cookies
		Cookies.remove('jwt');
		Cookies.remove('userData');
		Cookies.remove('csrfToken');
		// Redirect to the home page
		window.location.href = '/';
	}

	return (
		<header>
			<nav className="nav-bar">
				<div className="header-container">
					<div className="nav-bar-left">
						<Link id="projector-logo" to="/">
							<img src="/images/projector_logo.png" id="logo-link" alt="logo Projector"/>
						</Link>
						<ul className='nav-bar'>
							<li><Link className="page-link" to="/nouveau-projet">Nouveau Projet</Link></li>
							<li><Link className="page-link" to="/mes-projets">Mes Projets</Link></li>
							<li><Link className="page-link" to="/projets/participations">Mes participations</Link> </li>
						</ul>
						<NavMenu />
					</div>
					<div id="middle-logo">
						<Link to="/">
							<img src="/images/projector_logo.png" id="logo-link" alt="logo Projector"/>
						</Link>
					</div>
					<div className="nav-bar-right">
						<ul className="desktop-user-menu">
							<li><Link className="username-view" to={data ? "/utilisateur/" + DOMPurify.sanitize(data['username']) : null}><img className="profile-picture" src={data && data['profilePicture'] ? data['profilePicture'] : "/images/avatar-neutre.png"} alt="photo de profil de l'utilisateur"/> <span>{data && DOMPurify.sanitize(data['username'])}</span> </Link></li>
							<li id="logout-btn"><button onClick={onLogoutHandler}>Se Deconnecter</button></li>
						</ul>
						<UserMenu userData={data} onDisconnect={onDisconnect} />
					</div>
				</div>
			</nav>
		</header>
	)
}

export default UsersHeader;
