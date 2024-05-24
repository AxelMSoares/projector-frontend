import { useState, useEffect } from "react";
import { getProjectTasks } from "../../../api/getProjectTasks";

export default function TasksField({ project, jwt }) {

    const [tasksList, setTasksList] = useState([]);
    const [tasksLoaded, setTasksLoaded] = useState(false);

    useEffect(() => {
        if (project.uuid) {
            fetchTasksList();
        }
    }, [project.uuid]);

    async function fetchTasksList() {
        try {
            const data = await getProjectTasks(jwt, project.uuid);
            setTasksList(data);
            setTasksLoaded(true);
        } catch (error) {
            console.error('Une erreur est survenue lors de la récupération des tâches du projet');
        }
    }

    async function addTask() {
        window.location.href = `/projet/nouvelle-tache/?uuid=${project.uuid}`;
        return null;
    }

    if (tasksLoaded) {
        console.log(tasksList);
    }

    return (
        <div className="tasks-field">
            <h3>Taches:</h3>
            <button className="task-add-btn" onClick={addTask}>Ajouter nouvelle tache</button>
            <ul>
                <li> <p> Nom: </p> <p>Description:</p> <p>Status:</p> </li>
                {tasksLoaded && tasksList.length > 0 ? tasksList.map((task) => {
                    return (<li key={task.task_id}>
                        <p>{task.task_name}</p>
                        <p>{task.task_description}</p>
                        <p>{task.status_name}</p>
                    </li>
                    )
                }) : <li> Pas de tâches pour le moment</li>}
            </ul>
        </div>
    );
}