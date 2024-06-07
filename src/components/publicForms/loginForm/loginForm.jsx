import Cookies from 'js-cookie';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { login } from '../../../api/login';

function LoginForm({ onConnect }) {

  const location = useLocation();
  const [newUserMsg, setNewUserMsg] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  

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

    const loginData = {
      username: document.getElementById('username').value,
      pwd: document.getElementById('pwd').value
    };

    // Get the respose data and the token
    const response = await login(loginData);

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

    const responseJwt = response.token;
    
    // Reset the loginAttempts
    setLoginAttempts(0);

    // Save the token in a cookie and the data in the client cookie
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
    <div>
      {newUserMsg ? <div className='success'>{newUserMsg}</div> : null}
      <form className="login-field" action="" method="post">
        <h1>Connexion</h1>
        <label htmlFor="username">Utilisateur:</label>
        <input type="text" id="username" name="username" />
        <label htmlFor="pwd">Mot de passe:</label>
        <input type="password" id="pwd" name="pwd" />
        <input type="email" id="login-mail" />
        <button type="submit" onClick={onLoginFormSubmitHandler}>Se Connecter</button>
        {errorMessage ? <div className='error'>{errorMessage}</div> : null}
        <Link className="sign-up-link" to="/inscription"><p>S'inscrire</p></Link>
      </form>
    </div>
  )
}

export default LoginForm;