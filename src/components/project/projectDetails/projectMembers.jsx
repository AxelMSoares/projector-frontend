import { useState, useEffect } from 'react';

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
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project_members/delete/${id}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": jwt
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    console.log("Une erreur est survenue lors de la suppression du membre", data.error);
                } else {
                    getMembers();
                }

            } catch (error) {
                console.log("Une erreur est survenue lors de la suppression du membre", error);
            }
        }
    }

    async function updateRole(memberId, newRole) {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project_members/update/${memberId}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jwt
                },
                body: JSON.stringify({ role: newRole })
            });

            const data = await response.json();

            if (!response.ok) {
                console.log("Une erreur est survenue lors de la mise à jour du rôle du membre", data.error);
            } else {
                getMembers();
                setEditingMemberId(null);
                setNewRole('');
            }

        } catch (error) {
            console.log("Une erreur est survenue lors de la mise à jour du rôle du membre", error);
        }
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
