export async function createNewProjectMember(data, jwt){
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project_members/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt,
                'CSRF-Token': csrfToken
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Une erreur est survenue');
        }
    } catch (error) {
        console.log("Une erreur est survenue lors de la création d'un nouveau membre", error);
    }
}