import { escape } from 'html-entities';


// Check if the password has at least 8 characters, one uppercase letter, one lowercase letter, and one number
export function checkPasswordFormat(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
    return passwordRegex.test(password);
}

// Check if the email is valid
export function checkEmailFormat(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

// Check if the username is valid
export function checkUsernameFormat(username) {
    const usernameRegex = /^[a-zA-Z0-9]{3,}$/;
    return usernameRegex.test(username);
}

// Check if the email and its confirmation match
export function checkEmailMatch(email, emailConfirm) {
    return email === emailConfirm;
}

// Check if the password and its confirmation match
export function checkPasswordMatch(password, passwordConfirm) {
    return password === passwordConfirm;
}

// Clean a string before saving it to the database
export function cleanString(string) {
    if (!string) return ''; // Retourne une chaîne vide si l'entrée est vide

    const regex = /<[^>]*>/g;
    const cleanedString = string.replace(regex, '').trim();
    return escape(cleanedString); // Return the cleaned string
}

// Transform a date format to DD/MM/YYYY
export function formatDate(date) {
    const options = { weekday:'long', year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('fr-FR', options);
}

// Transform a date to format YYYY/MM/DD
export function formatDateToYYYYMMDD(date) {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0'); // Pour obtenir un format MM (ex: 03)
    const day = parsedDate.getDate().toString().padStart(2, '0'); // Pour obtenir un format DD (ex: 05)
    return `${year}/${month}/${day}`;
}

// Check if the date is in the past
export function checkDateIsPassed(date) {
    if (new Date(date) < new Date()){
        return 'error-text'
    } else {
        return 'success-text'
    }
}

// Check the status and change de class name accordingly
export function checkStatus(status) {
    switch (status) {
        case 'En cours':
            return 'ongoing-color';
        case 'Terminé':
            return 'done-color';
        case 'Annulé':
            return 'cancelled-color';
        case 'En pause':
            return 'paused-color';
        default:
            return 'ongoing-color';
    }
}

// Check if i'm the message sender
export function checkMessageAuthor(messageAuthor, username) {
    return messageAuthor === username ? 'myMessage' : 'otherMessage';
}

// Only display the hour and minutes of a date
export function displayHour(date) {
    return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

// Fonction pour attribuer une couleur cohérente à un utilisateur
export function assignColorToUser(username) {
    // Utilisez une fonction de hachage pour générer un nombre unique à partir du nom d'utilisateur
    // Vous pouvez utiliser une fonction de hachage comme DJB2 ou FNV-1a
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Convertissez le hash en une couleur RGB
    const r = (hash & 0xFF) + 60; // Composante rouge
    const g = ((hash >> 8) & 0xFF) + 60; // Composante verte
    const b = ((hash >> 16) & 0xFF) + 60; // Composante bleue
    return `rgb(${r}, ${g}, ${b})`; // Retourne la couleur sous forme de chaîne
}

// Check if the user status is "administrateur"
export function checkAdminStatus(status) {
    return (status === 'administrateur' ? true : false);
}

// Check if the user is a project member
export function checkProjectMember(projectMembers, userUuid) {
    const member = projectMembers.find(member => member.uuid === userUuid);

    if (member) {
        return true;
    }

    // if no member has the same uuid as the user, return false
    return false;
}

// Check if the user is the project author
export function checkProjectAuthor(projectAuthor, userUuid) {
    return (projectAuthor === userUuid ? true : false);
}