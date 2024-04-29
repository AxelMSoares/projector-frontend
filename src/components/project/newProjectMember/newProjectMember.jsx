import { getAllUser } from "../../../api/getAllUsers"
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { createNewProjectMember } from "../../../api/createNewProjectMember";
import { getMembersList } from "../../../api/getMembersList";

export default function NewProjectMember() {

    const [jwt, setJwt] = useState(Cookies.get('jwt') ? Cookies.get('jwt') : null);
    const [userData, setUserData] = useState(Cookies.get('userData') ? JSON.parse(Cookies.get('userData')) : null);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [newMembers, setNewMembers] = useState([]);
    const [membersList, setMembersList] = useState([]);
    const [search, setSearch] = useState('');
    const location = useLocation();

    // Get the project uuid in the url
    const urlParams = new URLSearchParams(location.search);
    const projectUuid = urlParams.get('uuid');

    
    // / Récupérer la liste complète des utilisateurs au chargement
    useEffect(() => {
        getUsers();
        getProjectMembers();
    }, []);

    // Filter the users list based on the search input
    useEffect(() => {
        if (search) {
            const filteredUsers = users.filter(user => user.username.toLowerCase().includes(search.toLowerCase()));
            setFilteredUsers(filteredUsers);
        } else {
            setFilteredUsers(users); // Afficher tous les utilisateurs lorsque la recherche est vide
        }
    }, [search, users]);

    async function getUsers() {
        const usersList = await getAllUser(jwt);
        setUsers(usersList);
    }

    async function getProjectMembers() {
        try {
            const data = await getMembersList(projectUuid, jwt);
            setMembersList(data);
        } catch (error) {
            console.log("Une erreur est survenue lors de la récupération des membres du projet", error);
        }
    }

    function checkIfMemberExists(user) {
        return membersList.filter(member => member.username === user.username).length !== 0;
    }

    function handleCheckboxChange(event) {
        const value = event.target.value;
        const isChecked = event.target.checked;
        if (isChecked) {
            setNewMembers(prevMembers => [...prevMembers, value]);
        } else {
            setNewMembers(prevMembers => prevMembers.filter(member => member !== value));
        }
    }

    function addNewMembers() {
        newMembers.map(member => {
            // Set the new member data
            const data = {
                project_uuid: projectUuid,
                user_uuid: member,
                role: 'Membre'
            }

            // Add the new member to the project
            createNewProjectMember(data, jwt);

            // Stock the message in the cookies
            Cookies.set('message', 'Les membres ont bien été ajoutés');

            // Redirect to the project details page
            window.location.href = `/detail-projet/?uuid=${projectUuid}`;
        })
    }

    return (
        <div className="newProjectMember">
            <h3>Ajouter des membres</h3>
            <div>
                <p>Rechercher par pseudo:</p>
                <input type="text" id="member-search" name="member-search" onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="membersList">
                {filteredUsers.map(user => {
                    if ((userData.username !== user.username)) {
                        if (!checkIfMemberExists(user)) {
                            return (
                                <div key={user.username}>
                                    <input type="checkbox" id={user.uuid} value={user.uuid} onChange={handleCheckboxChange} />
                                    <label htmlFor={user.uuid}>{user.username}</label>
                                </div>
                            );
                        } else {
                            return null;
                        }

                    } else {
                        return null;
                    }
                })}
            </div>
            <button onClick={addNewMembers}>Ajouter</button>
        </div>
    )
}