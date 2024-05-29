import { useState, useEffect } from 'react';
import { deleteProjectMember } from '../../../api/deleteProjectMember';
import { UpdateProjectMember } from '../../../api/updateProjectMember';
import { cleanString } from '../../../helpers/functions';
import Cookies from 'js-cookie';

export default function ProjectMembers({ projectUuid, jwt, userData, project, membersList }) {

    const [members, setMembers] = useState([]);
    const [editingMemberId, setEditingMemberId] = useState(null);
    const [newRole, setNewRole] = useState('');
    const [message, setMessage] = useState({ message: '', class: '' });
    const [userIsAuthor, setUserIsAuthor] = useState(false);
    const [searching, setSearching] = useState(false);
    const [filteredByUsername, setFilteredByUsername] = useState(false);
    const [filteredByRole, setFilteredByRole] = useState(false);
    const [ascending, setAscending] = useState(true);

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

    // Set the message to null after 10 seconds
    useEffect(() => {
        if (message) {
            setTimeout(() => {
                setMessage({ message: '', class: '' });
                Cookies.remove('message');
            }, 10000);
        }
    }, [message]);

    // Check if the user is the owner of the project
    function CheckIfUserIsAuthor() {
        setUserIsAuthor(project.username === userData.username);
    }

    // Delete a member from the project
    async function deleteMember(id) {

        // Check if the user is an administrator or the author of the project
        if (userData.statut !== "administrateur" && !userIsAuthor) {
            return null;
        }

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

        setFilteredByRole(false);
        setFilteredByUsername(false);

        const searchedMembers = membersList.filter(member => member.username.toLowerCase().includes(searchedUser.toLowerCase()));
        setMembers(searchedMembers);
        setSearching(true);
    }

    // Filter the members by their username
    function filterMembersByUsername() {
        setFilteredByUsername(true);
        setFilteredByRole(false);

        if (ascending) {
            const searchedMembers = membersList.sort((a, b) => a.username.localeCompare(b.username));
            setMembers(searchedMembers);
            setAscending(false);
        } else {
            const searchedMembers = membersList.sort((a, b) => b.username.localeCompare(a.username));
            setMembers(searchedMembers);
            setAscending(true);
        }
    }


    // Filter the members by their role
    function filterMembersByRole() {
        setFilteredByRole(true);
        setFilteredByUsername(false);

        if (ascending) {
            const searchedMembers = membersList.sort((a, b) => a.role.localeCompare(b.role));
            setMembers(searchedMembers);
            setAscending(false);
        } else {
            const searchedMembers = membersList.sort((a, b) => b.role.localeCompare(a.role));
            setMembers(searchedMembers);
            setAscending(true);
        }
    }

    // Remove filters
    function removeFilters() {
        setMembers(membersList);
        setFilteredByUsername(false);
        setFilteredByRole(false);
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
            {filteredByUsername || filteredByRole ?
                <div className='filter-field'>
                    <p>Trié par: <span>{filteredByUsername ? "Pseudo" : "Role"}</span></p>
                    <button className="members-remove-filters" onClick={(e) => removeFilters()}>Retirer les filtres</button>
                </div>
                : null}
            {message.message ? <p className={"message " + message.class}>{message.message}</p> : null}
            <ul>
                {userIsAuthor ?
                    (
                        <li>
                            <p className={filteredByUsername ? "filters-clicked" : "filters"} onClick={(e) => filterMembersByUsername()}>Pseudo: {filteredByUsername ? (ascending ? '▲' : '▼') : null }</p>
                            <p className={filteredByRole ? "filters-clicked" : "filters"} onClick={(e) => filterMembersByRole()}>Role: {filteredByRole ? (ascending ? '▲' : '▼') : null }</p>
                            <p>Gestion:</p>
                        </li>
                    ) :
                    <li>
                        <p className={filteredByUsername ? "filters-clicked" : "filters"} onClick={(e) => filterMembersByUsername()}>Pseudo: {filteredByUsername ? (ascending ? '▲' : '▼') : null }</p>
                        <p className={filteredByRole ? "filters-clicked" : "filters"} onClick={(e) => filterMembersByRole()}>Role: {filteredByRole ? (ascending ? '▲' : '▼') : null }</p>
                    </li>
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
