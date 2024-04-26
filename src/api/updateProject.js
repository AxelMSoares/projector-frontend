export async function updateProjectDetails(projectUuid, jwt, data) {
    try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/update/${projectUuid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: jwt,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                console.log(
                    "Une erreur est survenue lors de la mise à jour du projet",
                );
            }

            const responseData = await response.json();

        } catch (error) {
            console.log(
                "Une erreur est survenue lors de la mise à jour du projet",
                error
            );
        }
}