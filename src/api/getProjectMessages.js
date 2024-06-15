export async function getProjectMessages(jwt, csrfToken , projectUuid) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project_messages/${projectUuid}`, {
            headers: {
                'Authorization': jwt,
                'CSRF-Token': csrfToken
            },
            credentials: 'include'
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des messages du projet', error);
        throw error;
    }
}