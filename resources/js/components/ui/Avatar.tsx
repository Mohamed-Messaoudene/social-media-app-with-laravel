import { Box, Typography, useTheme } from "@mui/material";
import { teal, green } from "@mui/material/colors";
import React from "react";

type UserAvatarProps = {
    imgUrl: string | null;
    username: string;
    extraInfo?: string;
    isOnline?: boolean;
};

function UserAvatar({ imgUrl="https://via.placeholder.com/150", username, extraInfo = "", isOnline = false }: UserAvatarProps) {
    const theme = useTheme();
    return (
        <Box
            display="flex"
            alignItems="center"
            sx={{
                cursor: "pointer",
                "&:hover": {
                    ".username": {
                        color: teal[400],
                    },
                },
            }}
        >
            <Box
                sx={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    border: "1px solid",
                    borderColor: theme.palette.secondary.main,
                    marginRight: "10px",
                    backgroundImage: `url(${imgUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    position: "relative",
                    transition: "transform 0.4s linear",
                }}
            >
                {isOnline && (
                    <Box
                        sx={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            backgroundColor: green[500],
                            position: "absolute",
                            bottom: "0px",
                            right: "0px",
                            border: "1px solid white",
                        }}
                    />
                )}
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                    className="username"
                    variant="subtitle1"
                    fontSize="13px"
                    fontWeight="bold"
                    color={theme.palette.text.primary}
                    sx={{ transition: "transform 0.4s linear" }}
                >
                    {username}
                </Typography>
                <Typography variant="body1" fontSize={"10px"} color={theme.palette.text.primary}>
                    {extraInfo}
                </Typography>
            </Box>
        </Box>
    );
}

export default UserAvatar;
