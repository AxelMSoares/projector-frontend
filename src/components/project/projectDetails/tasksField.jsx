import { useState, useEffect } from "react";
import { getProjectTasks } from "../../../api/getProjectTasks";
import { getTaskStatus } from "../../../api/getTaskStatus";
import { updateTasks } from "../../../api/updateTasks";
import { deleteProjectTask } from "../../../api/deleteProjectTask";
import { useCSRFToken } from "../../../context/CSRFTokenContext";
import { checkStatus } from "../../../helpers/functions";
import { cleanString } from "../../../helpers/functions";
import Cookies from "js-cookie";
import DOMPurify from "dompurify";

export default function TasksField({ project, jwt, userData }) {

    const [userIsAuthor, setuserIsAuthor] = useState(false);
    const [tasksList, setTasksList] = useState([]);
    const [taskStatus, setTaskStatus] = useState([]);
    const [tasksLoaded, setTasksLoaded] = useState(false);
    const [currentTask, setCurrentTask] = useState([]);
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskStatus, setNewTaskStatus] = useState(null);
    const [message, setMessage] = useState({ message: '', className: '' });
    const [asc, setAsc] = useState(true);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [filterByName, setFilterByName] = useState(false);
    const [filterByStatus, setFilterByStatus] = useState(false);
    const csrfToken = useCSRFToken();

    // If a cookie task message exist, set the message and delete the cookie
    useEffect(() => {
        const taskMessage = Cookies.get('task_message');
        if (taskMessage) {
            setMessage({ message: taskMessage, className: 'success' });
        }
        Cookies.remove('task_message');
    }, []);

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
            const timer = setTimeout(() => setMessage({ message: '', className: '' }), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);


    // Check if the user is the author of the project
    function checkIfUserIsAuthor() {
        setuserIsAuthor(project.username == userData.username);
    }

    // Fetch the tasks list
    async function fetchTasksList() {
        const data = await getProjectTasks(jwt, csrfToken, project.uuid);
        setTasksList(data);
        setTasksLoaded(true);
    }

    // Fetch the task status
    async function fetchTaskStatus() {
        const data = await getTaskStatus(jwt, csrfToken);
        setTaskStatus(data);
    }

    // Redirect to the add task page
    async function addTask() {
        // If the user is not the author of the project, he can't add a task
        if (!userIsAuthor) {
            return;
        }
        // Set the project author in the cookies
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
            await deleteProjectTask(jwt, csrfToken, taskId);
            setMessage({ message: 'La tâche a bien été supprimée.', className: 'success' });
            fetchTasksList();
        }
    }

    // Update a task
    async function updateTask(id) {
        // If the user is not the author of the project, he can't update a task
        if (!userIsAuthor) {
            return;
        }

        // Start the data object with the current task data
        let data = {
            task_name: currentTask.task_name,
            task_description: currentTask.task_description,
            task_status_id: currentTask.task_status_id
        }

        // If we have a newTaskName or newTaskDescription, we verify if the string is not empty
        if ((newTaskName && cleanString(newTaskName) === '') || (newTaskDescription && cleanString(newTaskDescription) === '')) {
            setMessage({ message: 'Veuillez remplir tous les champs', className: 'error' });
            return;
        }

        // If we have a newTaskName, we update the data object
        if (newTaskName) {
            data.task_name = newTaskName;
        }

        // If we have a newTaskDescription, we update the data object
        if (newTaskDescription) {
            data.task_description = newTaskDescription;
        }

        // If we have a newTaskStatus, we update the data object
        if (newTaskStatus) {
            data.task_status_id = newTaskStatus;
        }

        // Update the task
        await updateTasks(jwt, csrfToken, id, data);
        fetchTasksList();
        setEditingTaskId(null);

        // Reset the newTaskDescription, the newTaskName and the newTaskStatus
        setNewTaskDescription('');
        setNewTaskName('');
        setNewTaskStatus(null);

        // Display a success message
        setMessage({ message: 'La tache a bien été modifiée.', className: 'success' });
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
                {message ? <div className={message.className}>{message.message}</div> : null}
            {tasksLoaded ?
                <p className={tasksList.length - tasksList.filter((task) => task.task_status_id == 4).length == 0 ? "tasks-ratio success-text" : "tasks-ratio"}>Terminées: <span>{tasksList.filter((task) => task.task_status_id == 4).length} / {tasksList.length}</span></p>
                : null}
            {userIsAuthor ?
                <button className="task-add-btn" onClick={(e) => addTask()}>Ajouter nouvelle tache</button>
                : null}
            {filterByName || filterByStatus ?
                <div className="filtered">
                    <p>Tâches triées par: <span>{filterByName ? "Nom" : "Statuts"}</span></p>
                    <p className="delete-filter" onClick={(e) => resetFilter()}>Retirer les filtres</p>
                </div>
                : null}
            <ul>
                <li className={userIsAuthor ? "author" : "user"}>
                    <p className={filterByName ? "filter filter-clicked" : "filter"} onClick={(e) => filterTasksByName()}>Nom: {filterByName ? (asc ? '▲' : '▼') : null} </p>
                    <p className={filterByStatus ? "filter filter-clicked" : "filter"} onClick={(e) => filterTasksByStatus()}>Statuts: {filterByStatus ? (asc ? '▲' : '▼') : null}</p>
                    <p>Description:</p>
                    {userIsAuthor ? <p id='action-title'>Actions:</p> : null}
                </li>
                {tasksLoaded && tasksList.length > 0 ?
                    tasksList.map((task) => {
                        return (<li key={task.task_id} className={userIsAuthor ? "author" : "user"}>
                            {editingTaskId === task.task_id ?
                                <>
                                    <input type="text" defaultValue={currentTask.task_name} onChange={(e) => setNewTaskName(DOMPurify.sanitize(e.target.value))} />
                                    <select defaultValue={currentTask.task_status_id} onChange={(e) => setNewTaskStatus(e.target.value)}>
                                        {taskStatus.map((status) => {
                                            return <option
                                                key={status.id}
                                                value={status.id}
                                            >
                                                {status.status_name}
                                            </option>
                                        })}
                                    </select>
                                    <textarea defaultValue={currentTask.task_description} onChange={(e) => setNewTaskDescription(DOMPurify.sanitize(e.target.value))}></textarea>
                                    <div className="action-buttons">
                                        <button className="confirm" onClick={(e) => updateTask(task.task_id)}>Valider</button>
                                        <button className="cancel" onClick={(e) => setEditingTaskId(null)}>Annuler</button>
                                    </div>
                                </>
                                :
                                <>
                                    <p>{DOMPurify.sanitize(task.task_name)}</p>
                                    <p className={checkStatus(task.status_name)}>{DOMPurify.sanitize(task.status_name)}</p>
                                    <p>{DOMPurify.sanitize(task.task_description)}</p>
                                    {userIsAuthor ?
                                        <div className="action-buttons">
                                            <button className="edit" onClick={(e) => {
                                                setCurrentTask(task);
                                                setEditingTaskId(task.task_id);
                                            }}>Éditer</button>
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
            </ul>
        </div>
    );
}