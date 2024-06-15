export async function deleteProject(jwt, csrfToken, projectUuid) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/delete/${projectUuid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt,
                'CSRF-Token': csrfToken
            },
            credentials: 'include'
        });
        const data = await response.json();
    } catch (error) {
        console.error('Erreur lors de la suppression du projet', error);
    }
}