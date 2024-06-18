import { useState, useEffect } from "react";
import { createNewProjectTask } from "../../../api/createNewProjectTask";
import { useCSRFToken } from "../../../context/CSRFTokenContext";
import { cleanString } from "../../../helpers/functions";
import Cookies from "js-cookie";

export default function NewProjectTask({ jwt, userData }) {

    const projectUUID = new URLSearchParams(window.location.search).get('uuid');
    const [projectAuthor, setProjectAuthor] = useState('');
    const [message, setMessage] = useState({content: '', class: ''});
    const csrfToken = useCSRFToken();

    if (!jwt || !userData) {
        window.location.href = '/';
    }

    useEffect(() => {

        setProjectAuthor(localStorage.getItem('project_author') ? JSON.parse(localStorage.getItem('project_author')) : '');
        checkIfUserIsAuthor();
    }, [projectUUID]);

    useEffect(() => {
        if (message.content !== '') {
            const timer = setTimeout(() => {
                setMessage({content: '', class: ''});
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    function checkIfUserIsAuthor() {
        if (projectAuthor) {
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

        if (data.project_uuid === null) {
            return;
        }

        if (cleanString(data.task_name) === '' || cleanString(data.task_description) === '') {
            setMessage({content: 'Veuillez remplir tous les champs.', class: 'error-message'});
            return;
        }

        // Remove the project author from the local storage
        localStorage.removeItem('project_author');

        // Add a success message in the cookies
        Cookies.set("task_message", "Tâche crée avec succèss.");
        
        // Create the new project task and redirect to the project detail page
        await createNewProjectTask(jwt, csrfToken, data);
        window.location.href = `/detail-projet/?uuid=${projectUUID}`;
        return null;

    }

    // Cancel the creation of the new task and redirect to the project detail page
    function cancel() {
        localStorage.removeItem('project_author');
        Cookies.remove('task_message');
        window.location.href = `/detail-projet/?uuid=${projectUUID}`;
    }

    return (
        <main className="new-project-task-field">
            <h2>Nouvelle tâche:</h2>
            <div>
                <label htmlFor="taskName">Nom de la tâche:</label>
                <input type="text" id="taskName" name="taskName" />
                <label htmlFor="taskDescription">Description de la tâche:</label>
                <textarea id="taskDescription" name="taskDescription" />
                {message && <p className={message.class}>{message.content}</p>}
                <div className="buttons-field">
                    <button className="new-task-cancel" onClick={(e) => cancel()}> Annuler</button>
                    <button className="new-task-btn" onClick={createTask}>Créer nouvelle tâche</button>
                </div>
            </div>
        </main>
    )
}