export async function getProjectsUserIsMember(jwt, userUUID) {

    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project_members/user/${userUUID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            }
        });
        const data = response.json();

        if (!response.ok) {
            console.log("Une erreur est survenue lors de la récupération des projets", data.error);
        } else {
            return data;
        }
        
    } catch (error) {
        console.error('Une erreur est survenue lors de la récupération des projets de l\'utilisateur');
    }

}