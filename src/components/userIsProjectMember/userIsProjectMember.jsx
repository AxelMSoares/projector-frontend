import { useState, useEffect } from 'react';
import { getProjectsUserIsMember } from '../../api/getProjectsUserIsMember';
import { formatDate } from '../../helpers/functions';

export default function UserIsProjectMember({ jwt, userData }) {

    const [projects, setProjects] = useState([]);
    const [filterByName, setfilterByName] = useState(false);
    const [filterByCreationDate, setfilterByCreationDate] = useState(false);
    const [filterByCategory, setfilterByCategory] = useState(false);
    const [filterName, setFilterName] = useState('');
    const [asc, setAsc] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    if (!jwt) {
        window.location.href = '/connexion';
        return;
    }

    async function fetchData() {
        const projectList = await getProjectsUserIsMember(jwt, userData.uuid);
        setProjects(projectList);

    }

    function redirectToProjectDetails(projectUuid) {
        window.location.href = `/detail-projet/?uuid=${projectUuid}`;
    }

    // Function to filter the projects by name
    const filterProjectsByName = () => {
        setfilterByName(true);
        setfilterByCreationDate(false);
        setfilterByCategory(false);
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
    }

    // Function to filter the projects by creation date
    const filterProjectsByCreationDate = () => {
        setfilterByName(false);
        setfilterByCreationDate(true);
        setfilterByCategory(false);
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
    }

    // Function to filter the projects by category
    const filterProjectsByCategory = () => {
        setfilterByName(false);
        setfilterByCreationDate(false);
        setfilterByCategory(true);
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
    }

    // Reset the filters and buttons to the default
    function resetFilters() {
        setfilterByName(false);
        setfilterByCreationDate(false);
        setfilterByCategory(false);
        setFilterName('');
        fetchData();

    }

    console.log(projects);

    return (
        <main className='projects-participate'>
            <h2>Projets auxquels je participe:</h2>
            <div className="filters">
                <p>Trier par:</p>
                <button className={filterByName ? "clicked" : ""} onClick={(e) => filterProjectsByName()}>Nom {filterByName ? (asc ? '▲' : '▼') : null}</button>
                <button className={filterByCreationDate ? "clicked" : ""} onClick={(e) => filterProjectsByCreationDate()}>Date de création {filterByCreationDate ? (asc ? '▲' : '▼') : null}</button>
                <button className={filterByCategory ? "clicked" : ""} onClick={(e) => filterProjectsByCategory()}>Catégorie {filterByCategory ? (asc ? '▲' : '▼') : null}</button>
                {filterByName || filterByCreationDate || filterByCategory ?
                    <div className='filter-name'>
                        <p>Projets triés par: <span>{filterName}</span></p>
                        <button id="delete-filters" onClick={(e) => resetFilters()}>Retirer les filtres</button>
                    </div> : null}
            </div>
            {projects.length > 0 ?
                <ul>
                    {projects.map((project) => (
                        <li key={project.uuid} onClick={(e) => redirectToProjectDetails(project.uuid)}>
                            <p>Nom: <span>{project.project_name}</span></p>
                            <p>Description: <span>{project.project_description}</span></p>
                            <p>Date de création: <span>{formatDate(project.project_created)}</span></p>
                            <p>Catégorie: <span>{project.category_name}</span></p>
                            <p>Mon role: <span>{project.role}</span></p>
                        </li>
                    ))}
                </ul> :
                <p>Vous ne participez à aucun projet pour le moment.</p>
            }

        </main>
    )
}