import { Link } from 'react-router-dom';
import { useState } from 'react';
import { checkPasswordMatch, checkEmailMatch, checkPasswordFormat } from '../../helpers/functions.js';
import Cookies from 'js-cookie';

function RegisterForm() {

    const [errorMsg, setErrorMsg] = useState([]);
    const [formValidated, setFormValidated] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMsg([]);

        const formData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            emailConfirm: document.getElementById('email-confirm').value,
            pwd: document.getElementById('pwd').value,
            pwdConfirm: document.getElementById('pwd-confirm').value,
            cgu: document.getElementById('cgu').checked
        }

        if (!formData.username || !formData.email || !formData.emailConfirm || !formData.pwd || !formData.pwdConfirm) {
            const errorGen = 'Veuillez remplir tous les champs';
            setErrorMsg(prevErrors => [...prevErrors, errorGen]);
            return;

        } else {

            if (checkEmailMatch(formData.email, formData.emailConfirm) === false) {
                const errorEmail = 'Les adresses email ne correspondent pas';
                setErrorMsg(prevErrors => [...prevErrors, errorEmail]);
            }

            if (checkPasswordMatch(formData.pwd, formData.pwdConfirm) === false) {
                const errorPwd = 'Les mots de passe ne correspondent pas';
                setErrorMsg(prevErrors => [...prevErrors, errorPwd]);

            } else {

                if (!checkPasswordFormat(formData.pwd)) {
                    const errorPwdFormat = 'Le format du mot de passe est invalide';
                    setErrorMsg(prevErrors => [...prevErrors, errorPwdFormat]);
                }

            }

            if (!formData.cgu) {
                const errorCgu = 'Vous devez accepter les conditions d\'utilisation';
                setErrorMsg(prevErrors => [...prevErrors, errorCgu]);
            }

            if (errorMsg.length > 0) {
                return;

            } else {

                setFormValidated(true);

                const validatedForm = {
                    username: formData.username.toLowerCase(),
                    email: formData.email.toLowerCase(),
                    pwd: formData.pwd,
                    cgu: 1
                }

                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/create`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(validatedForm)
                });

                // Get the respose
                const responseData = await response.json();
                
                if (response.ok) {
                    Cookies.set('newUserMsg', "Compte créé avec succès! Vous pouvez dès à present vous connecter.");
                    window.location.href = '/connexion?success=true';
                } else if (response.status === 400) {
                    setErrorMsg(prevErrors => [...prevErrors, responseData.error]);
                }
            }
        }
    }

    return (
        <main>
            <div>
                <form className="register-field" action="" method="post" onSubmit={handleSubmit}>
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
                        <label>
                            <input type="checkbox" id="cgu" name="cgu" />
                            J'accepte la politique d'utilisation
                        </label>
                    </div>
                    {errorMsg.length > 0 &&
                        <ul className="error">
                            {errorMsg.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    }
                    <button type="submit">S'inscrire</button>
                    <Link to="/connexion">Déjà un compte? Se connecter</Link>
                </form>
            </div>
        </main>
    )
}

export default RegisterForm;