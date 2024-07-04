export async function getMembersList(projectUuid, jwt, csrfToken) {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project_members/${projectUuid}`, {
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
                return await response.json();
            } else {
                return data;
            }

        } catch (error) {
            console.log("Une erreur est survenue lors de la récupération des membres du projet", error);
        }
    }
