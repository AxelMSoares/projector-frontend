export async function createNewProjectTask(jwt, csrfToken, task) {

    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt,
                'CSRF-Token': csrfToken
            },
            body: JSON.stringify(task),
            credentials: 'include'
        });

        if (response.ok) {
            return response.json();
        } else {
            console.log("Une erreur est survenue lors de la création de la tâche");
        }
    } catch (error) {
        console.error('Erreur lors de la création de la tâche', error);
    }
}