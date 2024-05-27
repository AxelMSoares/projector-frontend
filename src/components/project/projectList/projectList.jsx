import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { formatDate, checkDateIsPassed, checkStatus } from '../../../helpers/functions';
import { getUserProjects } from '../../../api/getUserProjects';

export default function ProjectList({ jwt }) {

    const navigate = useNavigate();
    const userData = Cookies.get('userData');
    const userUUID = userData ? JSON.parse(userData).uuid : null;
    const [projects, setProjects] = useState([]);
    const [asc, setAsc] = useState('');
    const [nameFilterclicked, setNameFilterClicked] = useState('');
    const [creationDateFilterClicked, setCreationDateFilterClicked] = useState('');
    const [categoryFilterClicked, setCategoryFilterClicked] = useState('');

    useEffect(() => {
        if (!jwt) {
            window.location.href = '/connexion'; //If the user is not connected, redirect him to the login page
            return; // Return to prevent the rest of the function from executing
        }


        fetchData(); // Call the function to get the projects
    }, [jwt, navigate, userUUID]); // Dependency array

    async function fetchData() {
        try {
            const response = await getUserProjects(userUUID, jwt);
            setProjects(response); // Update the state with the projects
        } catch (error) {
            console.error('Erreur lors de la récupération des projets:', error.message);
        }
    }

    // Function to filter the projects by name
    const filterByName = () => {
        if (asc) {
            const sortedProjects = projects.sort((a, b) => a.project_name.localeCompare(b.project_name));
            setProjects([...sortedProjects]);
            setAsc(false);
            setAllBtnsToDefault();
            setNameFilterClicked('clicked');
        } else {
            const sortedProjects = projects.sort((a, b) => b.project_name.localeCompare(a.project_name));
            setProjects([...sortedProjects]);
            setAsc(true);
            setAllBtnsToDefault();
            setNameFilterClicked('clicked');
        }
    }

    // Function to filter the projects by creation date
    const filterByCreationDate = () => {
        if (asc) {
            const sortedProjects = projects.sort((a, b) => a.project_created.localeCompare(b.project_created));
            setProjects([...sortedProjects]);
            setAsc(false);
            setAllBtnsToDefault();
            setCreationDateFilterClicked('clicked');
        } else {
            const sortedProjects = projects.sort((a, b) => b.project_created.localeCompare(a.project_created));
            setProjects([...sortedProjects]);
            setAsc(true);
            setAllBtnsToDefault();
            setCreationDateFilterClicked('clicked');
        }
    }

    // Function to filter the projects by category
    const filterByCategory = () => {
        if (asc) {
            const sortedProjects = projects.sort((a, b) => a.category_name.localeCompare(b.category_name));
            setProjects([...sortedProjects]);
            setAsc(false);
            setAllBtnsToDefault();
            setCategoryFilterClicked('clicked');
        } else {
            const sortedProjects = projects.sort((a, b) => b.category_name.localeCompare(a.category_name));
            setProjects([...sortedProjects]);
            setAsc(true);
            setAllBtnsToDefault();
            setCategoryFilterClicked('clicked');
        }
    }

    // Function to filter the projects by deadline
    const filterByDeadline = () => {
        if (asc) {
            const sortedProjects = projects.sort((a, b) => a.project_deadline.localeCompare(b.project_deadline));
            setProjects([...sortedProjects]);
            setAsc(false);
        } else {
            const sortedProjects = projects.sort((a, b) => b.project_deadline.localeCompare(a.project_deadline));
            setProjects([...sortedProjects]);
            setAsc(true);
        }
    }

    function handleDeleteFilters() {
        setAllBtnsToDefault();
        setAsc('');
        fetchData();
    }

    // Reset the buttons to the default
    function setAllBtnsToDefault() {
        setNameFilterClicked('');
        setCreationDateFilterClicked('');
        setCategoryFilterClicked('');
    }


    // Redirect to the project details on click
    const handleProjectClick = (uuid) => {
        window.location.href = `/detail-projet/?uuid=${uuid}`;
    }

    return (
        <main>
            {projects.length > 0 ? (
                <div className="project-list">
                    <h2>Mes Projets:</h2>
                    <div className="filters">
                        <p>Trier par:</p>
                        <button className={nameFilterclicked} onClick={filterByName}>Nom</button>
                        {nameFilterclicked ? <button id="delete-filters" onClick={() => handleDeleteFilters()}>X</button> : null}
                        <button className={creationDateFilterClicked} onClick={filterByCreationDate}>Date de création</button>
                        {creationDateFilterClicked ? <button id="delete-filters" onClick={() => handleDeleteFilters()}>X</button> : null}
                        <button className={categoryFilterClicked} onClick={filterByCategory}>Catégorie</button>
                        {categoryFilterClicked ? <button id="delete-filters" onClick={() => handleDeleteFilters()}>X</button> : null}
                        {asc === '' ? asc : asc ? <p>Décroissant</p> : <p>Croissant</p>}
                    </div>
                    {projects.map(project => (
                        <div key={project.uuid} className="project">
                            <div className="project-content" onClick={() => handleProjectClick(project.uuid)}>
                                <p className='project-title'>{project.project_name}</p>
                                <p>{project.project_description}</p>
                                <p>Créé le: <span>{formatDate(project.project_created)}</span></p>
                                <p>Catégorie: <span>{project.category_name}</span></p>
                                {project.project_deadline ? <p>Deadline: <span className={checkDateIsPassed(project.project_deadline)}>{formatDate(project.project_deadline)}</span></p> : <p> Deadline: <span className="success-text">Pas de data limite</span></p>}
                                <p>Statut: <span className={checkStatus(project.status_name)}>{project.status_name}</span></p>
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