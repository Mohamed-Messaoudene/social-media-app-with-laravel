import React from "react";
import { Box } from "@mui/material";
import MyFriends from "./MyFriends";
import OnlineFriends from "./OnlineFriends";
import Suggestions from "./Suggesstions";

function Rightbar() {
    return (
        <Box
            display="flex"
            flexDirection="column"
            gap={2}
            px={2}
            py={2.5}
        >
            <OnlineFriends />
            <Suggestions />
            <MyFriends />
        </Box>
    );
}

export default Rightbar;