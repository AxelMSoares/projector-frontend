import { Link } from 'react-router-dom';
import { useState } from 'react';
import { checkPasswordMatch, checkPasswordFormat, checkEmailFormat } from '../../../helpers/functions.js';
import { cleanString } from '../../../helpers/functions.js';
import { createNewUser } from '../../../api/createNewUser.js';
import { useCSRFToken } from '../../../context/CSRFTokenContext.jsx';
import Cookies from 'js-cookie';
import DOMPurify from 'dompurify';

function RegisterForm() {

    const [errorMsg, setErrorMsg] = useState([]);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [pwdConfirm, setPwdConfirm] = useState('');
    const [cgu, setCgu] = useState(false);
    const [rgpd, setRgpd] = useState(false);
    const [errorFields, setErrorFields] = useState({});
    const csrfToken = useCSRFToken();

    // If the user is already connected, redirect to the home page
    if (Cookies.get('jwt') && Cookies.get('userData')) {
        window.location.href = '/';
        return null;
    }

    // Function to check if the password have a number
    function hasNumber(myString) {
        return /\d/.test(myString);
    }

    // Function to check if the password have a lowercase letter
    function hasLowerCase(myString) {
        return /[a-z]/.test(myString);
    }

    // Function to check if the password have an uppercase letter
    function hasUpperCase(myString) {
        return /[A-Z]/.test(myString);
    }

    // Function to check if the password have a special character
    function hasSpecialCharacter(myString) {
        return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(myString);
    }

    // Check if the the password have 8 characters
    function hasEightCharacters(myString) {
        return myString.length >= 8;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMsg([]);
        setErrorFields({});

        // Get the form data
        const formData = {
            username: username,
            email: email,
            pwd: pwd,
            pwdConfirm: pwdConfirm,
            cgu: cgu,
            rgpd: rgpd
        }

        // If one of the fields is empty, return an error
        if (!cleanString(formData.username) || !formData.email || !formData.pwd || !formData.pwdConfirm) {
            const errorGen = 'Veuillez remplir tous les champs.';
            setErrorMsg(prevErrors => [...prevErrors, errorGen]);
            return;
        }

        // If the username is less than 3 characters, return an error
        if (formData.username.length < 3) {
            setErrorMsg(prevErrors => [...prevErrors, 'Le nom d\'utilisateur doit contenir au moins 3 caractères.']);
            setErrorFields(prevErrors => ({ ...prevErrors, username: true }));
            return;
        }

        // If the username have special characters, return an error
        if (!/^[a-zA-Z0-9_]*$/.test(formData.username)) {
            setErrorMsg(prevErrors => [...prevErrors, 'Le nom d\'utilisateur ne doit pas contenir de caractères spéciaux.']);
            setErrorFields(prevErrors => ({ ...prevErrors, username: true }));
            return;
        }

        // Check the email format
        if (!checkEmailFormat(formData.email)) {
            const errorEmailFormat = 'Le format de l\'adresse email est invalide.';
            setErrorMsg(prevErrors => [...prevErrors, errorEmailFormat]);
            setErrorFields(prevErrors => ({ ...prevErrors, email: true }));
            return;
        }

        // Check if the password format is correct
        if (!checkPasswordFormat(formData.pwd) || !checkPasswordFormat(formData.pwdConfirm)) {
            const errorPwdFormat = 'Le format du mot de passe est invalide.';
            setErrorMsg(prevErrors => [...prevErrors, errorPwdFormat]);
            setErrorFields(prevErrors => ({ ...prevErrors, pwd: true }));
            return;
        }

        // Check if the password and the confirmation password match
        if (checkPasswordMatch(formData.pwd, formData.pwdConfirm) === false) {
            const errorPwd = 'Les mots de passe ne correspondent pas';
            setErrorMsg(prevErrors => [...prevErrors, errorPwd]);
            setErrorFields(prevErrors => ({ ...prevErrors, pwdConfirm: true }));
            return;
        }

        // Check if the user accepted the terms of use
        if (!formData.cgu) {
            const errorCgu = 'Vous devez accepter les conditions d\'utilisation pour pouvoir utiliser nos services.';
            setErrorMsg(prevErrors => [...prevErrors, errorCgu]);
            setErrorFields(prevErrors => ({ ...prevErrors, cgu: true }));
            return;
        }

        if(!formData.rgpd){
            const errorCgu = 'Vous devez accepter la RGPD pour pouvoir utiliser nos services.';
            setErrorMsg(prevErrors => [...prevErrors, errorCgu]);
            setErrorFields(prevErrors => ({ ...prevErrors, cgu: true }));
            return;
        }

        // If there are errors, return
        if (errorMsg.length > 0) {
            return;
        }

        // Create the user object
        const validatedForm = {
            username: DOMPurify.sanitize(formData.username),
            email: formData.email.toLowerCase(),
            pwd: formData.pwd,
            cgu: 1
        }

        // Send the data to the backend
        const response = await createNewUser(validatedForm, csrfToken);

        // Get the response and if the user was created, redirect to the login page
        if (response && response.ok) {
            Cookies.set('newUserMsg', "Compte créé avec succès! Vous pouvez dès à present vous connecter.");
            window.location.href = '/connexion?success=true';
        } else {
            const errorCreatingUser = 'Erreur lors de la création de l\'utilisateur';
            setErrorMsg(prevErrors => [...prevErrors, response.error || errorCreatingUser]);

            if (response.error === 'Ce pseudo est déjà utilisé. Merci de choisir un autre.') {
                setErrorFields(prevErrors => ({ ...prevErrors, username: true }));
            }

            if (response.error === 'Cette adresse email est déjà utilisée.') {
                setErrorFields(prevErrors => ({ ...prevErrors, email: true }));
            }

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
                    <div className="side-inputs">
                        <div>
                            <label className={errorFields && errorFields.username ? "error-text" : null}>Pseudo:
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={errorFields && errorFields.username ? "errorfield" : null}
                                />
                            </label>
                        </div>
                        <div>
                            <label className={errorFields && errorFields.email ? "error-text" : null}>Email:
                                <input
                                    type="text"
                                    name="email"
                                    id="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={errorFields && errorFields.email ? "errorfield" : null}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="side-inputs">
                        <div>
                            <label className={errorFields && errorFields.pwd ? "error-text" : null} >Mot de passe:
                                <input
                                    type="password"
                                    id="pwd"
                                    name="pwd"
                                    onChange={(e) => setPwd(e.target.value)}
                                    className={errorFields && errorFields.pwd ? "errorfield" : null}
                                />
                            </label>
                        </div>
                        <div>
                            <label className={errorFields && errorFields.pwdConfirm ? "error-text" : null} >Confirmation mot de passe:
                                <input
                                    type="password"
                                    id="pwd-confirm"
                                    name="pwd-confirm"
                                    onChange={(e) => setPwdConfirm(e.target.value)}
                                    className={errorFields && errorFields.pwdConfirm ? "errorfield" : null}
                                />
                            </label>
                        </div>
                        <div className="pwd-recommendations">
                            <p>Le mot de passe doit être composé de:</p>
                            <div>
                                <ul>
                                    <li className={pwd.length > 0 ? (hasLowerCase(pwd) ? "success-text" : 'error-text') : null}>Au moins une lettre minuscule</li>
                                    <li className={pwd.length > 0 ? (hasUpperCase(pwd) ? "success-text" : 'error-text') : null}>Au moins une lettre majuscule</li>
                                    <li className={pwd.length > 0 ? (hasNumber(pwd) ? "success-text" : 'error-text') : null}>Au moins un chiffre</li>
                                    <li className={pwd.length > 0 ? (hasSpecialCharacter(pwd) ? "success-text" : 'error-text') : null}>Au moins un caractère spécial</li>
                                    <li className={pwd.length > 0 ? (hasEightCharacters(pwd) ? "success-text" : 'error-text') : null}>Au moins 8 caractères</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="checkbox-input">
                        <input type="checkbox" id="rgpd" name="rgpd" onChange={(e) => setRgpd(!rgpd)} className={errorFields && errorFields.cgu ? "errorfield" : null}/>
                        <p>
                            J'accepte la RGPD (Règlementation Générale sur la Protection des Données)
                        </p>
                    </div>
                    <div className="checkbox-input">
                        <input type="checkbox" id="cgu" name="cgu" onChange={(e) => setCgu(!cgu)} className={errorFields && errorFields.cgu ? "errorfield" : null} />
                        <p onClick={(e) => redirectToPrivacyPolicy()}>
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