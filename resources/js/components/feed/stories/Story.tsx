import { Box, Typography, useTheme } from "@mui/material";
import React from "react";

type StoryProps = {
  imgUrl: string;
  username: string;
};

function Story({ imgUrl, username }: StoryProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        aspectRatio: "2 / 3",
        width: "18%",
        borderRadius: "10px",
        backgroundImage: 'url("https://www.google.com/imgres?q=image&imgurl=https%3A%2F%2Fpng.pngtree.com%2Fthumb_back%2Ffh260%2Fbackground%2F20240522%2Fpngtree-abstract-cloudy-background-beautiful-natural-streaks-of-sky-and-clouds-red-image_15684333.jpg")',
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0px 0px 8px 8px",
        color:theme.palette.primary.contrastText,
        cursor:"pointer",
        transition: "transform 0.3s ease-in-out", 
        "&:hover": {
          transform: "scale(1.05)", 
          color:"white"
        },
      }}
    >
      <Typography
        variant="body2"
        fontWeight="bold"
        fontSize="12px"
        color="inherit"
      >
        {username}
      </Typography>
    </Box>
  );
}

export default Story;
