export async function deleteProjectTask(jwt, id){

    try{
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/tasks/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            }
        });

        if(response.status !== 200) {
            console.error('Une erreur est survenue lors de la suppression de la tâche');
        }

    } catch(error) {
        console.error('Une erreur est survenue lors de la suppression de la tâche');
    }
}