import { Box, useTheme } from "@mui/material";
import React from "react";
import Suggesstions from "./Suggesstions";
import OnlineFriends from "./OnlineFriends";
import MyFriends from "./MyFriends";

function Rightbar() {
    const theme = useTheme();
    return (
        <Box
            padding="20px 15px 30px 0px"
        >
            <Suggesstions />
            <MyFriends />
            <OnlineFriends />
        </Box>
    );
}

export default Rightbar;
