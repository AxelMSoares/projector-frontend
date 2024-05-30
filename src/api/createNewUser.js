export async function createNewUser(user) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/create`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            return response;
        }
        
    } catch (error) {
        console.log("Erreur lors de la création de l'utilisateur");
    }
}