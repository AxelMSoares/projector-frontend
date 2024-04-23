import { useState, useEffect } from "react";
import { checkStatus } from "../../../helpers/functions";
import { formatDateToYYYYMMDD } from "../../../helpers/functions";

export default function StatusField({ project, userData, jwt, onUpdate }) {
    const [statusName, setStatusName] = useState('');
    const [editingStatus, setEditingStatus] = useState(false);
    const [newStatus, setNewStatus] = useState(1);
    const [statusList, setStatusList] = useState([]);
    const data = {
        project_description: project.project_description,
        project_deadline: formatDateToYYYYMMDD(project.project_deadline),
        project_status_id: newStatus
    }

    useEffect(() => {
        setStatusName(project.status_name);
        setNewStatus(1);
        getStatus();
    }, [project]);

    async function getStatus() {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project_status`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jwt
                }
            });

            const data = await response.json();

            if (!response.ok) {
                console.log("Une erreur est survenue lors de la récupération des statuts", data.error);
            } else {
                setStatusList(data);
            }

        } catch (error) {
            console.log("Une erreur est survenue lors de la récupération des statuts", error);
        }
    }

    function updateStatus() {
        onUpdate(data);
        setEditingStatus(false);
    }

    return (
        editingStatus ? (
            <div className="project-status-field">
                    <select onChange={(e) => setNewStatus(e.target.value)}>
                        {statusList.map((status) => (
                            <option key={status.id} value={status.id}>{status.status_name}</option>
                        ))}
                    </select>
                    <div>
                        <button onClick={() => updateStatus()}>Confirmer</button>
                        <button onClick={() => {
                            setEditingStatus(false);
                            setNewStatus(project.project_status_id)
                        }}> Annuler </button>
                    </div>
            </div>

        ) : (
            <div className="project-status-field">
                <p className="detail">Statut: <span className={checkStatus(statusName)}>{statusName}</span></p>
                {(userData.username === project.username) ? <button onClick={() => setEditingStatus(true)}>Editer</button> : null}
            </div>
        )
    )
}