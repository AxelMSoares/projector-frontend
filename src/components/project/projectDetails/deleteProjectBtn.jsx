import { useEffect } from "react";
import { deleteProject } from "../../../api/deleteProject";
import { useCSRFToken } from "../../../context/CSRFTokenContext";

export default function ({ jwt, projectUuid, project, userData, setErrorMsg }) {

    const csrfToken = useCSRFToken();

    useEffect(() => {
        if (project) {
            checkIfUserIsAuthorized();
        }
    }, [project]);

    function checkIfUserIsAuthorized() {

        if (userData.statut === "administrateur") {
            return true;
        }

        return project.username === userData.username;
    }

    async function deleteThisProject() {

        // If the user is not the author of the project, we don't allow him to delete it
        if (!jwt || !projectUuid || !checkIfUserIsAuthorized()){
            return null;
        }

        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce projet?");
        if (confirmation) {
                const result = await deleteProject(jwt, csrfToken, projectUuid);
                if (result && result.error) {
                    setErrorMsg(result.error);
                    return;
                }

                window.location.href = '/mes-projets';
        }
    }

    return (
        <>
            {project.username === userData.username || userData.statut==="administrateur" ? (<button className="delete-project-btn" onClick={deleteThisProject}>Supprimer le projet</button>) : null}
        </>
    )
}