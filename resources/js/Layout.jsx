import React from "react";
import NavBar from "./components/navbar/Navbar";
import { Alert, Snackbar, useTheme } from "@mui/material";
import { useSnackBar } from "./context/SnackBarContext";

const Layout = ({ children }) => {
    const theme = useTheme();
    const { snackBarParams, setSnackBarParams } = useSnackBar();
    // Function to close the Snackbar
    const handleCloseSnackbar = () => {
        setSnackBarParams((prevParams) => ({
            ...prevParams,
            open: false,
        }));
    };

    return (
        <div
            style={{
                position: "relative",
                minHeight: "100vh",
                backgroundColor: theme.palette.background.bgcolor,
            }}
        >
            {/* Fixed Navbar at the top */}
            <NavBar />

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
            <Snackbar
                open={snackBarParams.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackBarParams.color}
                    sx={{ width: "100%" }}
                >
                    {snackBarParams.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Layout;
