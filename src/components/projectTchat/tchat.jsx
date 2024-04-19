import { formatDate, checkDateIsPassed, checkStatus, checkMessageAuthor, displayHour, assignColorToUser } from '../../helpers/functions';
import { useState, useEffect } from "react";


export default function Tchat({ projectUuid, error, jwt, userData }) {

    const [messages, setMessages] = useState([]);
    const project = projectUuid;

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
                error="Une erreur est survenue lors de la récupération des messages"
            } else {
                error = '';
                setMessages(data);
            }

        } catch (error) {
            error="Une erreur est survenue lors de la récupération des messages"
            console.log("Une erreur est survenue lors de la récupération des messages", error);
        }
    }

    // Fonction pour regrouper les messages par date
    function groupMessagesByDate(messages) {
        const groupedMessages = {};
        messages.forEach(message => {
            const date = formatDate(message.message_created); // Formattez la date d'envoi du message
            if (!groupedMessages[date]) {
                groupedMessages[date] = [message];
            } else {
                groupedMessages[date].push(message);
            }
        });
        return groupedMessages;
    }

    // Récupérez les messages groupés par date
    const groupedMessages = groupMessagesByDate(messages);

    return (

        <div>
            <p>Tchat:</p>
            <div className="project-tchat">
                {Object.keys(groupedMessages).map(date => (
                    <div key={date} className="message-group">
                        <p className="date">{date}</p>
                        {groupedMessages[date].map(message => (
                            <div key={message.id} className={"message " + checkMessageAuthor(message.username, userData.username)}>
                                <p className="message-author" style={{ color: assignColorToUser(message.username) }}>{message.username}</p>
                                <p className="capitalize-first-letter">{message.message_content}</p>
                                <p className="time">{displayHour(message.message_created)}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <form id="message-form">
                <input type="text" id="new_message" name="new_message" placeholder="Votre message..." maxLength="255" />
            </form>
        </div>
    );
}
