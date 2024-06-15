export async function deleteProjectMember(id, jwt, csrfToken) {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project_members/delete/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": jwt,
                "CSRF-Token": csrfToken
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            console.log("Une erreur est survenue lors de la suppression du membre");
        }

    } catch (error) {
        console.log("Une erreur est survenue lors de la suppression du membre", error);
    }
}
