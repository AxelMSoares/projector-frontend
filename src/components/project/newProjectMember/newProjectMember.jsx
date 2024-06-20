import { useState, useEffect } from "react";
import { getAllUser } from "../../../api/getAllUsers";
import { createNewProjectMember } from "../../../api/createNewProjectMember";
import { getMembersList } from "../../../api/getMembersList";
import { useCSRFToken } from '../../../context/CSRFTokenContext';
import Cookies from "js-cookie";

export default function NewProjectMember() {

    const [jwt, setJwt] = useState(Cookies.get('jwt') ? Cookies.get('jwt') : null);
    const [userData, setUserData] = useState(Cookies.get('userData') ? Cookies.get('userData') : null);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [newMembers, setNewMembers] = useState([]);
    const [membersList, setMembersList] = useState([]);
    const [search, setSearch] = useState('');
    const [newMembersUsernames, setNewMembersUsernames] = useState([]);
    const [userUUIDMapping, setUserUUIDMapping] = useState({});
    const [projectAuthor, setProjectAuthor] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5; // Number of users per page
    const [selectedMembers, setSelectedMembers] = useState([]);
    const csrfToken = useCSRFToken();

    // Get the project uuid in the url
    const urlParams = new URLSearchParams(location.search);
    const projectUuid = urlParams.get('uuid');

    // Get the users list and the project members list
    useEffect(() => {
        Cookies.get('project_author') ? setProjectAuthor(Cookies.get('project_author')) : setProjectAuthor('');
    }, []);

    useEffect(() => {
        if(csrfToken && jwt) {
            getUsers();
            getProjectMembers();
        }
    }, [csrfToken, jwt]);

    // Filter the users list based on the search input
    useEffect(() => {
        if (search) {
            const filteredUsers = users.filter(user =>
                user.username.toLowerCase().includes(search.toLowerCase()) &&
                !checkIfMemberExists(user) &&
                user.username !== projectAuthor
            );
            setFilteredUsers(filteredUsers);
        } else {
            const filteredUsers = users.filter(user =>
                !checkIfMemberExists(user) &&
                user.username !== projectAuthor
            );
            setFilteredUsers(filteredUsers);
        }
    }, [search, users, projectAuthor, membersList]);

    // Check if the user is the project author
    function checkIfUserIsAuthor(userData, projectAuthor) {
        if (projectAuthor) {
            return userData.username === projectAuthor.author;
        }
    }

    // Get the users lists
    async function getUsers() {
        const usersList = await getAllUser(jwt, csrfToken);

        // Filter out the project author and existing project members
        const filteredUsers = usersList.filter(user => {
            return user.username !== userData.username && !membersList.some(member => member.username === user.username);
        });

        // Create a mapping between the username and the user uuid for preventing the user uuid to appear in the HTML code
        const uuidMapping = {};
        filteredUsers.forEach(user => {
            uuidMapping[user.username] = user.uuid;
        });

        setUserUUIDMapping(uuidMapping);
        setUsers(filteredUsers);
    }

    // Get the project members list
    async function getProjectMembers() {
        try {
            const data = await getMembersList(projectUuid, jwt, csrfToken);
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
            setSelectedMembers(prevMembers => [...prevMembers, uuid]);
            setNewMembers(prevMembers => [...prevMembers, uuid]);
            setNewMembersUsernames(prevMembers => [...prevMembers, username]);
        } else {
            setSelectedMembers(prevMembers => prevMembers.filter(member => member !== uuid));
            setNewMembers(prevMembers => prevMembers.filter(member => member !== uuid));
            setNewMembersUsernames(prevMembers => prevMembers.filter(member => member !== username));
        }
    }

    // Add the new members to the project
    function addNewMembers() {

        if (!checkIfUserIsAuthor(userData, projectAuthor)) {
            console.log("Vous n'êtes pas l'auteur du projet");
            return;
        }

        if (newMembers.length === 0) {
            console.log("Aucun membre n'a été sélectionné");
            return;
        }

        const membersToAdd = newMembersUsernames.join(', ');

        const confirmation = confirm(`Voulez-vous vraiment ajouter ${newMembersUsernames.length} membres à ce projet ? ${'( ' + membersToAdd + ' )'}`);

        if (!confirmation) {
            return;
        }

        newMembers.forEach(member => {
            // Set the new member data
            const data = {
                project_uuid: projectUuid,
                user_uuid: member,
                role: 'Membre'
            }

            // Add the new member to the project
            createNewProjectMember(data, jwt, csrfToken);

            // Stock the message in the cookies
            Cookies.set('message', JSON.stringify({ message: 'Les membres ont bien été ajoutés au projet', class: 'success' }));

            // Remove the project author from the Cookies
            Cookies.remove('project_author');
        });

        // Redirect to the project details page
        window.location.href = `/detail-projet/?uuid=${projectUuid}`;
    }

    // Redirect to the project details page
    function returnToProject() {
        Cookies.remove('project_author');
        window.location.href = `/detail-projet/?uuid=${projectUuid}`;
    }

    const allFilteredUsersAreMembers = filteredUsers.every(user => checkIfMemberExists(user) || checkIfUserIsAuthor(userData, projectAuthor));

    // Pagination Logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <main className="newProjectMember">
            <h3>Ajouter des membres</h3>
            <div>
                <p>Rechercher par pseudo:</p>
                <input type="text" id="member-search" name="member-search" placeholder="Rentrez ici votre recherche..." onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="membersList">
                {search && allFilteredUsersAreMembers ? (
                    <p>Aucun utilisateur trouvé avec ce pseudo ou l'utilisateur est déjà membre du projet.</p>
                ) : currentUsers.length > 0 ?
                    currentUsers.map(user => {
                        const isSelected = selectedMembers.includes(user.uuid);
                        if (userData.username !== user.username && !checkIfMemberExists(user)) {
                            return (
                                <div key={user.username}>
                                    <input type="checkbox" id={user.username} value={user.username} checked={isSelected} onChange={handleCheckboxChange} />
                                    <label htmlFor={user.username}>{user.username}</label>
                                </div>
                            );
                        } else {
                            return null;
                        }
                    }) : <p>Aucun utilisateur trouvé avec ce pseudo ou l'utilisateur est déjà membre du projet.</p>
                }
                {selectedMembers.length > 0 ? <p>{selectedMembers.length} membres sélectionnés</p> : null}
            </div>
            <p className="adverting">* Si un membre n'apparait pas dans la liste, c'est parce qu'il est peut-être l'auteur ou il est déjà membre du projet. De plus, la pagination est utilisée pour afficher les membres par page, alors assurez-vous de naviguer à travers les pages pour voir tous les membres disponibles.</p>
            <div className="pagination">
                <p>Page:</p>
                {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }).map((_, index) => (
                    <button key={index + 1} className={currentPage === index + 1 ? 'active' : null} onClick={() => paginate(index + 1)}>{index + 1}</button>
                ))}
            </div>
            <button className="return-project-btn" onClick={returnToProject}>Annuler</button>
            <button className="add-member-btn" onClick={addNewMembers}>Ajouter</button>
        </main>
    );
}
