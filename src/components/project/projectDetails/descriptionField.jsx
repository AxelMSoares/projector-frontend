import { useState, useEffect } from 'react';
import { formatDateToYYYYMMDD, cleanString } from '../../../helpers/functions.js';
import DOMPurify from 'dompurify';

export default function DescriptionField({ project, userData, onUpdate }) {
    const [description, setDescription] = useState(project.project_description || '');
    const [editingDescription, setEditingDescription] = useState(false);
    const [newDescription, setNewDescription] = useState(project.project_description || '');


    useEffect(() => {
        setDescription(project.project_description);
        setNewDescription(project.project_description);
    }, [project.project_description]);

    function descriptionUpdate() {
        const data = {
            project_deadline: project.project_deadline ? formatDateToYYYYMMDD(project.project_deadline) : null,
            project_status_id: project.project_status_id,
            project_category_id: project.project_category_id,
        };

        if (newDescription.trim() === '') {
            data.project_description = project.project_description;
            setNewDescription(project.project_description);
            setEditingDescription(false);
            return;
        }

        data.project_description = cleanString(newDescription);

        if (data.project_description !== project.project_description) {
            onUpdate(data);
        }
        setEditingDescription(false);
    }

    return (
        <div className="project-description-field">
            {editingDescription ? (
                <>
                    <p className='detail'>Description: </p>
                    <input type="text" value={newDescription} onChange={(e) => setNewDescription(DOMPurify.sanitize(e.target.value))} />
                </>
            ) : (
                <p className="detail">Description: <span>{DOMPurify.sanitize(description)}</span></p>
            )
            }
            {(userData.username === project.username) ? (
                <div>
                    {editingDescription ? (
                        <>
                            <button className="desc-confirm-btn" onClick={descriptionUpdate}>Valider</button>
                            <button className="desc-cancel-btn" onClick={() => {
                                setEditingDescription(false);
                                setNewDescription(description); // Reset the input value if cancel
                            }}>Annuler</button>
                        </>
                    ) : (
                        <button onClick={() => setEditingDescription(true)}>Éditer</button>
                    )}
                </div>
            ) : null}
        </div>
    )
}