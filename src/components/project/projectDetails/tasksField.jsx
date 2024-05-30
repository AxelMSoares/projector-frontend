import { useState, useEffect } from "react";
import { getProjectTasks } from "../../../api/getProjectTasks";
import { getTaskStatus } from "../../../api/getTaskStatus";
import { updateTasks } from "../../../api/updateTasks";
import { checkStatus } from "../../../helpers/functions";
import { deleteProjectTask } from "../../../api/deleteProjectTask";
import { cleanString } from "../../../helpers/functions";
import Cookies from 'js-cookie';

export default function TasksField({ project, jwt, userData }) {

    const [tasksList, setTasksList] = useState([]);
    const [taskStatus, setTaskStatus] = useState([]);
    const [tasksLoaded, setTasksLoaded] = useState(false);
    const [userIsAuthor, setuserIsAuthor] = useState(false);
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskStatus, setNewTaskStatus] = useState(1);
    const [message, setMessage] = useState({ message: '', className: '' });
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [filterByName, setFilterByName] = useState(false);
    const [filterByStatus, setFilterByStatus] = useState(false);
    const [asc, setAsc] = useState(true);

    // Fetch the tasks list and the task status when the project uuid is set
    useEffect(() => {
        if (project.uuid) {
            fetchTasksList();
            fetchTaskStatus();
            checkIfUserIsAuthor();
        }
    }, [project.uuid]);

    // If a message exist, display the message and set it to a empty string after 5 seconds
    useEffect(() => {
        if (message) {
            setTimeout(() => {
                setMessage({ message: '', className: '' });
            }, 5000);
        }
    }, [message]);

    // Check if the user is the author of the project
    function checkIfUserIsAuthor() {
        if (project.username == userData.username) {
            setuserIsAuthor(true)
            return;
        }
    }

    // Fetch the tasks list
    async function fetchTasksList() {
        const data = await getProjectTasks(jwt, project.uuid);
        setTasksList(data);
        setTasksLoaded(true);
    }

    // Fetch the task status
    async function fetchTaskStatus() {
        const data = await getTaskStatus(jwt);
        setTaskStatus(data);
    }

    // Redirect to the add task page
    async function addTask() {
        // If the user is not the author of the project, he can't add a task
        if (!userIsAuthor) {
            return;
        }

        Cookies.set('project_author', JSON.stringify({ author: project.username }));
        window.location.href = `/projet/nouvelle-tache/?uuid=${project.uuid}`;
        return null;
    }

    // Delete a task after a confirmation
    async function deleteTask(taskId) {
        // If the user is not the author of the project, he can't delete a task
        if (!userIsAuthor) {
            return;
        }

        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette tache ?");
        if (confirmation) {
            await deleteProjectTask(jwt, taskId);
            setMessage({ message: 'Tâche supprimée', className: 'success' });
            fetchTasksList();
        }
    }

    // Update a task
    async function updateTask(id) {
        // If the user is not the author of the project, he can't update a task
        if (!userIsAuthor) {
            return;
        }

        if (cleanString(newTaskName) === '' && cleanString(newTaskDescription) === '') {
            setMessage({ message: 'Veuillez remplir tous les champs', className: 'error' });
            return;
        }

        const data = {
            task_name: cleanString(newTaskName),
            task_description: cleanString(newTaskDescription),
            task_status_id: newTaskStatus
        }

        await updateTasks(jwt, id, data);
        fetchTasksList();
        setEditingTaskId(null);
    }

    // Filter the tasks by name
    function filterTasksByName() {
        setFilterByName(true);
        setFilterByStatus(false);
        if (asc) {
            setTasksList([...tasksList].sort((a, b) => a.task_name.localeCompare(b.task_name)));
            setAsc(false);
        } else {
            setTasksList([...tasksList].sort((a, b) => b.task_name.localeCompare(a.task_name)));
            setAsc(true);
        }
    }

    // Filter the tasks by status
    function filterTasksByStatus() {
        setFilterByName(false);
        setFilterByStatus(true);
        if (asc) {
            setTasksList([...tasksList].sort((a, b) => a.status_name.localeCompare(b.status_name)));
            setAsc(false);
        } else {
            setTasksList([...tasksList].sort((a, b) => b.status_name.localeCompare(a.status_name)));
            setAsc(true);
        }
    }

    // Reset the filter
    function resetFilter() {
        setFilterByName(false);
        setFilterByStatus(false);
        fetchTasksList();
    }


    return (
        <div className="tasks-field">
            <h3>Taches:</h3>
            {tasksLoaded ?
                <p className={ tasksList.length - tasksList.filter((task) => task.task_status_id == 4).length == 0 ? "tasks-ratio success-text" : "tasks-ratio"}>{tasksList.filter((task) => task.task_status_id == 4).length} / {tasksList.length}</p>
                : null}
            {userIsAuthor ?
                <button className="task-add-btn" onClick={(e) => addTask()}>Ajouter nouvelle tache</button>
                : null}
            {filterByName || filterByStatus?
                <div className="filtered">
                    <p>Tâches triées par: <span>{filterByName ? "Nom" : "Status"}</span></p>
                    <p className="delete-filter" onClick={(e) => resetFilter()}>Retirer les filtres</p>
                </div>
                : null}
            <ul>
                <li className={userIsAuthor ? "author" : "user"}>
                    <p className={filterByName ? "filter filter-clicked" : "filter"} onClick={(e) => filterTasksByName()}>Nom: {filterByName ? (asc ? '▲' : '▼') : null} </p>
                    <p className={filterByStatus ? "filter filter-clicked" : "filter"} onClick={(e) => filterTasksByStatus()}>Status: {filterByStatus ? (asc ? '▲' : '▼') : null}</p>
                    <p>Description:</p>
                    {userIsAuthor ? <p>Actions:</p> : null}
                </li>
                {tasksLoaded && tasksList.length > 0 ?
                    tasksList.map((task) => {
                        return (<li key={task.task_id} className={userIsAuthor ? "author" : "user"}>
                            {editingTaskId === task.task_id ?
                                <>
                                    <input type="text" defaultValue={task.task_name} onChange={(e) => setNewTaskName(e.target.value)} />
                                    <select onChange={(e) => setNewTaskStatus(e.target.value)}>
                                        {taskStatus.map((status) => {
                                            return <option key={status.id} value={status.id}>{status.status_name}</option>
                                        })}
                                    </select>
                                    <textarea defaultValue={task.task_description} onChange={(e) => setNewTaskDescription(e.target.value)}></textarea>
                                    <div className="action-buttons">
                                        <button className="edit" onClick={(e) => updateTask(task.task_id)}>Valider</button>
                                        <button className="delete" onClick={(e) => setEditingTaskId(null)}>Annuler</button>
                                    </div>
                                </>
                                :
                                <>
                                    <p>{task.task_name}</p>
                                    <p className={checkStatus(task.status_name)}>{task.status_name}</p>
                                    <p>{task.task_description}</p>
                                    {userIsAuthor ?
                                        <div className="action-buttons">
                                            <button className="edit" onClick={(e) => setEditingTaskId(task.task_id)}>Éditer</button>
                                            <button className="delete" onClick={(e) => deleteTask(task.task_id)}>Supprimer</button>
                                        </div>
                                        :
                                        null
                                    }
                                </>
                            }

                        </li>
                        )
                    }) : <li> Pas de tâches pour le moment</li>}
                {message ? <div className={message.className}>{message.message}</div> : null}
            </ul>
        </div>
    );
}