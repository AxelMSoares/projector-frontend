export async function getProjectTasks(jwt, projectUuid) {

    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks/${projectUuid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt,
                'CSRF-Token': csrfToken
            }
        });
        const data = response.json();

        if (!response.ok) {
            console.log("Une erreur est survenue lors de la récupération des tâches");
        } else {
            return data;
        }
        
    } catch (error) {
        console.error('Une erreur est survenue lors de la récupération des tâches du projet');
    }

}