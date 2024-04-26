import { useState, useEffect } from 'react';
import { deleteProjectMember } from '../../../api/deleteProjectMember';
import { updateProjectDetails } from '../../../api/updateProject';
import { UpdateProjectMember } from '../../../api/updateProjectMember';

export default function ProjectMembers({ projectUuid, jwt, userData, project, membersList }) {

    const [members, setMembers] = useState([]);
    const [editingMemberId, setEditingMemberId] = useState(null);
    const [newRole, setNewRole] = useState('');

    if (!jwt) {
        window.location.href = '/connexion';
        return null;
    }

    useEffect(() => {
        setMembers(membersList);
    }, [membersList]);

    async function deleteMember(id) {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce membre ?");
        if (confirmation) {
            try {
                await deleteProjectMember(id, jwt);
                setMembers(members.filter(member => member.id !== id));
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

    return (
        <div className="members" >
            <p>Membres:</p>
            { (project.username === userData.username) ? (<button className="members-add-btn" > Ajouter un membre </button>) : null}
            <ul>
                {(project.username === userData.username) && (
                    <li><p>Pseudo:</p><p>Role:</p><p>Gestion:</p></li>
                )}
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
                            <p>{member.role}</p>
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
