export async function deleteUser(jwt, csrfToken, userUUID){
    try{
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/delete/${userUUID}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": jwt,
                'CSRF-Token': csrfToken
            },
            credentials: 'include'
        });

        const data = await response.json();

        if(!response.ok){
            console.log("Une erreur est survenue lors de la suppression de l'utilisateur");
        }

    } catch (error) {
        console.log("Une erreur est survenue lors de la suppression de l'utilisateur");
    }
}