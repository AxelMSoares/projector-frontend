export async function createNewUser(user) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/create`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user),
            credentials: 'include'
        });

        if (response.ok) {
            console.log(response.status);
            return response;
        } else {
            const errorData = await response.json();
            return errorData;
        }


    } catch (error) {
        console.log("Erreur lors de la création de l'utilisateur", error.message);
        throw error;
    }
}   