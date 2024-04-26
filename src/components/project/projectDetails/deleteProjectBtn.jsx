import { deleteProject } from "../../../api/deleteProject";

export default function ({ jwt, projectUuid, project, userData }) {

    async function deleteThisProject() {
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce projet?");
        if (confirmation) {
            try {
                await deleteProject(jwt, projectUuid);
                window.location.href = '/mes-projets';
            } catch (error) {
                setErrorMsg('Erreur lors de la suppression du projet');
            }
        }
    }

    return (
        <>
            {project.username === userData.username ? (<button className="delete-project-btn" onClick={deleteThisProject}>Supprimer le projet</button>) : null}
        </>
    )
}