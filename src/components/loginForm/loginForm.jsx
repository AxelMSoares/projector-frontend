import { Link } from 'react-router-dom';

function LoginForm (){
    return (
    <div>
        <form className="login-field" action="" method="post">
            <h1>Connexion</h1>
            <label for="username">Utilisateur:</label>
            <input type="text" id="username" name="username" />
            <label for="pwd">Mot de passe:</label>
            <input type="password" id="pwd" name="pwd" />
            <input type="email" id="login-mail" />
            <button type="submit">Se Connecter</button>
            <Link className="sign-up-link" to="/inscription"><p>S'inscrire</p></Link>
        </form>
    </div>
    )
}

export default LoginForm;