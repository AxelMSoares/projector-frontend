import { useState, useEffect } from "react";
import { getProjectTasks } from "../../../api/getProjectTasks";

export default function TasksField({ project, jwt }) {


    const [tasksList, setTasksList] = useState([]);

    useEffect(() => {
        if (jwt && project) {
            fetchTasksList();
        }
    }, [jwt, project]);

    async function fetchTasksList() {
        try {
            const data = await getProjectTasks(jwt, project.uuid);
            setTasksList(data);
        } catch (error) {
            console.error('Une erreur est survenue lors de la récupération des tâches du projet');
        }
    }

    return (
        <div className="tasks-field">
            <h3>Taches:</h3>
            <button className="task-add-btn">Ajouter nouvelle tache</button>
            <ul>
                <li> <p> Nom: </p> <p>Membres attribués:</p> <p>Status:</p> </li>
                {tasksList.length > 0 ? tasksList.map((task) => {
                    <li key={task.uuid}>
                        <p>{task.name}</p>
                        <p>{task.members}</p>
                        <p>{task.status}</p>
                    </li>
                }) : <li> Pas de tâches pour le moment</li>}
            </ul>
        </div>
    );
}