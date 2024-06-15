export async function createNewUser(user) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/create`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "CSRF-Token": csrfToken
            },
            body: JSON.stringify(user)
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