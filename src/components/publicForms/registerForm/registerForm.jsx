import { Link } from 'react-router-dom';
import { useState } from 'react';
import { checkPasswordMatch, checkEmailMatch, checkPasswordFormat } from '../../../helpers/functions.js';
import { cleanString } from '../../../helpers/functions.js';
import { createNewUser } from '../../../api/createNewUser.js';
import Cookies from 'js-cookie';

function RegisterForm() {

    const [errorMsg, setErrorMsg] = useState([]);

    // If the user is already connected, redirect to the home page
    if (Cookies.get('jwt') && Cookies.get('userData')) {
        window.location.href = '/';
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMsg([]);

        // Get the form data
        const formData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            emailConfirm: document.getElementById('email-confirm').value,
            pwd: document.getElementById('pwd').value,
            pwdConfirm: document.getElementById('pwd-confirm').value,
            cgu: document.getElementById('cgu').checked
        }

        // If one of the fields is empty, return an error
        if (!cleanString(formData.username) || !formData.email || !formData.emailConfirm || !formData.pwd || !formData.pwdConfirm) {
            const errorGen = 'Veuillez remplir tous les champs';
            setErrorMsg(prevErrors => [...prevErrors, errorGen]);
            return;
        }

        // Check if the email and the confirmation email match
        if (checkEmailMatch(formData.email, formData.emailConfirm) === false) {
            const errorEmail = 'Les adresses email ne correspondent pas';
            setErrorMsg(prevErrors => [...prevErrors, errorEmail]);
            return;
        }

        // Check if the password and the confirmation password match
        if (checkPasswordMatch(formData.pwd, formData.pwdConfirm) === false) {
            const errorPwd = 'Les mots de passe ne correspondent pas';
            setErrorMsg(prevErrors => [...prevErrors, errorPwd]);

        }

        // Check if the password format is correct
        if (!checkPasswordFormat(formData.pwd)) {
            const errorPwdFormat = 'Le format du mot de passe est invalide';
            setErrorMsg(prevErrors => [...prevErrors, errorPwdFormat]);
        }

        // Check if the user accepted the terms of use
        if (!formData.cgu) {
            const errorCgu = 'Vous devez accepter les conditions d\'utilisation pour pouvoir vous inscrire.';
            setErrorMsg(prevErrors => [...prevErrors, errorCgu]);
        }

        // If there are errors, return
        if (errorMsg.length > 0) {
            return;
        }

        // Create the user object
        const validatedForm = {
            username: formData.username.toLowerCase(),
            email: formData.email.toLowerCase(),
            pwd: formData.pwd,
            cgu: 1
        }

        // Send the data to the backend
        const response = await createNewUser(validatedForm);

        // Get the response and if the user was created, redirect to the login page
        if (response.ok) {
            Cookies.set('newUserMsg', "Compte créé avec succès! Vous pouvez dès à present vous connecter.");
            window.location.href = '/connexion?success=true';
        } else {
            const errorCreatingUser = 'Erreur lors de la création de l\'utilisateur';
            setErrorMsg(prevErrors => [...prevErrors, errorCreatingUser]);
        }

    }

    function redirectToPrivacyPolicy() {
        window.location.href = '/politique-de-confidentialite';
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
                        <input type="checkbox" id="cgu" name="cgu" />
                        <p onClick={(e)=> redirectToPrivacyPolicy()}>
                            J'accepte la politique de confidentialité et les conditions d'utilisation
                        </p>
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