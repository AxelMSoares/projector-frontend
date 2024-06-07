import { formatDate, checkDateIsPassed, checkStatus, checkMessageAuthor, displayHour, assignColorToUser } from '../../../helpers/functions';
import { useState, useEffect, useRef } from "react";



export default function Tchat({ projectUuid, error, jwt, userData }) {

    // Search in the url the project uuid
    const searchParams = new URLSearchParams(location.search);
    const projectUUID = searchParams.get('uuid');

    const [messages, setMessages] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [editingMessage, setEditingMessage] = useState(null);
    const scrollRef = useRef(null); // Reference to the last message

    useEffect(() => {
        const invervalId = setInterval(() => {
            // Call the function to get the project messages
            getProjectMessages();
        }, 1000); // Refresh the messages every 10 seconds

        return () => clearInterval(invervalId);

    }, []); // Empty array to avoid infinite loop

    useEffect(() => {
        scrollToBottom(); // Call the function to scroll to the bottom of the chat
    }, [messages]); // Execute the function when the messages change

    if (!jwt) {
        window.location.href = "/connexion"; // Redirect to the login page if the user is not connected
        return;
    }

    // Function to get the project messages
    async function getProjectMessages() {

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project_messages/${projectUUID}`, {
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
            project_uuid: projectUUID,
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
                    console.log(data);
                    document.getElementById("new_message").value = ""; // Clear the input
                    // window.location.reload(); // Reload the page to display the new message
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

        // Ask for confirmation before deleting the message
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

    const updateMessage = async (messageId, newContent) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/project_messages/update/${messageId}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": jwt
                },
                body: JSON.stringify({ message_content: newContent })
            });

            if (!response.ok) {
                setErrorMessage("Une erreur est survenue lors de la mise à jour du message");
            } else {
                setErrorMessage('');
                getProjectMessages();
                setEditingMessage(null); // Reset the editing message
            }

        } catch (error) {
            setErrorMessage("Une erreur est survenue lors de la mise à jour du message");
            console.log("Une erreur est survenue lors de la mise à jour du message", error);
        }
    };

    // Function to handle de form submission to edit a message
    const handleEditFormSubmit = async (e, messageId) => {
        e.preventDefault();
        const newContent = e.target.new_content.value;
        if (newContent.trim() === "") {
            setErrorMessage("Veuillez saisir un contenu valide pour le message");
            return;
        }

        if (newContent === editingMessage.content) {
            setEditingMessage(null);
            return;
        }
        await updateMessage(messageId, newContent);
    };

    // Function to activate the edit mode
    const activateEditMode = (messageId, messageContent) => {
        setEditingMessage({ id: messageId, content: messageContent });
    };

    function scrollToBottom() {
        // Scroll to the bottom of the chat
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }

    function redirectToProject() {
        window.location.href = `/detail-projet/?uuid=${projectUUID}`;
    }


    return (

        <main className='tchat-background'>
            <p>Tchat:</p>
            <button className="return-btn" onClick={(e)=>redirectToProject()}>Retourner au projet</button>
            <div className="project-tchat">
                {Object.keys(groupedMessages).map(date => (
                    <div key={date} className="message-group">
                        <p className="date">{date}</p>
                        {groupedMessages[date].map(message => (
                            <div key={message.id} className={"message " + checkMessageAuthor(message.username, userData.username)} >
                                <p className="message-author" style={{ color: assignColorToUser(message.username) }}>{message.username}</p>
                                {editingMessage && editingMessage.id === message.id ? (
                                    // Display de form to edit the message
                                    <form onSubmit={(e) => handleEditFormSubmit(e, message.id)}>
                                        <textarea name="new_content" className="new-content" defaultValue={editingMessage.content}></textarea>
                                        <button type="submit" className="validate-edit-btn">Valider</button>
                                    </form>
                                ) : (
                                    // Display the message content
                                    <>
                                        <p className="capitalize-first-letter">{message.message_content}</p>
                                        {message.modified == true ? <p className="message-modified">Modifié.</p> : null}
                                        <p className="time">{displayHour(message.message_created)}</p>
                                        {(checkMessageAuthor(message.username, userData.username) === "myMessage") &&
                                            <div className='msg-btns'>
                                                <button className="edit-btn" onClick={() => activateEditMode(message.id, message.message_content)}>Modifier</button>
                                                <button className="delete-btn" onClick={handleMessageDelete} id={message.id}>Supprimer</button>
                                            </div>
                                        }
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {errorMessage ? <p className="error">{errorMessage}</p> : null}
            <form id="message-form" onSubmit={newMessage}>
                <input type="text" id="new_message" name="new_message" placeholder="Votre message..." maxLength="255" />
            </form>
            <div ref={scrollRef}></div>
        </main>
    );
}
