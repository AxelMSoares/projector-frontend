import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserByUsername } from '../../api/getUserByUsername';
import { formatDate } from '../../helpers/functions';
import { updateUser } from '../../api/updateUser';
import { cleanString } from '../../helpers/functions';

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

    // Display the message for 10 seconds
    useEffect(() => {
        if (message.content) {
            setTimeout(() => {
                setMessage({ content: '', class: '' });
            }, 10000);
        }
    }, [message]);

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
            console.log('Not the owner of the profile');
            return;
        }

        // If any change has been made, dont update
        if (newUsername === user.username && newEmail === user.email && newBio === user.bio) {
            setEditing(false);
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
            bio: cleanString(newBio)
        }

        const result = await updateUser(user.uuid, jwt, data);

        if (result.message === 'User updated') {
            setEditing(false);
            setMessage({ content: 'Profil mis à jour avec succès.', class: "success" });
            fetchUserInfos();
        }
    }

    if (!userLoaded) {
        return <div className='profile'><div className='loading-profile'>Chargement...</div></div>
    }

    return (
        <div className='profile'>
            {userProfile ? <h1>Mon profil</h1> : <h1>Profil de {user.username}</h1>}
            {editing ?
                <div className='editing-profile'>
                    <label htmlFor={"username"}>Pseudo:</label><input type="text" id="username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
                    <label htmlFor={"email"}>Email:</label><input type="email" id="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                    <label htmlFor={"conf-email"}>Confirmation email:</label><input type="email" id="conf-email" value={ConfNewEmail} onChange={(e) => setConfNewEmail(e.target.value)} />
                    <label htmlFor={"bio"}>Bio:</label><textarea id="bio" onChange={(e) => setNewBio(e.target.value)} placeholder='Ecrivez ici une bio...'>{user.bio ? user.bio : ""}</textarea>
                    {errorMsg ? <p className="error">{errorMsg}</p> : null}
                    <div className='buttons-box'>
                        <button className='validate-profile-edit-btn' onClick={(e) => handleUpdateUser()}>Enregistrer</button>
                        <button className='cancel-edit-btn' max-length="255" onClick={() => setEditing(false)}>Annuler</button>
                    </div>

                </div> :
                <>
                    {userProfile && <button className="edit-profile-btn" onClick={() => setEditing(true)}>Modifier mes informations</button>}
                    {message ? <p className={message.class}>{message.content}</p> : null}
                    <img className="profile-pic" src="../../../public/images/avatar-neutre.png" alt="profile-pic" />
                    {user.statut === 'administrateur' ? <p className="success-text">Admin</p> : null}
                    <p>Pseudo: {user.username}</p>
                    {userProfile && <><p>Email: {user.email}</p><p className='error-text'>( L'adresse email n'est visible que par vous. Elle est utilisée pour la confirmation du compte, la récupération du mot de passe ou pour les notifications importantes. )</p></>}
                    <p>Membre depuis le : <span>{formatDate(user.CREATED)}</span></p>
                    <p>Dernière connexion : <span>{user.lastLogin ? formatDate(user.lastLogin) : "Jamais connecté."}</span></p>
                    <p>Bio: <span>{user.bio ? user.bio : "Pas de bio pour l'instant."}</span></p>
                    {userProfile && <button className='delete-account-btn'>Supprimer mon compte</button>}
                </>
            }
        </div>
    );
}