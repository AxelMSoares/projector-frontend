export async function updateUserPassword(uuid, jwt, csrfToken, pwd) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/update/pwd/${uuid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt,
                'CSRF-Token': csrfToken
            },
            body: JSON.stringify({ pwd }),
            credentials: 'include'
        });
        
        if (response.ok) {
            return response.json();
        }
    } catch (error) {
        console.log("Une erreur est survenue lors de la mise à jour du mot de passe de l'utilisateur.")
    }
}