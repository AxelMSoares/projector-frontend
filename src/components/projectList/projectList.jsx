import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { formatDate, checkDateIsPassed } from '../../helpers/functions';

export default function ProjectList({ jwt }) {

    const navigate = useNavigate();
    const userData = Cookies.get('userData');
    const userUUID = userData ? JSON.parse(userData).uuid : null;
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        if (!jwt) {
            window.location.href = '/connexion'; //If the user is not connected, redirect him to the login page
            return; // Return to prevent the rest of the function from executing
        }

        async function fetchData() {
            try {
                const response = await fetch(`http://localhost:3000/projects/${userUUID}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setProjects(data); // Update the state with the projects
                } else {
                    console.error('Erreur lors de la récupération des projets:', response.statusText);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des projets:', error.message);
            }
        }

        fetchData(); // Call the function to get the projects
    }, [jwt, navigate, userUUID]); // Dependency array

    const handleProjectClick = (uuid) => {
        window.location.href = `/detail-projet/${uuid}`;
    }

    return (
        <main>
            {projects.length > 0 ? (
                <div className="project-list">
                    <h2>Mes Projets:</h2>
                    {projects.map(project => (
                        <div key={project.uuid} className="project">
                                <div className="project-content" onClick={() => handleProjectClick(project.uuid)}>
                                    <p className='project-title'>{project.project_name}</p>
                                    <p>{project.project_description}</p>
                                    <p>Créé le: {formatDate(project.CREATED)}</p>
                                    <p>Deadline: <span className={checkDateIsPassed(project.project_deadline)}>{formatDate(project.project_deadline)}</span></p>
                                    <p>Catégorie: {project.category_name}</p>
                                    <p>Statut: {project.status_name}</p>
                                </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="project-list">
                    <h2>Mes Projets:</h2>
                    <p className="no-project">Vous n'avez pas de projets en cours</p>
                </div>
            )
            }
        </main >
    );

}