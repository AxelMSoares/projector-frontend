import { useState, useEffect } from "react";
import { formatDate, checkDateIsPassed } from '../../../helpers/functions';

export default function Deadline ( { project, userData , onUpdate }) {

    const [deadline, setDeadline] = useState('');
    const [editingDeadline, setEditingDeadline] = useState(false);
    const [newDeadline, setNewDeadline] = useState(deadline || '');
    const data = {
        project_description: project.project_description,
        project_deadline: ( newDeadline ? newDeadline : null ),
        project_status_id: project.project_status_id
    }

    useEffect(() => {
        setDeadline(project.project_deadline);
    }, [project]);
    
    function deadlineUpdate() {
        onUpdate(data);
        setEditingDeadline(false);
    }

    return (
        <div className="project-date-field">
                        {editingDeadline ? (
                            <input
                                type="date"
                                value={newDeadline}
                                onChange={(e) => setNewDeadline(e.target.value)}
                            />
                        ) : (
                            <p className="detail">
                                Date limite:{" "}
                                {deadline ? (
                                    <span className={checkDateIsPassed(deadline)}>
                                        {formatDate(deadline)}
                                    </span>
                                ) : (
                                    <span className="success-text">Pas de date limite</span>
                                )}
                            </p>
                        )}
                        {userData.username === project.username && (
                            <div>
                                {editingDeadline ? (
                                    <>
                                        <button onClick={deadlineUpdate}>Confirmer</button>
                                        <button onClick={() => {
                                            setEditingDeadline(false);
                                            setNewDeadline(deadline); // Reset the input value if cancel
                                        }}>Annuler</button>
                                    </>
                                ) : (
                                    <button onClick={() => setEditingDeadline(true)}>Éditer la deadline</button>
                                )}
                            </div>
                        )}
                    </div>
    )
}