import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { formatDate, checkDateIsPassed, checkStatus } from '../../helpers/functions';


export default function ProjectDetails({ jwt }) {

    useEffect(() => {
        // Call the function to get the project details
        getProjectDetails();
    }, []); // Empty array to avoid infinite loop


    const location = useLocation();
    const [project, setProject] = useState({});
    const [errorMsg, setErrorMsg] = useState('');

    // Search in the url the project uuid
    const searchParams = new URLSearchParams(location.search);
    const projectUuid = searchParams.get('uuid');

    async function getProjectDetails() {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/details/${projectUuid}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jwt
                }
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMsg(data.error);
                console.log("Une erreur est survenue lors de la récupération du projet", data.error);
            } else {
                setErrorMsg('');
            }
            setProject(data[0]);

        } catch (error) {
            setErrorMsg('Erreur lors du chargement du projet');
            console.log("Une erreur est survenue lors de la récupération du projet", error);
        }


    }




    return (
        <div className="project-detail">
            <h2>Project Details</h2>
            <p>{ project.project_name }</p>
            <p>Auteur: {project.username}</p>
            <p>Description: { project.project_description }</p>
            <p>Crée le: { formatDate(project.created) }</p>
            <p>Date limite: <span className={ checkDateIsPassed(project.project_deadline) }>{ formatDate(project.project_deadline) }</span></p>
            <p>Statut: <span className={ checkStatus(project.status_name) }>{ project.status_name }</span></p>
        </div>
    )
}