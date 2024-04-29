import { useState, useEffect } from 'react';
import { getProjectsUserIsMember } from '../../api/getProjectsUserIsMember';

export default function UserIsProjectMember({ jwt, userData }) {

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        getProjectsWhereUserIsMember();
    }, []);

    if (!jwt) {
        window.location.href = '/connexion';
        return;
    }

    async function getProjectsWhereUserIsMember() {
        const projectList = await getProjectsUserIsMember(jwt, userData.uuid);
        setProjects(projectList);

    }

    function redirectToProjectDetails(projectUuid) {
        window.location.href = `/detail-projet/?uuid=${projectUuid}`;
    }

    return (
        <div className='projects-participate'>
            <h2>Projets auxquels je participe:</h2>
            <ul>
                {projects.length > 0 ? projects.map((project) => (
                    <li key={project.uuid} onClick={(e) => redirectToProjectDetails(project.uuid)}>
                        <p>Nom: {project.project_name}</p>
                        <p>Description: {project.project_description}</p>
                        <p>Mon role: {project.role}</p>
                    </li>
                )) : <p>Vous ne participez à aucun projet pour le moment.</p>}
            </ul>
        </div>
    )
}