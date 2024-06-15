export async function updateUser(jwt, csrfToken, uuid, data) {

    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/update/${uuid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt,
                'CSRF-Token': csrfToken
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });
        return await response.json();

    } catch (error) {
        console.log("Une erreur est survenue lors de la mise à jour de l'utilisateur");
    }
}
