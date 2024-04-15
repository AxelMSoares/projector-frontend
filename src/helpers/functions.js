import escape from 'html-entities';


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