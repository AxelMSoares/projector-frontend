export default function PublicHeader() {
    return (
        <header>
            <nav class="nav-bar">
                <div class="header-container">
                    <div class="nav-bar-left">
                        <ul>
                            <li>
                                <a href="">
                                    <p id="logo-link">Projector</p>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="nav-bar-right">
                        <ul>
                            <li id="sign-up-btn"><a class="page-link" href="">S'inscrire</a></li>
                            <li id="sign-in-btn"><a class="page-link" href="">Se Connecter</a></li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}