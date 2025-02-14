import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import UserAvatar from "../UserAvatar";
import CustomButton from "../CustomButton";
import ScrollableBox from "../ScrollableBox";
import { Link, usePage } from "@inertiajs/inertia-react";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1"; // Import suggestion icon
import { Inertia } from "@inertiajs/inertia";

function Suggestions() {
  const theme = useTheme();
  const { suggestions } = usePage().props;
  const handleFollow = (suggestionId)=>{
    Inertia.post(`/profile/${suggestionId}/follow`,{},{
      onSuccess: () => {
        setSnackBarParams({
            open: true,
            color: "success",
            message: "profile followed successfully",
        });
    },
    onError: () => {
        setSnackBarParams({
            open: true,
            color: "warning",
            message: "profile following failed ,please try again !!!",
        });
    },
    })
  }

  return (
    <Box
      width="100%"
      padding="12px"
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
        Suggestions for you
      </Typography>

      {suggestions.length > 0 ? (
        <ScrollableBox maxHeight="150px" scrollAmount={150}>
          {suggestions.map((suggestion, index) => (
            <Box
              key={index}
              height="40px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              marginBottom="8px"
            >
              <Link  href={`/profile/${suggestion.id}`} style={{textDecoration:"none"}}>
              <UserAvatar
                imgUrl={suggestion.profileImagePath}
                username={suggestion.username}
              />
              </Link>
              
              <Box>
                <CustomButton content="Follow" bgcolor="blue" handleClick={()=>handleFollow(suggestion.id)}/>
                {/* <CustomButton content="Dismiss" bgcolor="red" /> */}
              </Box>
            </Box>
          ))}
        </ScrollableBox>
      ) : (
        // No Suggestions UI
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
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            No new suggestions at the moment.
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
            Check back later for new people to follow.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default Suggestions;
