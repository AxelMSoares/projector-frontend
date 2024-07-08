import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { login } from '../../../api/login';
import Cookies from 'js-cookie';
import { checkEmailFormat, checkPasswordFormat } from '../../../helpers/functions';

function LoginForm({ onConnect }) {

  const location = useLocation();
  const [newUserMsg, setNewUserMsg] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [message, setMessage] = useState({class: '', content: ''});
  
  
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
        setMessage('');
      }, 300000);
    }
  }, [loginAttempts]);

  async function onLoginFormSubmitHandler(e) {
    e.preventDefault();

    const honeyBot = document.getElementById('username').value;

    // If the honeyBot is filled, it means that the form has been filled by a bot
    if (honeyBot.length > 0) {
      setMessage({class:'success', content:'Bienvenue! Vous êtes maintenant connecté.'});
      return;
    }

    const loginData = {
      email: document.getElementById('email').value,
      pwd: document.getElementById('pwd').value,
    };

    // If the email or the password is empty, display an error message
    if (!loginData.email || !loginData.pwd) {
      setMessage({class:'error', content:'Veuillez remplir tous les champs.'});
      return;
    }

    // If the email is not valid, display an error message
    if (!checkEmailFormat(loginData.email)) {
      setMessage({class:'error', content:'Format d\'adresse email invalide.'});
      return;
    }


    // If the user has tried to log in 4 times, block the login for 4 minutes
    if (loginAttempts >= 4) {
      setMessage({class:'error', content:'Vous avez dépassé le nombre de tentatives de connexion autorisées, réessayez dans 5 minutes.'});
      return;
    }
    
    // Get the respose data and the token
    const response = await login(loginData);


    // If the login failed, increment the loginAttempts and display an error message
    if (response.message == 'Login failed') {
      setLoginAttempts(loginAttempts + 1);
      setMessage({class: 'error', content:'Adresse email et/ou mot de passe incorrects.'});
      return;
    }

    // Get the jwt token
    const responseJwt = response.jwtoken;

    // Get the csrfToken
    const csrfToken = response.csrfToken;

    // Reset the loginAttempts
    setLoginAttempts(0);

    // Save the token and the user data in the the cookies
    Cookies.set('jwt', responseJwt);
    Cookies.set('userData', JSON.stringify(response));
    Cookies.set('csrfToken', csrfToken);

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
        <label htmlFor="email" className='email-label'>Adresse email:</label>
        <input type="email" id="email" />
        <label htmlFor="pwd" className='pwd-label'>Mot de passe:</label>
        <input type="password" id="pwd" name="pwd" />
        <button type="submit" onClick={onLoginFormSubmitHandler}>Se Connecter</button>
        {message && message.content.length > 0 ? <div className={message.class}>{message.content}</div> : null}
        <Link className="sign-up-link" to="/inscription"><p>S'inscrire</p></Link>
      </form>
    </main>
  )
}

export default LoginForm;