import { formatDate, checkDateIsPassed, checkStatus, checkMessageAuthor, displayHour, assignColorToUser } from '../../helpers/functions';
import { useState, useEffect } from "react";



export default function Tchat({ projectUuid, error, jwt, userData }) {

    const [messages, setMessages] = useState([]);
    const project = projectUuid;
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Call the function to get the project messages
        getProjectMessages();
    }, []); // Empty array to avoid infinite loop


    async function getProjectMessages() {

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project_messages/${project}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jwt
                }
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMsg("Une erreur est survenue lors de la récupération des messages");
            } else {
                setErrorMessage('');
                setMessages(data);
            }

        } catch (error) {
            setErrorMessage("Une erreur est survenue lors de la récupération des messages");
            console.log("Une erreur est survenue lors de la récupération des messages", error);
        }
    }

    // Regroup messages by date
    function groupMessagesByDate(messages) {
        const groupedMessages = {};
        messages.forEach(message => {
            const date = formatDate(message.message_created); // Format the date
            if (!groupedMessages[date]) {
                groupedMessages[date] = [message];
            } else {
                groupedMessages[date].push(message);
            }
        });
        return groupedMessages;
    }

    // Get messages grouped by date
    const groupedMessages = groupMessagesByDate(messages);

    const newMessage = async (e) => {
        e.preventDefault();

        const data = {
            message_content: e.target.new_message.value,
            project_uuid: project,
            user_uuid: userData.uuid
        }

        if (!data.message_content) {
            setErrorMessage("Veuillez saisir un message");
            return;

        } else {

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project_messages/create`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": jwt
                    },
                    body: JSON.stringify(data)
                });

                if (!response.ok) {
                    setErrorMessage("Une erreur est survenue lors de l'envoi du message");
                } else {
                    setErrorMessage('');
                    getProjectMessages();
                    document.getElementById("new_message").value = ""; // Clear the input
                    window.location.reload(); // Reload the page to display the new message
                }

            } catch (error) {
                setErrorMessage("Une erreur est survenue lors de l'envoi du message");
                console.log("Une erreur est survenue lors de l'envoi du message", error);
            }

        }

    }

    const handleMessageDelete = async (e) => {
        e.preventDefault();

        const msgId = e.target.id;

        // Demander une confirmation avant de supprimer le message
        const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?");

        if (confirmation) {

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project_messages/delete/${msgId}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": jwt
                    }
                });

                if (!response.ok) {
                    setErrorMessage("Une erreur est survenue lors de la suppression du message");
                } else {
                    error = '';
                    getProjectMessages();
                    window.location.reload(); // Reload the page to display the new message
                }

            } catch (error) {
                setErrorMessage("Une erreur est survenue lors de la suppression du message");
                console.log("Une erreur est survenue lors de la suppression du message", error);
            }

        }
    }

    return (

        <div>
            <p>Tchat:</p>
            <div className="project-tchat">
                {Object.keys(groupedMessages).map(date => (
                    <div key={date} className="message-group">
                        <p className="date">{date}</p>
                        {groupedMessages[date].map(message => (
                            <div key={message.id} className={"message " + checkMessageAuthor(message.username, userData.username)} >
                                <p className="message-author" style={{ color: assignColorToUser(message.username) }}>{message.username}</p>
                                <p className="capitalize-first-letter">{message.message_content}</p>
                                <p className="time">{displayHour(message.message_created)}</p>
                                {(checkMessageAuthor(message.username, userData.username) === "myMessage") ?
                                    <div className='msg-btns'>
                                        <button className="edit-btn"> Modifier </button>
                                        <button className="delete-btn" onClick={handleMessageDelete} id={message.id}  > Supprimer </button>
                                    </div> : null
                                }
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {errorMessage ? <p className="error">{errorMessage}</p> : null}
            <form id="message-form" onSubmit={newMessage}>
                <input type="text" id="new_message" name="new_message" placeholder="Votre message..." maxLength="255" />
            </form>
        </div>
    );
}
