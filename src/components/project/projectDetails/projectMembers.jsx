import { useState, useEffect } from 'react';
import { deleteProjectMember } from '../../../api/deleteProjectMember';
import { updateProjectDetails } from '../../../api/updateProject';
import { UpdateProjectMember } from '../../../api/updateProjectMember';
import Cookies from 'js-cookie';

export default function ProjectMembers({ projectUuid, jwt, userData, project, membersList }) {

    const [members, setMembers] = useState([]);
    const [editingMemberId, setEditingMemberId] = useState(null);
    const [newRole, setNewRole] = useState('');
    const [message, setMessage] = useState('');

    if (!jwt) {
        window.location.href = '/connexion';
        return null;
    }

    useEffect(() => {
        setMembers(membersList);
        setMessage(Cookies.get('message'));
    }, [membersList]);

    useEffect(() => {

        // Set the message to null after 5 seconds
        if (message) {
            setTimeout(() => {
                setMessage('');
                Cookies.remove('message');
            }, 5000);
        }
    }, [message]);


    async function deleteMember(id) {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce membre ?");
        if (confirmation) {
            try {
                await deleteProjectMember(id, jwt);
                setMembers(members.filter(member => member.id !== id));
                setMessage('Le membre a bien été supprimé');
            } catch (error) {
                console.log("Une erreur est survenue lors de la suppression du membre");
            }
        }
    }

    async function updateRole(id) {
        try {
            await UpdateProjectMember(jwt, id, newRole);
            setEditingMemberId(false);
        } catch (error) {
            console.log("Une erreur est survenue lors de la mise à jour du rôle du membre", error);
        }

        // Update the members list after the role has been updated
        const newMembersList = members.map(member => {
            if (member.id === id) {
                return { ...member, role: newRole };
            }
            return member;
        });

        setMembers(newMembersList);

    }

    async function leaveProject(id, jwt) {
        const confirmation = confirm("Êtes-vous sûr de vouloir quitter le projet ?");

        if (confirmation) {
            try {
                console.log(id, jwt);
                await deleteProjectMember(id, jwt);
            } catch (error) {
                console.log("Une erreur est survenue lors de la suppression du membre");
            }

            window.location.href = `/mes-projets/`;
        }
    }

    function addMember() {
        // Add a member to the project
        window.location.href = `/projet/nouveau-membre/?uuid=${projectUuid}`;
        return;
    }

    return (
        <div className="members" >
            {message ? <p className="success">{message}</p> : null}
            <p>Membres:</p>
            {(project.username === userData.username) ?
                (<button className="members-add-btn"
                    onClick={addMember}> Ajouter un membre </button>)
                : null}
            <ul>
                {(project.username === userData.username) ? (
                    <li><p>Pseudo:</p><p>Role:</p><p>Gestion:</p></li>
                ) : <li><p>Pseudo:</p><p>Role:</p></li>}
                {members.map((member) => (
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
                        {(project.username === userData.username) && (
                            <div>
                                {editingMemberId === member.id ? (
                                    <>
                                        <button className="members-edit-btn"
                                            onClick={() => updateRole(member.id, newRole)}
                                        >
                                            Confirmer
                                        </button>
                                        <button className="members-delete-btn"
                                            onClick={() => {
                                                setEditingMemberId(null);
                                                setNewRole('');
                                            }}
                                        >
                                            Annuler
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="members-edit-btn"
                                            onClick={() => {
                                                setEditingMemberId(member.id);
                                                setNewRole(member.role);
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
                ))}
            </ul>
        </div>
    )
}
