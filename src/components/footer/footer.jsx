import { Link } from "react-router-dom"

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-background">
                <div className="footer-wrapper">
                    <ul>
                        <li><Link className="page-link" to="/politique-de-confidentialite">Politique de confidentialité</Link></li>
                        <li><a href="">Qui Sommes Nous?</a></li>
                        <li><a href="">Des avis? Des idées? Nous contacter</a></li>
                    </ul>
                </div>
            </div>
            <div className="copyright"><p>Tous droits réservés. Projector Copyright 2024 TM</p></div>
        </footer>
    )
}

export default Footer;