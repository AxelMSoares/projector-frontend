export async function getProjectDetails(projectUuid, jwt) {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/details/${projectUuid}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jwt
                }
            });

            const data = await response.json();

            if (!response.ok) {
                console.log("Une erreur est survenue lors de la récupération du projet", data.error);
            } else {
                return data;
            }


        } catch (error) {
            console.log("Une erreur est survenue lors de la récupération du projet", error);
        }

    }
