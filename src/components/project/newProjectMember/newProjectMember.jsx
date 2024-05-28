import { getAllUser } from "../../../api/getAllUsers"
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
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
    const [newMembersUsernames, setNewMembersUsernames] = useState([]);
    const [userUUIDMapping, setUserUUIDMapping] = useState({});

    // Get the project uuid in the url
    const urlParams = new URLSearchParams(location.search);
    const projectUuid = urlParams.get('uuid');

    // Check if all the filtered users are already members of the project


    // Get the users list and the project members list
    useEffect(() => {
        getUsers();
        getProjectMembers();
    }, []);

    // 

    // Filter the users list based on the search input
    useEffect(() => {
        if (search) {
            const filteredUsers = users.filter(user => user.username.toLowerCase().includes(search.toLowerCase()));
            setFilteredUsers(filteredUsers);
        } else {
            setFilteredUsers(users); // Show all users if the search input is empty
        }
    }, [search, users]);

    // Get the users lists
    async function getUsers() {
        const usersList = await getAllUser(jwt);
        // Create a mapping between the username and the user uuid for prevent the users uuid to appear in the html code
        const uuidMapping = {};
        usersList.forEach(user => {
            uuidMapping[user.username] = user.uuid;
        });
        setUserUUIDMapping(uuidMapping);
        setUsers(usersList);
    }

    // Get the project members list
    async function getProjectMembers() {
        try {
            const data = await getMembersList(projectUuid, jwt);
            setMembersList(data);
        } catch (error) {
            console.log("Une erreur est survenue lors de la récupération des membres du projet", error);
        }
    }

    // Check if the user is already a member of the project
    function checkIfMemberExists(user) {
        return membersList.filter(member => member.username === user.username).length !== 0;
    }

    // Handle the checkbox change
    function handleCheckboxChange(event) {
        const username = event.target.id;
        // Get the user uuid based on the username
        const uuid = userUUIDMapping[username];
        const isChecked = event.target.checked;
        if (isChecked) {
            setNewMembers(prevMembers => [...prevMembers, uuid]);
            setNewMembersUsernames(prevMembers => [...prevMembers, username]);
        } else {
            setNewMembers(prevMembers => prevMembers.filter(member => member !== uuid));
            setNewMembersUsernames(prevMembers => prevMembers.filter(member => member !== username));
        }
    }

    // Add the new members to the project
    function addNewMembers() {

        if (newMembers.length === 0) {
            return;
        }

        const membersToAdd = newMembersUsernames.join(', ');

        const confirmation = confirm(`Voulez-vous vraiment ajouter ${newMembersUsernames.length} membres à ce projet ? ${'( ' + membersToAdd + ' )'}`);

        if (!confirmation) {
            return;
        }

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
            Cookies.set('message', 'Membres ajoutés avec success');

            // Redirect to the project details page
            window.location.href = `/detail-projet/?uuid=${projectUuid}`;
        })
    }

    // Redirect to the project details page
    function returnToProject() {
        window.location.href = `/detail-projet/?uuid=${projectUuid}`;
    }

    const allFilteredUsersAreMembers = filteredUsers.every(user => checkIfMemberExists(user) || user.username === userData.username);

    return (
        <div className="newProjectMember">
            <h3>Ajouter des membres</h3>
            <div>
                <p>Rechercher par pseudo:</p>
                <input type="text" id="member-search" name="member-search" onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="membersList">
                {search && allFilteredUsersAreMembers ? (
                    <p>Aucun utilisateur trouvé avec ce pseudo ou l'utilisateur est déjà membre du projet.</p>
                ) : filteredUsers.length > 0 ?
                    filteredUsers.map(user => {
                        if (userData.username !== user.username && !checkIfMemberExists(user)) {
                            return (
                                <div key={user.username}>
                                    <input type="checkbox" id={user.username} value={user.username} onChange={handleCheckboxChange} />
                                    <label htmlFor={user.username}>{user.username}</label>
                                </div>
                            );
                        } else {
                            return null;
                        }
                    }) : <p>Aucun utilisateur trouvé avec ce pseudo ou l'utilisateur est déjà membre du projet.</p>
                }
                {newMembers.length > 0 ? <p>{newMembers.length} membres sélectionnés</p> : null}
            </div>
            <button className="return-project-btn" onClick={(e) => returnToProject()}>Annuler</button>
            <button className="add-member-btn" onClick={addNewMembers}>Ajouter</button>
        </div>
    )
}