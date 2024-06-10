import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

function UsersHeader({ onConnect, userData }) {

	const [data, setData] = useState(userData);

	useEffect(() => {
		setData(userData);
	}, [userData]);

	const onLogoutHandler = (e) => {
		e.preventDefault();
		onConnect(false);
		// Destroy the cookies
		Cookies.remove('jwt', { path: '/' });
		Cookies.remove('userData', { path: '/' });
		// Redirect to the home page
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
						<li><Link className="page-link" to="/projets/participations">Mes participations</Link> </li>
					</ul>
				</div>
				<div className="nav-bar-right">
					<ul>
						<li><Link className="username-view" to={"/utilisateur/" + data['username']}><img className="profile-picture" src={userData.profilePicture != null ? userData.profilePicture : "/images/avatar-neutre.png" } /> <span>{ data['username'] }</span> </Link></li>
						<li id="logout-btn"><button onClick={onLogoutHandler}>Se Deconnecter</button></li>
					</ul>
				</div>
			</div>
		</nav>
	</header>
    )
}

export default UsersHeader;
