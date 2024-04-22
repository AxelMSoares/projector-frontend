import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { formatDate, checkDateIsPassed, checkStatus } from '../../helpers/functions';


export default function ProjectDetails({ jwt, userData }) {

    useEffect(() => {
        // Call the function to get the project details
        getProjectDetails();
    }, []); // Empty array to avoid infinite loop

    const location = useLocation();
    const [project, setProject] = useState({});

    const [errorMsg, setErrorMsg] = useState('');

    if (!jwt) {
        window.location.href = '/connexion';
        return null;
    }

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
                setProject(data[0]);

                if (userData) {
                    if (userData.username != data[0].username && userData.statut !== 'administrateur') {
                        setErrorMsg('Vous n\'avez pas les droits pour accéder à ce projet');
                        return;
                    }
                }
            }

        } catch (error) {
            setErrorMsg('Erreur lors du chargement du projet');
            console.log("Une erreur est survenue lors de la récupération du projet", error);
        }
    }

    function redirectToTchat() {
        window.location.href = `/projet/tchat/?uuid=${projectUuid}`;
    }

    return (
        <div>
            {errorMsg ?
                <div className="error">{errorMsg}</div> :
                <div className="project-detail">
                    <h2 className="capitalize-first-letter">{project.project_name}</h2>
                    <p className="detail">Auteur: <span className="capitalize-first-letter">{project.username}</span></p>
                    <p className="detail">Description: {project.project_description}</p>
                    <p className="detail">Crée le: {formatDate(project.created)}</p>
                    <p className="detail">Date limite: <span className={checkDateIsPassed(project.project_deadline)}>{formatDate(project.project_deadline)}</span></p>
                    <p className="detail">Statut: <span className={checkStatus(project.status_name)}>{project.status_name}</span></p>
                    <div className="members">
                        <p>Membres:</p>
                        <p>Pas encore de membres dans ce projet.</p>
                    </div>
                    <button className ="tchat-access-btn" onClick = {redirectToTchat}>Acceder au tchat du projet</button>
                </div>
            }
        </div>
    );
} 
