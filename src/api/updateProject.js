export async function updateProjectDetails(projectUuid, jwt, csrfToken, data) {
    try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/update/${projectUuid}`, {
                method: "PUT",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': jwt,
                    'CSRF-Token': csrfToken
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            if (!response.ok) {
                return await response.json();
            }


        } catch (error) {
            console.log(
                "Une erreur est survenue lors de la mise à jour du projet",
                error
            );
        }
}