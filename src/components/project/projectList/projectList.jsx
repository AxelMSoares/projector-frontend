import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, checkDateIsPassed, checkStatus } from '../../../helpers/functions';
import { getUserProjects } from '../../../api/getUserProjects';
import { useCSRFToken } from '../../../context/CSRFTokenContext';
import Cookies from 'js-cookie';

export default function ProjectList({ jwt }) {
    const navigate = useNavigate();
    const userData = Cookies.get('userData');
    const userUUID = userData ? JSON.parse(userData).uuid : null;
    const csrfToken= useCSRFToken();
    const [projects, setProjects] = useState([]);
    const [asc, setAsc] = useState('');
    const [filterByName, setFilterByName] = useState(false);
    const [filterByCreationDate, setFilterByCreationDate] = useState(false);
    const [filterByCategory, setFilterByCategory] = useState(false);
    const [filterName, setFilterName] = useState('');
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 4; // Number of projects per page

    useEffect(() => {
        if (!jwt) {
            window.location.href = '/connexion'; // If the user is not connected, redirect him to the login page
            return; // Return to prevent the rest of the function from executing
        }

        fetchData(); // Call the function to get the projects
    }, [jwt, navigate, userUUID]); // Dependency array

    async function fetchData() {
        try {
            const response = await getUserProjects(userUUID, jwt, csrfToken);
            setProjects(response); // Update the state with the projects
        } catch (error) {
            console.error('Erreur lors de la récupération des projets:', error.message);
        }
    }

    // Function to filter the projects by name
    const filterProjectsByName = () => {
        setFilterByName(true);
        setFilterByCreationDate(false);
        setFilterByCategory(false);
        setFilterName('Nom');

        if (asc) {
            const sortedProjects = projects.sort((a, b) => a.project_name.localeCompare(b.project_name));
            setProjects([...sortedProjects]);
            setAsc(false);
        } else {
            const sortedProjects = projects.sort((a, b) => b.project_name.localeCompare(a.project_name));
            setProjects([...sortedProjects]);
            setAsc(true);
        }
    };

    // Function to filter the projects by creation date
    const filterProjectsByCreationDate = () => {
        setFilterByName(false);
        setFilterByCreationDate(true);
        setFilterByCategory(false);
        setFilterName('Date de création');

        if (asc) {
            const sortedProjects = projects.sort((a, b) => a.project_created.localeCompare(b.project_created));
            setProjects([...sortedProjects]);
            setAsc(false);
        } else {
            const sortedProjects = projects.sort((a, b) => b.project_created.localeCompare(a.project_created));
            setProjects([...sortedProjects]);
            setAsc(true);
        }
    };

    // Function to filter the projects by category
    const filterProjectsByCategory = () => {
        setFilterByName(false);
        setFilterByCreationDate(false);
        setFilterByCategory(true);
        setFilterName('Catégorie');

        if (asc) {
            const sortedProjects = projects.sort((a, b) => a.category_name.localeCompare(b.category_name));
            setProjects([...sortedProjects]);
            setAsc(false);
        } else {
            const sortedProjects = projects.sort((a, b) => b.category_name.localeCompare(a.category_name));
            setProjects([...sortedProjects]);
            setAsc(true);
        }
    };

    // Reset the filters and buttons to the default
    function resetFilters() {
        setFilterByName(false);
        setFilterByCreationDate(false);
        setFilterByCategory(false);
        setFilterName('');
        fetchData();
    }

    // Redirect to the project details on click
    const handleProjectClick = (uuid) => {
        window.location.href = `/detail-projet/?uuid=${uuid}`;
    };

    // Filter projects by search input
    const filteredProjects = projects.filter(project =>
        project.project_name.toLowerCase().includes(search.toLowerCase())
    );

    // Get current projects based on pagination
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <main>
            {projects.length > 0 ? (
                <div className="project-list">
                    <h2>Mes Projets:</h2>
                    <div className="filters">
                        <div className='search-box'>
                            <input
                                type="text"
                                placeholder="Rechercher un projet par nom..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1); // Reset to first page on search
                                }}
                            />
                        </div>
                        <p>Trier par:</p>
                        <button className={filterByName ? "clicked" : ""} onClick={filterProjectsByName}>
                            Nom {filterByName ? (asc ? '▲' : '▼') : null}
                        </button>
                        <button className={filterByCreationDate ? "clicked" : ""} onClick={filterProjectsByCreationDate}>
                            Date de création {filterByCreationDate ? (asc ? '▲' : '▼') : null}
                        </button>
                        <button className={filterByCategory ? "clicked" : ""} onClick={filterProjectsByCategory}>
                            Catégorie {filterByCategory ? (asc ? '▲' : '▼') : null}
                        </button>
                        {filterByName || filterByCreationDate || filterByCategory ? (
                            <div className='filter-name'>
                                <p>Projets triés par: <span>{filterName}</span></p>
                                <button id="delete-filters" onClick={resetFilters}>Retirer les filtres</button>
                            </div>
                        ) : null}
                    </div>
                    {search ? <p className='results-text'>Resultats de la recherche:</p> : null}
                    {currentProjects && currentProjects.length > 0 ? (
                        currentProjects.map(project => (
                            <div key={project.uuid} className="project">
                                <div className="project-content" onClick={() => handleProjectClick(project.uuid)}>
                                    <p className='project-title'>{project.project_name}</p>
                                    <p>{project.project_description}</p>
                                    <p>Créé le: <span>{formatDate(project.project_created)}</span></p>
                                    <p>Catégorie: <span>{project.category_name}</span></p>
                                    {project.project_deadline ? (
                                        <p>Deadline: <span className={checkDateIsPassed(project.project_deadline)}>{formatDate(project.project_deadline)}</span></p>
                                    ) : (
                                        <p>Deadline: <span className="success-text">Pas de date limite</span></p>
                                    )}
                                    <p>Statut: <span className={checkStatus(project.status_name)}>{project.status_name}</span></p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Pas de résultats trouvés pour cette recherche.</p>
                    )}
                    <div className="pagination">
                        <p>Pages:</p>
                        {Array.from({ length: Math.ceil(filteredProjects.length / projectsPerPage) }).map((_, i) => (
                            <button
                                className={currentPage === i + 1 ? 'pages-btn active' : 'pages-btn'}
                                key={i + 1}
                                onClick={() => paginate(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="project-list">
                    <h2>Mes Projets:</h2>
                    <p className="no-project">Vous n'avez pas de projets en cours</p>
                </div>
            )}
        </main>
    );
}
