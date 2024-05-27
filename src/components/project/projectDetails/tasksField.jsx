import { useState, useEffect } from "react";
import { getProjectTasks } from "../../../api/getProjectTasks";
import { getTaskStatus } from "../../../api/getTaskStatus";
import { updateTasks } from "../../../api/updateTasks";
import { checkStatus } from "../../../helpers/functions";
import { deleteProjectTask } from "../../../api/deleteProjectTask";
import { cleanString } from "../../../helpers/functions";

export default function TasksField({ project, jwt, userData }) {

    const [tasksList, setTasksList] = useState([]);
    const [taskStatus, setTaskStatus] = useState([]);
    const [tasksLoaded, setTasksLoaded] = useState(false);
    const [userIsAuthor, setuserIsAuthor] = useState(false);
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskStatus, setNewTaskStatus] = useState(1);
    const [message, setMessage] = useState('');
    const [editingTaskId, setEditingTaskId] = useState(null);

    useEffect(() => {
        if (project.uuid) {
            fetchTasksList();
            fetchTaskStatus();
            checkIfUserIsAuthor();
        }
    }, [project.uuid]);

    // if a message exist, display the message and set it to a empty string after 5 seconds
    useEffect(() => {
        if (message) {
            setTimeout(() => {
                setMessage('');
            }, 5000);
        }
    }
        , [message]);

    function checkIfUserIsAuthor() {
        if (project.username == userData.username) {
            setuserIsAuthor(true)
            return;
        }
    }

    async function fetchTasksList() {
        const data = await getProjectTasks(jwt, project.uuid);
        setTasksList(data);
        setTasksLoaded(true);
    }

    async function fetchTaskStatus() {
        const data = await getTaskStatus(jwt);
        setTaskStatus(data);
    }

    async function addTask() {
        window.location.href = `/projet/nouvelle-tache/?uuid=${project.uuid}`;
        return null;
    }

    async function deleteTask(taskId) {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer cette tache ?");
        if (confirmation) {
            await deleteProjectTask(jwt, taskId);
            setMessage('La tâche a bien été supprimée');
            fetchTasksList();
        }
    }

    async function updateTask(id) {
        const data = {
            task_name: cleanString(newTaskName),
            task_description: cleanString(newTaskDescription),
            task_status_id: newTaskStatus
        }

        if (!data.task_name || !data.task_description) {
            data.task_name = tasksList.filter((task) => task.task_id == id)[0].task_name;
            data.task_description = tasksList.filter((task) => task.task_id == id)[0].task_description;
            setMessage('Merci de remplir tous les champs');
            setEditingTaskId(null);
            return;
        }

        await updateTasks(jwt, id, data);
        fetchTasksList();
        setEditingTaskId(null);
    }

    return (
        <div className="tasks-field">
            <h3>Taches:</h3>
            {tasksLoaded ? <p>{tasksList.filter((task) => task.task_status_id == 4).length} / {tasksList.length}</p> : null}
            {userIsAuthor ? <button className="task-add-btn" onClick={addTask}>Ajouter nouvelle tache</button> : null}
            <ul>
                <li className={userIsAuthor ? "author" : "user"}>
                    <p>Nom:</p>
                    <p>Description:</p>
                    <p>Status:</p>
                    {userIsAuthor ? <p>Actions:</p> : null}
                </li>
                {tasksLoaded && tasksList.length > 0 ? tasksList.map((task) => {
                    return (<li key={task.task_id} className={userIsAuthor ? "author" : "user"}>
                        {editingTaskId === task.task_id ?
                            <>
                                <input type="text" defaultValue={task.task_name} onChange={(e) => setNewTaskName(e.target.value)} />
                                <textarea defaultValue={task.task_description} onChange={(e) => setNewTaskDescription(e.target.value)}></textarea>
                                <select onChange={(e) => setNewTaskStatus(e.target.value)}>
                                    {taskStatus.map((status) => {
                                        return <option key={status.id} value={status.id}>{status.status_name}</option>
                                    })}
                                </select>
                                <div className="action-buttons">
                                    <button className="edit" onClick={(e) => updateTask(task.task_id)}>Valider</button>
                                    <button className="delete" onClick={(e) => setEditingTaskId(null)}>Annuler</button>
                                </div>
                            </>
                            :
                            <>
                                <p>{task.task_name}</p>
                                <p>{task.task_description}</p>
                                <p className={checkStatus(task.status_name)}>{task.status_name}</p>
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
                {message ? <div className="task-message">{message}</div> : null}
            </ul>
        </div>
    );
}