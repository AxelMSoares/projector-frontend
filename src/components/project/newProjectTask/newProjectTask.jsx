import { useState, useEffect } from "react";
import { createNewProjectTask } from "../../../api/createNewProjectTask";

export default function NewProjectTask({jwt, userData}) {

    const projectUUID = new URLSearchParams(window.location.search).get('uuid');

    if (!jwt || !userData) {
        window.location.href = '/';
    }

    async function createTask() {
        const data = {
            task_name: document.getElementById('taskName').value,
            task_description: document.getElementById('taskDescription').value,
            project_uuid: projectUUID ? projectUUID : null,
            task_status_id: 1
        }

        if(data.projectUUID === null) {
            return;
        }

        if(data.task_name === '' || data.task_description === '') {
            alert('Veuillez remplir tous les champs');
            return;
        }

        await createNewProjectTask(jwt, data);
        window.location.href = `/detail-projet/?uuid=${projectUUID}`;
        return null;
    
    }


    return (
        <div className="new-project-task-field">
            <h2>Nouvelle tâche:</h2>
            <div>
                <label htmlFor="taskName">Nom de la tâche:</label>
                <input type="text" id="taskName" name="taskName" />
                <label htmlFor="taskDescription">Description de la tâche:</label>
                <textarea id="taskDescription" name="taskDescription" />
                <button onClick={createTask}>Créer nouvelle tâche</button>
            </div>
        </div>
    )
}