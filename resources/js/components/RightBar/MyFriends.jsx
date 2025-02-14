import { Box, Typography, useTheme, Button } from "@mui/material";
import React from "react";
import UserAvatar from "../UserAvatar";
import ScrollableBox from "../ScrollableBox";
import { usePage, Link } from "@inertiajs/inertia-react";
import { PersonAddAlt1 as PersonAddAlt1Icon } from "@mui/icons-material";
import { Inertia } from "@inertiajs/inertia";
import CustomButton from "../CustomButton";

function MyFriends() {
  const theme = useTheme();
  const { friends } = usePage().props;

  const handleUnfollow = (friendId) => {
    Inertia.post(`/profile/${friendId}/unfollow`, {}, {
      onSuccess: () => {
        setSnackBarParams({
          open: true,
          color: "success",
          message: "Profile unfollowed successfully",
        });
      },
      onError: () => {
        setSnackBarParams({
          open: true,
          color: "warning",
          message: "Profile unfollowing failed, please try again!",
        });
      },
    });
  };

  return (
    <Box
      width="100%"
      padding="12px"
      marginBlock={'20px'}
      borderRadius="8px"
      sx={{
        backgroundColor: theme.palette.background.paper,
        boxShadow: "2px 8px 19px -5px rgba(159,162,175,0.5)",
      }}
    >
      <Typography
        variant="body1"
        sx={{
          color: theme.palette.primary.text,
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        My Friends
      </Typography>

      {friends.length > 0 ? (
        <ScrollableBox maxHeight="150px" scrollAmount={150}>
          {friends.map((friend, index) => (
            <Box
              key={index}
              height="40px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              marginBottom="8px"
            >
              <Link href={`/profile/${friend.id}`} style={{ textDecoration: "none" }}>
                <UserAvatar imgUrl={friend.profileImagePath} username={friend.username} />
              </Link>
              <Box>
                <CustomButton content="Unfollow" bgcolor="red" handleClick={() => handleUnfollow(friend.id)} />
              </Box>
            </Box>
          ))}
        </ScrollableBox>
      ) : (
        // No friends UI
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          padding="20px"
        >
          <PersonAddAlt1Icon
            sx={{ fontSize: 50, color: theme.palette.primary.main, marginBottom: "10px" }}
          />
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: "bold" }}>
            You have no friends yet!
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.disabled, marginBottom: "15px" }}>
            Start connecting with people now.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default MyFriends;
