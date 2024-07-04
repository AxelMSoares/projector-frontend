import { Link } from "react-router-dom"

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-background">
                <div className="footer-wrapper">
                    <ul>
                        <li><Link className="page-link" to="/politique-de-confidentialite">Politique de confidentialité</Link></li>
                        <li>
                            <div className="icons-field">
                                <a href="http://www.facebook.com" target="_blank"><img src="/icons/facebook.svg" alt="logo facebook"/></a>
                                <a href="http://www.instagram.com" target="_blank"><img src="/icons/instagram.svg" alt="logo instagram"/></a>
                                <a href="http://www.x.com" target="_blank"><img src="/icons/twitter-x.svg" alt="logo twitter / x"/></a>
                                <a href="http://www.discord.com" target="_blank"><img src="/icons/discord.svg" alt="logo discord" /></a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="copyright"><p>Tous droits réservés. Projector Copyright 2024 TM</p></div>
        </footer>
    )
}

export default Footer;