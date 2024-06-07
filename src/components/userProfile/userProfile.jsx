import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getUserByUsername } from '../../api/getUserByUsername';
import { updateUser } from '../../api/updateUser';
import { deleteUser } from '../../api/deleteUser';
import { login } from '../../api/login';
import { updateUserPassword } from '../../api/updateUserPassword';
import { checkPasswordFormat } from '../../helpers/functions';
import { formatDate } from '../../helpers/functions';
import { cleanString } from '../../helpers/functions';
import Cookies from 'js-cookie';
import ProfileImageUpload from './profileImageUpload';

export default function UserProfile({ jwt, userData }) {

    // Get the pseudo from the URL
    const { pseudo } = useParams();
    const [user, setUser] = useState(null);
    const [userLoaded, setUserLoaded] = useState(false);
    const [userProfile, setUserProfile] = useState(false);
    const [editing, setEditing] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [ConfNewEmail, setConfNewEmail] = useState('');
    const [newBio, setNewBio] = useState('');
    const [message, setMessage] = useState({ content: '', class: '' });
    const [errorMsg, setErrorMsg] = useState('');
    const [passwordEditing, setPasswordEditing] = useState(false);
    const [userImage, setUserImage] = useState(null);
    const messageRef = useRef(null);

    useEffect(() => {
        fetchUserInfos();
    }, [pseudo]);

    // If the user is loaded, check if it's the user profile and set the state
    useEffect(() => {
        if (userLoaded) {
            checkIfItsUserProfile(userData, user);
            setNewUsername(user.username || '');
            setNewEmail(user.email || '');
            setConfNewEmail(user.email || '');
            setNewBio(user.bio || '');
        }
    }, [user]);

    // Display the message for 5 seconds
    useEffect(() => {
        if (message.content) {
            messageRef.current.scrollIntoView({ behavior: 'smooth' });
            const timer = setTimeout(() => {
                setMessage({ content: '', class: '' });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    function handleImageUpload(imageUrl){
        setUserImage(imageUrl);
    };

    async function fetchUserInfos() {
        if (pseudo) {
            const result = await getUserByUsername(pseudo, jwt);
            setUser(result);
            setUserLoaded(true);
        }
    }

    function checkIfItsUserProfile(userData, user) {
        if (userLoaded && userData.uuid === user.uuid) {
            setUserProfile(true);
        }
    }

    async function handleUpdateUser() {

        // Check if the user is the owner of the profile before editing
        if (!userProfile) {
            return;
        }

        // Check if the email and the confirmation email are the same
        if (newEmail !== ConfNewEmail) {
            setErrorMsg('Les adresses email ne correspondent pas.');
            return;
        }

        if (cleanString(newUsername) === '' || cleanString(newEmail) === '') {
            setErrorMsg('Le pseudo et l\'email sont obligatoires.');
            return;
        }

        const data = {
            username: newUsername,
            email: newEmail,
            bio: cleanString(newBio),
            profilePicture: userImage
        }

        const result = await updateUser(jwt, user.uuid, data);

        if (result.message === 'User updated') {
            setMessage({ content: 'Profil mis à jour avec succès.', class: 'success' });
            setEditing(false);
            fetchUserInfos();
        }

    }

    async function handleDeleteAccount() {

        if (!userProfile || !jwt) {
            return;
        }

        const confirm = window.confirm('Êtes-vous sûr de vouloir supprimer votre compte?');

        if (confirm) {
            // Call the delete account function
            await deleteUser(jwt, user.uuid);
            Cookies.remove('jwt');
            Cookies.remove('userData');
            window.location.href = '/';
        }
    }

    async function handleUpdatePassword(username) {
        // Check if the user is the owner of the profile before editing
        if (!userProfile || !jwt) {
            return;
        }

        const currentPwd = cleanString(document.querySelector('.current-pwd').value);
        const newPwd = cleanString(document.querySelector('.new-pwd').value);
        const newPwdConfirm = cleanString(document.querySelector('.new-pwd-confirm').value);

        if (currentPwd === '' || newPwd === '' || newPwdConfirm === '') {
            setErrorMsg('Tous les champs sont obligatoires.');
            return;
        }

        if (!checkPasswordFormat(newPwd)) {
            setErrorMsg('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.');
            return;
        }

        if (newPwd !== newPwdConfirm) {
            setErrorMsg('Les mots de passe ne correspondent pas.');
            return;
        }

        const auth = await login({ 'username': username, 'pwd': currentPwd });

        if (!auth.token) {
            setErrorMsg('Mot de passe actuel incorrect.');
            return;
        }

        const result = await updateUserPassword(user.uuid, jwt, newPwd);

        if (result.message === 'User updated') {
            setMessage({ content: 'Mot de passe mis à jour avec succès.', class: 'success' });
            setPasswordEditing(false);
        }
    }


    if (!userLoaded) {
        return <div className='profile'><div className='loading-profile'>Chargement...</div></div>
    }

    return (
        <main className='profile'>
            {userProfile ? <h1>Mon profil</h1> : <h1>Profil de {user.username}</h1>}
            {editing ?
                <div className='editing-profile'>
                    < ProfileImageUpload  jwt={jwt} user={user} onImageUpload={handleImageUpload} />
                    <label htmlFor={"username"}>Pseudo:</label><input type="text" id="username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
                    <label htmlFor={"email"}>Email:</label><input type="email" id="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                    <label htmlFor={"conf-email"}>Confirmation email:</label><input type="email" id="conf-email" value={ConfNewEmail} onChange={(e) => setConfNewEmail(e.target.value)} />
                    <label htmlFor={"bio"}>Bio:</label><textarea id="bio" onChange={(e) => setNewBio(e.target.value)} placeholder='Ecrivez ici une bio...' defaultValue={user.bio ? user.bio : ""}></textarea>
                    {errorMsg ? <p className="error">{errorMsg}</p> : null}
                    <div className='buttons-box'>
                        <button className='validate-profile-edit-btn' onClick={(e) => handleUpdateUser()}>Enregistrer</button>
                        <button className='cancel-edit-btn' max-length="255" onClick={() => setEditing(false)}>Annuler</button>
                    </div>

                </div> :
                <>
                    {userProfile && <button className="edit-profile-btn" onClick={() => setEditing(true)}>Modifier mes informations</button>}
                    {message ? <p ref={messageRef} className={message.class}>{message.content}</p> : null}
                    {user.profilePicture ? <img className="profile-pic" src={user.profilePicture} alt="profile-pic" /> : <img className="profile-pic" src="/images/avatar-neutre.png" alt="profile-pic" />}
                    {user.statut === 'administrateur' ? <p className="success-text">Admin</p> : null}
                    <p>Pseudo: {user.username}</p>
                    {userProfile && <><p>Email: {user.email}</p><p className='error-text'>( L'adresse email n'est visible que par vous. Elle est utilisée pour la confirmation du compte, la récupération du mot de passe ou pour les notifications importantes. )</p></>}
                    <p>Membre depuis le : <span>{formatDate(user.CREATED)}</span></p>
                    <p>Dernière connexion : <span>{user.lastLogin ? formatDate(user.lastLogin) : "Jamais connecté."}</span></p>
                    <p>Bio: <span>{user.bio ? user.bio : "Pas de bio pour l'instant."}</span></p>
                    {userProfile ? <>
                        {!passwordEditing ?
                            <>
                                <button className='pwd-modify-btn' onClick={(e) => setPasswordEditing(true)}>Changer le mot de passe</button>
                                <button className='delete-account-btn' onClick={(e) => handleDeleteAccount()}>Supprimer mon compte</button>
                            </>
                            : <div className="pwd-editing-field">
                                <label htmlFor="current-pwd">Mot de passe actuel:</label>
                                <input type="password" className="current-pwd" id="current-pwd" />
                                <label htmlFor="new-pwd">Nouveau mot de passe: </label>
                                <input type="password" className="new-pwd" id="new-pwd" />
                                <label htmlFor="new-pwd-confirm">Confirmer nouveau mot de passe:</label>
                                <input type="password" className='new-pwd-confirm' id="new-pwd-confirm" />
                                {errorMsg ? <p className="error">{errorMsg}</p> : null}
                                <div className='buttons-field'>
                                    <button className='pwd-cancel-btn' onClick={(e) => setPasswordEditing(false)}>Annuler</button>
                                    <button className='pwd-validate-btn' onClick={(e) => handleUpdatePassword(user.username)}>Valider</button>
                                </div>
                            </div>}
                    </> : null}
                </>
            }
        </main>
    );
}