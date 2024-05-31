import { useState, useEffect } from "react";
import { checkStatus } from "../../../helpers/functions";
import { formatDateToYYYYMMDD } from "../../../helpers/functions";
import { getProjectStatus } from "../../../api/getProjectStatus";

export default function StatusField({ project, userData, jwt, onUpdate }) {
    const [statusName, setStatusName] = useState('');
    const [editingStatus, setEditingStatus] = useState(false);
    const [newStatus, setNewStatus] = useState(1);
    const [statusList, setStatusList] = useState([]);
    const data = {
        project_description: project.project_description,
        project_status_id: newStatus,
        project_category_id: project.project_category_id,
    }

    if (project.project_deadline) {
        data.project_deadline = formatDateToYYYYMMDD(project.project_deadline);
    } else {
        data.project_deadline = null;

    }

    useEffect(() => {
        setStatusName(project.status_name);
        setNewStatus(1);
        getStatus();
    }, [project]);

    async function getStatus() {
        const data = await getProjectStatus(jwt);
        if (data) {
            setStatusList(data);
        }

    }

    function updateStatus() {
        onUpdate(data);
        setEditingStatus(false);
    }

    return (
        editingStatus ? (
            <div className="project-status-field">
                <p className="detail">Statut:</p>
                <select onChange={(e) => setNewStatus(e.target.value)}>
                    {statusList.map((status) => (
                        <option key={status.id} value={status.id}>{status.status_name}</option>
                    ))}
                </select>
                <div>
                    <button className="status-confirm-btn" onClick={() => updateStatus()}>Valider</button>
                    <button className="status-cancel-btn" onClick={() => {
                        setEditingStatus(false);
                        setNewStatus(project.project_status_id)
                    }}> Annuler </button>
                </div>
            </div>

        ) : (
            <div className="project-status-field">
                <p className="detail">Statut: <span className={checkStatus(statusName)}>{statusName}</span></p>
                {(userData.username === project.username) ? <div><button onClick={() => setEditingStatus(true)}>Éditer</button></div> : null}
            </div>
        )
    )
}