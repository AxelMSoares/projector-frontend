import { Link } from 'react-router-dom';

function UsersHeader() {
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
						<li> Bienvenue: <span className="username-view"> User </span></li>
						<li id="logout-btn"><a className="page-link" href="">Se Deconnecter</a></li>
					</ul>
				</div>
			</div>
		</nav>
	</header>
    )
}

export default UsersHeader;