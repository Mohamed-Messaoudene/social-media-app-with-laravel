import { Box, Button, useTheme } from "@mui/material";
import React from "react";
import UserAvatar from "./UserAvatar";
import {
  Diversity3,
  Groups,
  Storefront,
  OndemandVideo,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

function Leftbar() {
  const {user} = useAuth();
  const theme = useTheme();
  const navigateProfilePage = ()=>{
    console.log("i will send show profile")
  }
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      color={theme.palette.primary.text}
      height="calc(100vh - 74px)" 
      padding="20px 0px 0px 20px"
      sx={{backgroundColor:theme.palette.background.paper}}  
   >
      <UserAvatar imgUrl={user.profileImagePath} username={user.username} handleClick={navigateProfilePage} />
      <Button
        variant="text"
        startIcon={<Diversity3 sx={{ color: "blue", marginRight: "8px" }} />}
        sx={{
          textTransform: "none",
          width: "80%",
          justifyContent: "flex-start",
          marginBlock:"20px"
        }}
        color="inherit"
      >
        Friends
      </Button>
      <Button
        variant="text"
        startIcon={<Groups sx={{ color: "purple", marginRight: "8px" }} />}
        sx={{
          textTransform: "none",
          width: "80%",
          justifyContent: "flex-start",
          marginBottom:"20px"
        }}
        color="inherit"
      >
        Groups
      </Button>
      <Button
        variant="text"
        startIcon={<Storefront sx={{ color: "green", marginRight: "8px" }} />}
        sx={{
          textTransform: "none",
          width: "80%",
          justifyContent: "flex-start",
          marginBottom:"20px"
        }}
        color="inherit"
      >
        Marketplace
      </Button>
      <Button
        variant="text"
        startIcon={<OndemandVideo sx={{ color: "red", marginRight: "8px" }} />}
        sx={{
          textTransform: "none",
          width: "80%",
          justifyContent: "flex-start",
          marginBottom:"20px"
        }}
        color="inherit"
      >
        Watch
      </Button>
    </Box>
  );
}

export default Leftbar;
