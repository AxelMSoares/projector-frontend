import { useState, useEffect } from 'react';
import { deleteProjectMember } from '../../../api/deleteProjectMember';
import { updateProjectDetails } from '../../../api/updateProject';
import { UpdateProjectMember } from '../../../api/updateProjectMember';
import Cookies from 'js-cookie';
import { cleanString } from '../../../helpers/functions';

export default function ProjectMembers({ projectUuid, jwt, userData, project, membersList }) {

    const [members, setMembers] = useState([]);
    const [editingMemberId, setEditingMemberId] = useState(null);
    const [newRole, setNewRole] = useState('');
    const [message, setMessage] = useState({ message: '', class: '' });
    const [userIsAuthor, setUserIsAuthor] = useState(false);
    const [searching, setSearching] = useState(false);

    // If the user is not connected, prevent user to see project members
    if (!jwt && !userData) {
        return null;
    }

    // Update the members list when the membersList is loaded and check if the accessing user is the author of the project
    useEffect(() => {
        setMembers(membersList);
        setMessage(Cookies.get('message') ? JSON.parse(Cookies.get('message')) : { message: '', class: '' });
        CheckIfUserIsAuthor();
    }, [membersList]);

    // Set the message to null after 5 seconds
    useEffect(() => {
        if (message) {
            setTimeout(() => {
                setMessage({ message: '', class: '' });
                Cookies.remove('message');
            }, 5000);
        }
    }, [message]);

    // Check if the user is the owner of the project
    function CheckIfUserIsAuthor() {
        setUserIsAuthor(project.username === userData.username);
    }

    // Delete a member from the project
    async function deleteMember(id) {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce membre ?");
        if (confirmation) {
            await deleteProjectMember(id, jwt);
            setMembers(members.filter(member => member.id !== id));
            setMessage({ message: 'Le membre a bien été supprimé', class: 'success' });
        }
    }

    // Update the role of a member
    async function updateRole(id, newRole) {

        // Check if the user is an administrator or the author of the project
        if (userData.statut !== "administrateur" && !userIsAuthor) {
            setEditingMemberId(null);
            return null;
        }

        // Check if the role is not empty
        if (newRole == '') {
            setMessage({ message: 'Le rôle ne peut pas être vide', class: 'error' });
            return null;
        }

        await UpdateProjectMember(jwt, id, cleanString(newRole));
        setEditingMemberId(false);


        // Update the members list after the role has been updated
        const newMembersList = members.map(member => {
            if (member.id === id) {
                return { ...member, role: newRole };
            }
            return member;
        });

        setMembers(newMembersList);
        setMessage({ message: 'Le rôle a bien été modifié', class: 'success' });

    }

    // A user can leave a project
    async function leaveProject(id, jwt) {


        const confirmation = confirm("Êtes-vous sûr de vouloir quitter le projet ?");

        if (confirmation) {
            await deleteProjectMember(id, jwt);
            window.location.href = `/mes-projets/`;
        }
    }

    // Redirect to the add member page
    function addMember() {
        Cookies.set('project_author', JSON.stringify({ author: project.username }));
        window.location.href = `/projet/nouveau-membre/?uuid=${projectUuid}`;
        return;
    }

    // Search the user by its username
    function searchUser(searchedUser) {
        if (searchedUser === '') {
            setMembers(membersList);
            setSearching(false);
            return;
        }

        const searchedMembers = membersList.filter(member => member.username.toLowerCase().includes(searchedUser.toLowerCase()));
        setMembers(searchedMembers);
        setSearching(true);
    }

    return (
        <div className="members" >
            <p>Membres: {members && members.length > 0 ? <span>{members.length}</span> : null}</p>
            {userIsAuthor ?
                (<button className="members-add-btn"
                    onClick={addMember}> Ajouter un membre </button>
                )
                : null
            }
            <div className='search-members-field'>
                <label htmlFor='user-search'>Rechercher un membre:</label>
                <input type="text" id="user-search" name="user-search" onChange={(e) => searchUser(e.target.value)} />
            </div>
            {message.message ? <p className={message.class}>{message.message}</p> : null}
            <ul>
                {userIsAuthor ?
                    (
                        <li><p>Pseudo:</p><p>Role:</p><p>Gestion:</p></li>
                    ) :
                    <li><p>Pseudo:</p><p>Role:</p></li>
                }
                {members && members.length > 0 ? members.map((member) => (
                    <li key={member.id} className="member">
                        <p>{member.username}</p>
                        {editingMemberId === member.id ? (
                            <input
                                type="text"
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                            />
                        ) : (
                            <>
                                <p>{member.role}</p>
                                {userData.username === member.username ?
                                    (<button className="members-leave-btn"
                                        onClick={() => leaveProject(member.id, jwt)}>Se retirer du projet</button>)
                                    : null}
                            </>
                        )}
                        {userIsAuthor && (
                            <div>
                                {editingMemberId === member.id ? (
                                    <>
                                        <button className="members-edit-btn" onClick={() => updateRole(member.id, cleanString(newRole))}> Confirmer </button>
                                        <button className="members-delete-btn" onClick={() => {
                                            setEditingMemberId(null);
                                            setNewRole('');
                                        }}
                                        > Annuler
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="members-edit-btn"
                                            onClick={() => {
                                                setEditingMemberId(member.id);
                                                setNewRole(cleanString(member.role));
                                            }}
                                        >
                                            Éditer
                                        </button>
                                        <button className="members-delete-btn"
                                            onClick={() => deleteMember(member.id)}
                                        >
                                            Supprimer
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </li>
                )) :
                    (searching ? <li>Pas de membre trouvé pour cette recherche.</li> : <li>Aucun membre participe à ce projet pour l'instant.</li>)
                }
            </ul>
        </div>
    )
}
