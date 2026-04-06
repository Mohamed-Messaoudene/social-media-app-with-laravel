import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { SnackBarProvider } from "@/context/SnackBarContext";
import Navbar from "../components/layout/navbar/Navbar";
import { ThemeProvider } from "../context/ThemeContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ThemeProvider>
                <SnackBarProvider>
                    <div
                        style={{
                            position: "relative",
                            minHeight: "100vh",
                            // backgroundColor: theme.palette.background.bgcolor,
                        }}
                    >
                        {/* Fixed Navbar at the top */}
                        <Navbar />

                        {/* Main content with padding to avoid overlapping with the Navbar */}
                        <main
                            style={{
                                paddingTop: "70px",
                                height: "100vh", // Adjust height to account for the Navbar
                                overflowY: "auto",
                            }}
                        >
                            {children}
                        </main>
                    </div>
                </SnackBarProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}
