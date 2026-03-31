import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import UserAvatar from "../../ui/Avatar";
import ScrollableBox from "../../ui/ScrollableBox";
import { MoodBad } from "@mui/icons-material"; // Import an icon
import { usePage } from "@inertiajs/react";
import { SharedProps } from "../../../types/global";
import { User } from "../../../types/common";


function OnlineFriends() {
  const theme = useTheme();
  const {OnlineFriends} =  usePage<SharedProps & {
    OnlineFriends: User[];
  }>().props;

  return (
    <Box
      width="100%"
      padding="12px"
      borderRadius="10px"
      sx={{
        backgroundColor: theme.palette.background.paper,
        boxShadow: "2px 8px 19px -5px rgba(159,162,175,0.5)",
      }}
    >
      <Typography
        variant="body1"
        sx={{ 
          color: theme.palette.text.primary, 
          marginBottom: "10px", 
          fontWeight: "bold" 
        }}
      >
        Online Friends
      </Typography>

      {OnlineFriends.length > 0 ? (
        <ScrollableBox maxHeight="140px" scrollAmount={150}>
          {OnlineFriends.map((friend: User, index: number) => (
            <Box key={index} sx={{ marginBottom: "15px" }}>
              <UserAvatar
                imgUrl={friend.profileImagePath}
                username={friend.username}
                isOnline={true}
              />
            </Box>
          ))}
        </ScrollableBox>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          padding="20px"
          sx={{
            backgroundColor: theme.palette.background.default,
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <MoodBad sx={{ fontSize: 40, color: theme.palette.primary.light }} />
          <Typography
            variant="body2"
            sx={{ 
              color: theme.palette.text.secondary, 
              marginTop: "8px",
              fontStyle: "italic" 
            }}
          >
            No friends online right now
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default OnlineFriends;