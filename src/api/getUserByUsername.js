export async function getUserByUsername(username, jwt, csrfToken) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/username/${username}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": jwt,
                "CSRF-Token": csrfToken
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            console.log("Une erreur est survenue lors de la récupération de l'utilisateur", data.error);
        } else {
            return data[0];
        }

    } catch (error) {
        console.log("Une erreur est survenue lors de la récupération de l'utilisateur", error);
    }
}