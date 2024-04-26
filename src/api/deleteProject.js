export async function deleteProject(jwt, projectUuid) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/delete/${projectUuid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            }
        });
        const data = await response.json();
    } catch (error) {
        console.error('Erreur lors de la suppression du projet', error);
    }
}