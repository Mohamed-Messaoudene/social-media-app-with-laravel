import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchBar from "./SearchBar";
import {
    MailOutline,
    Bedtime,
    NotificationsNone,
    LightMode,
    Logout,
    PersonAdd, // Icon for Register
    Login,
    Groups, // Icon for Login
} from "@mui/icons-material";
import UserAvatar from "../../ui/Avatar";
import { grey } from "@mui/material/colors";
import { useCustomTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext.js";
import { Link } from "@inertiajs/react";

function Navbar() {
    const theme = useTheme();
    const { mode, toggleTheme } = useCustomTheme();
    const {  user,isLoggedIn, logout } = useAuth();

    return (
        <Box
            position="fixed"
            top="0px"
            left="0px"
            zIndex="100"
            height="70px"
            width="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            paddingInline="15px"
            borderBottom="1px solid"
            borderColor={grey[300]}
            bgcolor={theme.palette.background.paper}
        >
            <Box
                width="45%"
                display={"flex"}
                justifyContent="space-around"
                alignItems="center"
            >
                <Link href={"/"} style={{ textDecoration: "none" }}>
                    <Box display="flex" alignItems="center">
                        <Groups sx={{ fontSize:"33px", color: theme.palette.text.primary, marginRight: "10px" }} />
                        <Typography
                            variant="body1"
                            fontWeight="bold"
                            color={theme.palette.text.primary
                            }
                        >
                            Social Media
                        </Typography>
                    </Box>
                </Link>
                <IconButton aria-label="dark mode" onClick={toggleTheme}>
                    {mode == "light" ? <Bedtime /> : <LightMode />}
                </IconButton>
                <SearchBar />
            </Box>

            {/* Conditionally render based on authentication status */}
            <Box
                width="500px"
                display={"flex"}
                justifyContent="space-around"
                alignItems="center"
            >
                {isLoggedIn ? (
                    // Display when user is authenticated
                    <>
                        <IconButton aria-label="messages">
                            <MailOutline />
                        </IconButton>
                        <IconButton aria-label="notifications">
                            <NotificationsNone />
                        </IconButton>
                        <Link href={`/profile/${user!.username}`} style={{textDecoration:"none"}}>
                        <UserAvatar
                            username={user!.username}
                            imgUrl={user!.profile_image_url}
                        />
                        </Link>
                      
                        <IconButton aria-label="logout" onClick={logout}>
                            <Logout />
                        </IconButton>
                    </>
                ) : (
                    // Display when user is not authenticated
                    <>
                        <Link href="/register">
                            <IconButton
                                aria-label="register"
                                // component={Link}
                                // href="/register"
                                sx={{ color: theme.palette.text.primary }} // Use primary color
                            >
                                <PersonAdd /> 
                                <Typography
                                    variant="body2"
                                    sx={{ marginLeft: "5px" }}
                                >
                                    Register
                                </Typography>
                            </IconButton>
                        </Link>
                        <Link href="/login">

                        <IconButton
                            aria-label="login"
                            // component={Link}
                            // href="/login"
                            sx={{ color: theme.palette.text.primary }} // Use primary color
                        >
                            <Login /> {/* Login Icon */}
                            <Typography
                                variant="body2"
                                sx={{ marginLeft: "5px" }}
                            >
                                Login
                            </Typography>
                        </IconButton>
                        </Link>

                    </>
                )}
            </Box>
        </Box>
    );
}

export default Navbar;
