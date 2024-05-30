import { getProjectDetails } from "../../../api/getprojectDetails";
import { getMembersList } from "../../../api/getMembersList";
import { updateProjectDetails } from "../../../api/updateProject";
import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { formatDate, checkDateIsPassed, checkStatus, checkAdminStatus, checkProjectAuthor, checkProjectMember } from '../../../helpers/functions';
import DeleteProjectBtn from "./deleteProjectBtn";
import ProjectMembers from "./projectMembers";
import Deadline from "./deadlineField";
import CategoryField from "./categoryField";
import StatusField from "./statusField";
import DescriptionField from "./descriptionField";
import TasksField from "./tasksField";


export default function ProjectDetails({ jwt, userData }) {

    const location = useLocation();
    const [project, setProject] = useState({});
    const [errorMsg, setErrorMsg] = useState('');
    const [membersList, setMembersList] = useState([]);
    const [projectLoaded, setProjectLoaded] = useState(false);
    const [membersLoaded, setMembersLoaded] = useState(false);
    // Search in the url the project uuid
    const searchParams = new URLSearchParams(location.search);
    const projectUuid = searchParams.get('uuid');

    useEffect(() => {

        if (jwt && projectUuid) {
            const fetchData = async () => {
                await fetchProjectDetails(jwt, projectUuid);
                await fetchMembersList(jwt, projectUuid);
            }
            fetchData();
        }
    }, [jwt, projectUuid]);

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

    if (!projectUuid) {
        window.location.href = '/mes-projets';
        return null;
    }

    async function fetchProjectDetails() {
        try {
            const data = await getProjectDetails(projectUuid, jwt);
            setProject(data[0]);
            setProjectLoaded(true);

        } catch (error) {
            setErrorMsg('Erreur lors du chargement du projet');
            console.log("Une erreur est survenue lors de la récupération du projet", error);
        }
    }

    async function fetchMembersList() {
        try {
            const data = await getMembersList(projectUuid, jwt);
            setMembersList(data);
            setMembersLoaded(true);
        } catch (error) {
            console.log("Une erreur est survenue lors de la récupération des membres du projet", error);
        }
    }

    async function updateProject(dataToUpdate) {
        try {
            await updateProjectDetails(projectUuid, jwt, dataToUpdate);
        } catch (error) {
            console.log(
                "Une erreur est survenue lors de la mise à jour du projet",
                error
            );
        }
        await fetchProjectDetails(jwt, projectUuid);
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
        <div className="project-detail-body">
            {errorMsg ?
                <div className="error">{errorMsg}</div> :
                (
                    <>
                        <div className="project-detail">
                            < DeleteProjectBtn jwt={jwt} projectUuid={projectUuid} project={project} userData={userData} />
                            <h2 className="capitalize-first-letter">{project.project_name}</h2>
                            <p className="detail">Auteur: <span className="capitalize-first-letter">{project.username}</span></p>
                            <p className="detail">Crée le: <span>{formatDate(project.project_created)}</span></p>
                            < DescriptionField project={project} userData={userData} onUpdate={updateProject} />
                            < CategoryField project={project} jwt={jwt} userData={userData} onUpdate={updateProject} />
                            < Deadline project={project} userData={userData} onUpdate={updateProject} />
                            < StatusField project={project} userData={userData} onUpdate={updateProject} jwt={jwt} />
                            < ProjectMembers projectUuid={projectUuid} jwt={jwt} userData={userData} project={project} membersList={membersList} />
                            < TasksField project={project} userData={userData} jwt={jwt} />
                            <button className="tchat-access-btn" onClick={redirectToTchat}>Acceder au tchat du projet (Bêta)</button>
                        </div>
                    </>
                )
            }
        </div>
    );
} 
