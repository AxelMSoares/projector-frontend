export async function updateTasks(jwt, id, data){

    try{
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks/update/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": jwt,
                "CSRF-Token": csrfToken
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            console.log("Une erreur est survenue lors de la mise à jour de la tâche", result.error);
        } 
    } catch (error) {
        console.log("Une erreur est survenue lors de la mise à jour de la tâche", error);
    }
}