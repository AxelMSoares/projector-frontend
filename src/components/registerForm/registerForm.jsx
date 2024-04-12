import { Link } from 'react-router-dom';

function RegisterForm() {
    return (
        <main>
            <div>
                <form className="register-field" action="" method="post">
                    <h1>Inscription</h1>
                    <label for="username">Utilisateur:</label>
                    <input type="text" id="username" name="username" />
                    <div className="side-inputs">
                        <div>
                            <label for="email">Email:</label>
                            <input type="email" name="email" id="email" />
                        </div>
                        <div>
                            <label for="email-confirm">Confirmation email:</label>
                            <input type="email" name="email-confirm" id="email-confirm" />
                        </div>
                    </div>
                    <div className="side-inputs">
                        <div>
                            <label for="pwd">Mot de passe:</label>
                            <input type="password" id="pwd" name="pwd" />
                        </div>
                        <div>
                            <label for="pwd-confirm">Confirmation mot de passe:</label>
                            <input type="password" id="pwd-confirm" name="pwd-confirm" />
                        </div>
                        <div className="pwd-recommendations">
                            <p>Le mot de passe doit contenir au moins 8 caractères dont:</p>
                            <ul>
                                <li>Au moins une lettre minuscule</li>
                                <li>Au moins une lettre majuscule</li>
                                <li>Au moins un caractère spécial</li>
                                <li>Au moins un chiffre</li>
                            </ul>
                        </div>
                    </div>
                    <div className="checkbox-input">
                        <input type="checkbox" id="cgu" name="cgu" />
                        <label for="cgu">J'accepte la politique d'utilisation</label>
                    </div>
                    <button type="submit">S'inscrire</button>
                    <Link to="/connexion">Déjà un compte? Se connecter</Link>
                </form>
            </div>
        </main>
    )
}

export default RegisterForm;