import { Link } from 'react-router-dom';

function RegisterForm() {
    return (
        <main>
            <div>
                <form className="register-field" action="" method="post">
                    <h1>Inscription</h1>
                    <label>Utilisateur:
                        <input type="text" id="username" name="username" />
                    </label>
                    <div className="side-inputs">
                        <div>
                            <label>Email:
                                <input type="email" name="email" id="email" />
                            </label>
                        </div>
                        <div>
                            <label>Confirmation email:
                            <input type="email" name="email-confirm" id="email-confirm" />
                            </label>
                        </div>
                    </div>
                    <div className="side-inputs">
                        <div>
                            <label>Mot de passe:
                            <input type="password" id="pwd" name="pwd" />
                            </label>
                        </div>
                        <div>
                            <label>Confirmation mot de passe:
                            <input type="password" id="pwd-confirm" name="pwd-confirm" />
                            </label>
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
                        <label>J'accepte la politique d'utilisation
                        <input type="checkbox" id="cgu" name="cgu" />
                        </label>
                    </div>
                    <button type="submit">S'inscrire</button>
                    <Link to="/connexion">Déjà un compte? Se connecter</Link>
                </form>
            </div>
        </main>
    )
}

export default RegisterForm;