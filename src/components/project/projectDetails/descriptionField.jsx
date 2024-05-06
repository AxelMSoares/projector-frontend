import { useState, useEffect } from 'react';
import { formatDateToYYYYMMDD, cleanString } from '../../../helpers/functions.js';

export default function DescriptionField({project, userData, onUpdate}) {
    const [description, setDescription] = useState(project.project_description || '');
    const [editingDescription, setEditingDescription] = useState(false);
    const [newDescription, setNewDescription] = useState(project.project_description || '');
    const data = {
        project_description: cleanString(newDescription),
        project_deadline: formatDateToYYYYMMDD(project.project_deadline),
        project_status_id: project.project_status_id,
        project_category_id: project.project_category_id,
    }

    useEffect(() => {
        setDescription(project.project_description);
        setNewDescription(project.project_description);
    }, [project.project_description]);

    function descriptionUpdate() {
        if (data.project_description.trim() != '' || data.project_description != newDescription){
            onUpdate(data);
        }
        setEditingDescription(false);
    }

    return (
        <div className="project-description-field">
            {editingDescription ? (
                    <input type="text" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                ) : (
                    <p className="detail">Description: <span>{description}</span></p>
                )
            }
            {(userData.username === project.username) ? (
                            <div>
                                {editingDescription ? (
                                    <>
                                        <button onClick={descriptionUpdate}>Confirmer</button>
                                        <button onClick={() => {
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