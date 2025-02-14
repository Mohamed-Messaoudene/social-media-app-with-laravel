import { Inertia } from "@inertiajs/inertia";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: async () => {},
    logout: async () => {},
    setUser:()=>{}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ auth, children }) => {
    const [user, setUser] = useState(auth.user);
    const [isAuthenticated, setIsAuthenticated] = useState(!!auth.user);
    const [isLoading, setIsLoading] = useState(false);

    // Function to log in the user
    const login = async (credentials) => {
        setIsLoading(true);
        try {
            await Inertia.post("/login", credentials, {
                onSuccess: () => {
                    // Extract the user from the Inertia page props
                    const user = Inertia.page.props.auth.user;

                    // // Transform the user object to include full paths
                    // const transformedUser = {
                    //     ...user, // Spread all existing user properties
                    //     profileImagePath: user.profileImagePath
                    //         ? `/storage/${user.profileImagePath}`
                    //         : "/default-profile-image.jpg", // Add full path or default
                    //     covertureImagePath: user.covertureImagePath
                    //         ? `/storage/${user.covertureImagePath}`
                    //         : "/default-coverture-image.jpg", // Add full path or default
                    // };

                    // Update the AuthContext state
                    console.log(user)
                    setUser(user);
                    setIsAuthenticated(true);
                },
                onError: (errors) => {
                    console.error("Login failed:", errors);
                },
            });
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to log out the user
    const logout = async () => {
        setIsLoading(true);
        try {
            await Inertia.post(
                "/logout",
                {},
                {
                    onSuccess: () => {
                        setUser(null);
                        setIsAuthenticated(false);
                    },
                    onError: (errors) => {
                        console.error("Logout failed:", errors);
                    },
                }
            );
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                login,
                logout,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
