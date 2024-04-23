import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { formatDate, checkDateIsPassed, checkStatus, checkAdminStatus, checkProjectAuthor, checkProjectMember } from '../../../helpers/functions';
import ProjectMembers from "./projectMembers";
import Deadline from "./deadlineField";
import CategoryField from "./categoryField";
import StatusField from "./statusField";
import DescriptionField from "./descriptionField";


export default function ProjectDetails({ jwt, userData }) {

    const location = useLocation();
    const [project, setProject] = useState({});
    const [errorMsg, setErrorMsg] = useState('');
    const [membersList, setMembersList] = useState([]);
    const [projectLoaded, setProjectLoaded] = useState(false);
    const [membersLoaded, setMembersLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await getProjectDetails();
            await getMembersList();
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (projectLoaded && membersLoaded) {
            checkIfUserIsAuthorised(userData, project, membersList);
        }
    }, [projectLoaded, membersLoaded]);


    // If not token or not userdata, redirect to connexion page
    if (!jwt || !userData) {

        window.location.href = '/connexion';
        return null;

    }

    // Search in the url the project uuid
    const searchParams = new URLSearchParams(location.search);
    const projectUuid = searchParams.get('uuid');

    if (!projectUuid) {
        window.location.href = '/mes-projets';
        return null;
    }

    async function getProjectDetails() {
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
                setErrorMsg(data.error);
                console.log("Une erreur est survenue lors de la récupération du projet", data.error);
            } else {
                setErrorMsg('');
                setProject(data[0]);
                setProjectLoaded(true);
            }


        } catch (error) {
            setErrorMsg('Erreur lors du chargement du projet');
            console.log("Une erreur est survenue lors de la récupération du projet", error);
        }

    }

    async function getMembersList() {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project_members/${projectUuid}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jwt
                }
            });

            const data = await response.json();

            if (!response.ok) {
                console.log("Une erreur est survenue lors de la récupération des membres du projet", data.error);
            } else {
                setMembersList(data);
                setMembersLoaded(true);
            }

        } catch (error) {
            console.log("Une erreur est survenue lors de la récupération des membres du projet", error);
        }
    }

    async function updateProject(dataToUpdate) {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/update/${projectUuid}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: jwt,
                },
                body: JSON.stringify(dataToUpdate),
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

        getProjectDetails();

    }

    function redirectToTchat() {
        window.location.href = `/projet/tchat/?uuid=${projectUuid}`;
    }

    async function checkIfUserIsAuthorised(userData, project, membersList) {
        // Check if the user is a admin
        if (!checkAdminStatus(userData.statut)) {
            // Check if the user is the author of the project
            if (!checkProjectAuthor(userData.uuid, project.user_uuid)) {
                // Check if the user is a member of the project
                if (!checkProjectMember(membersList, userData.uuid)) {
                    setErrorMsg('Vous n\'êtes pas autorisé à accéder à ce projet');
                }
            }
        }
    }

    return (
        <div>
            {errorMsg ?
                <div className="error">{errorMsg}</div> :
                <div className="project-detail">
                    <h2 className="capitalize-first-letter">{project.project_name}</h2>
                    <p className="detail">Auteur: <span className="capitalize-first-letter">{project.username}</span></p>
                    <p className="detail">Crée le: <span>{formatDate(project.project_created)}</span></p>
                    < DescriptionField project={project} />
                    < CategoryField project={project} jwt={jwt} onUpdate={updateProject}/>
                    < Deadline project={project} userData={userData} onUpdate={updateProject} />
                    < StatusField project={project} userData={userData} onUpdate={updateProject} jwt={jwt} />
                    < ProjectMembers projectUuid={projectUuid} jwt={jwt} userData={userData} project={project} membersList={membersList} />
                    <button className="tchat-access-btn" onClick={redirectToTchat}>Acceder au tchat du projet</button>
                </div>
            }
        </div>
    );
} 
