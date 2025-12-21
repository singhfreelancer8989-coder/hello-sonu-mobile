import React, { useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getToken } from '../utility/secureStorage.utility';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessionToken, setSessionToken] = useState(null);

    useEffect(() => {
        async function loadSessionToken() {
            try {
                const token = await getToken();
                setSessionToken(token);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        }

        async function loadUser() {
            if (token) {
                // fetch user
                //set user and send through context
                //set to secureStorage
            }
        }

        loadSessionToken();
    }, [])

    const contextValue = useMemo({
        user,
        setUser,
        loading,
        sessionToken,
        setSessionToken,
        isSignedIn: !!sessionToken,
    }, [user, sessionToken, loading])

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}   


export default AuthProvider;