export async function getTaskStatus(jwt) {
    try{
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/task_status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors du chargement des statuts de tâches');
    }
}