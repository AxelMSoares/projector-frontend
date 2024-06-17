import Cookies from 'js-cookie';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { login } from '../../../api/login';
import { useCSRFToken } from '../../../context/CSRFTokenContext';

function LoginForm({ onConnect }) {

  const location = useLocation();
  const [newUserMsg, setNewUserMsg] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const csrfToken = useCSRFToken();
  
  // Id the user is already logged in, redirect to the homepage
  if (Cookies.get('jwt') && Cookies.get('userData')) {
    window.location.href = '/';
    return null;
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const registerSuccess = searchParams.get('success');
    if (registerSuccess) {
      setNewUserMsg('Inscription réussie, veuillez vous connecter');
      // Erase the message after 10 seconds
      const timer = setTimeout(() => {
        setNewUserMsg('');
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [location.search]);

  // If the user has tried to log in 4 times, block the login for 5 minutes
  useEffect(() => {
    if (loginAttempts >= 4) {
      // After 5 minutes, reset the loginAttempts and the timeToWait
      setTimeout(() => {
        setLoginAttempts(0);
        setErrorMessage('');
      }, 300000);
    }
  }, [loginAttempts]);

  async function onLoginFormSubmitHandler(e) {
    e.preventDefault();

    const honeyPot = document.getElementById('login-mail').value;

    // If the honeyPot is filled, it means that the form has been filled by a bot
    if (honeyPot.length > 0) {
      setErrorMessage('Mot de passe ou nom d\'utilisateur incorrect.');
      return;
    }

    const loginData = {
      username: document.getElementById('username').value,
      pwd: document.getElementById('pwd').value,
    };

    // If the username or the password is empty, display an error message
    if (!loginData.username || !loginData.pwd) {
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }

    // Get the respose data and the token
    const response = await login(loginData, csrfToken);

    // If the user has tried to log in 4 times, block the login for 4 minutes
    if (loginAttempts >= 4) {
      setErrorMessage('Vous avez dépassé le nombre de tentatives de connexion autorisées, réessayez dans 5 minutes.');
      return;
    }

    // If the login failed, increment the loginAttempts and display an error message
    if (response.message == 'Login failed') {
      setLoginAttempts(loginAttempts + 1);
      setErrorMessage('Nom d\'utilisateur ou mot de passe incorrect.');
      return;
    }

    // If the login is successful, get the token
    const responseJwt = response.token;
    
    // Reset the loginAttempts
    setLoginAttempts(0);

    // Save the token and the user data in the client cookies
    Cookies.set('jwt', responseJwt);
    Cookies.set('userData', JSON.stringify(response));

    // Update the state of the parent component
    onConnect(true);

    // Redirect to projects page  
    if (response) {
      window.location.href = '/';
    }
  }

  return (
    <main>
      {newUserMsg ? <div className='success'>{newUserMsg}</div> : null}
      <form className="login-field" action="" method="post">
        <h1>Connexion</h1>
        <label htmlFor="username" className='username-label'>Utilisateur:</label>
        <input type="text" id="username" name="username" />
        <label htmlFor="pwd" className='pwd-label'>Mot de passe:</label>
        <input type="password" id="pwd" name="pwd" />
        <label htmlFor="login-mail" className='email-label'>Adresse mail:</label>
        <input type="email" id="login-mail" />
        <button type="submit" onClick={onLoginFormSubmitHandler}>Se Connecter</button>
        {errorMessage ? <div className='error'>{errorMessage}</div> : null}
        <Link className="sign-up-link" to="/inscription"><p>S'inscrire</p></Link>
      </form>
    </main>
  )
}

export default LoginForm;