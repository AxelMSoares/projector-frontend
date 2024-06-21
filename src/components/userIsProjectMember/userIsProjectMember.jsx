import { useState, useEffect } from 'react';
import { getProjectsUserIsMember } from '../../api/getProjectsUserIsMember';
import { formatDate } from '../../helpers/functions';
import { useCSRFToken } from '../../context/CSRFTokenContext';
import DOMPurify from 'dompurify';

export default function UserIsProjectMember({ jwt, userData }) {
    const [projects, setProjects] = useState([]);
    const [filterByName, setfilterByName] = useState(false);
    const [filterByCreationDate, setfilterByCreationDate] = useState(false);
    const [filterByCategory, setfilterByCategory] = useState(false);
    const [filterName, setFilterName] = useState('');
    const [asc, setAsc] = useState(true);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 4; // Number of projects per page
    const csrfToken = useCSRFToken();

    useEffect(() => {
        if (jwt && csrfToken) {
            fetchData();
        }
    }, []);

    if (!jwt) {
        window.location.href = '/connexion';
        return;
    }

    async function fetchData() {
        const projectList = await getProjectsUserIsMember(jwt, csrfToken, userData.uuid);
        setProjects(projectList);
    }

    function redirectToProjectDetails(projectUuid) {
        window.location.href = `/detail-projet/?uuid=${projectUuid}`;
    }

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

    function resetFilters() {
        setfilterByName(false);
        setfilterByCreationDate(false);
        setfilterByCategory(false);
        setFilterName('');
        fetchData();
    }

    const filteredProjects = projects.filter(project =>
        project.project_name.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <main className='projects-participate'>
            <h2>Projets auxquels je participe:</h2>
            <div className="filters">
                <div className='search-wrapper'>
                    <input
                        type="text"
                        placeholder="Rechercher un projet par nom..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
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
            {search ? <p className='results-text'>Résultats de la recherche:</p> : null}
            {currentProjects.length > 0 ?
                <ul>
                    {currentProjects.map((project) => (
                        <li key={project.uuid} onClick={(e) => redirectToProjectDetails(project.uuid)}>
                            <p>Nom: <span>{DOMPurify.sanitize(project.project_name)}</span></p>
                            <p>Description: <span>{DOMPurify.sanitize(project.project_description)}</span></p>
                            <p>Date de création: <span>{formatDate(project.project_created)}</span></p>
                            <p>Catégorie: <span>{DOMPurify.sanitize(project.category_name)}</span></p>
                            <p>Mon rôle: <span>{DOMPurify.sanitize(project.role)}</span></p>
                        </li>
                    ))}
                </ul> :
                <p>Pas de résultats trouvés pour cette recherche.</p>
            }
            <div className="pagination">
                <p>Pages:</p>
                {Array.from({ length: Math.ceil(filteredProjects.length / projectsPerPage) }, (_, i) => (
                    <button className={currentPage === i + 1 ? 'pages-btn active' : 'pages-btn'} key={i + 1} onClick={() => paginate(i + 1)}>
                        {i + 1}
                    </button>
                ))}
            </div>
        </main>
    );
}
