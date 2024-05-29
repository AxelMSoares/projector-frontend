import { useState, useEffect } from "react";
import { createNewProjectTask } from "../../../api/createNewProjectTask";
import { cleanString } from "../../../helpers/functions";
import Cookies from 'js-cookie';

export default function NewProjectTask({jwt, userData}) {

    const projectUUID = new URLSearchParams(window.location.search).get('uuid');
    const [projectAuthor, setProjectAuthor] = useState('');

    if (!jwt || !userData) {
        window.location.href = '/';
    }

    useEffect(() => {
        
        setProjectAuthor(Cookies.get('project_author') ? JSON.parse(Cookies.get('project_author')) : '');
        checkIfUserIsAuthor();
    }
    , [projectUUID]);

    function checkIfUserIsAuthor() {
        if (projectAuthor){
            return projectAuthor.author == userData.username;
        }
    }

    async function createTask() {
        // If the user is not the author of the project, return
        if (!checkIfUserIsAuthor()) {
            return;
        }

        const data = {
            task_name: document.getElementById('taskName').value,
            task_description: document.getElementById('taskDescription').value,
            project_uuid: projectUUID ? projectUUID : null,
            task_status_id: 1
        }

        if(data.project_uuid === null) {
            return;
        }

        if(cleanString(data.task_name) === '' || cleanString(data.task_description) === '') {
            alert('Veuillez remplir tous les champs');
            return;
        }

        // Remove the cookies
        Cookies.remove('project_author');

        // Create the new project task and redirect to the project detail page
        await createNewProjectTask(jwt, data);
        window.location.href = `/detail-projet/?uuid=${projectUUID}`;
        return null;
    
    }

    // Cancel the creation of the new task and redirect to the project detail page
    function cancel() {
        Cookies.remove('project_author');
        window.location.href = `/detail-projet/?uuid=${projectUUID}`;
    }

    return (
        <div className="new-project-task-field">
            <h2>Nouvelle tâche:</h2>
            <div>
                <label htmlFor="taskName">Nom de la tâche:</label>
                <input type="text" id="taskName" name="taskName" />
                <label htmlFor="taskDescription">Description de la tâche:</label>
                <textarea id="taskDescription" name="taskDescription" />
                <button onClick={(e)=>cancel()}> Annuler</button>
                <button onClick={createTask}>Créer nouvelle tâche</button>
            </div>
        </div>
    )
}