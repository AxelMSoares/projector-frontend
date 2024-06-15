// src/context/CSRFTokenContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCSRFToken } from '../api/getCSRFToken';

const CSRFTokenContext = createContext();

export const CSRFTokenProvider = ({ children }) => {
    const [csrfToken, setCsrfToken] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            const token = await getCSRFToken();
            setCsrfToken(token);
        };
        fetchToken();
    }, []);

    return (
        <CSRFTokenContext.Provider value={csrfToken}>
            {children}
        </CSRFTokenContext.Provider>
    );
};

export const useCSRFToken = () => useContext(CSRFTokenContext);