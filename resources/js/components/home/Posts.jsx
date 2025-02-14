import React from "react";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import Post from "./Post";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied"; // Import an icon

function Posts({ allPosts }) {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
            paddingInline={"20px"}
        >
            {allPosts.length > 0 ? (
                allPosts.map((post) => (
                    <Post
                        key={post.id}
                        post={post}
                    />
                ))
            ) : (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    gap={2}
                    sx={{ marginTop: 4 }}
                >
                    <SentimentDissatisfiedIcon
                        sx={{ fontSize: 60, color: "text.secondary" }}
                    />
                    <Typography
                        variant="h6"
                        color="textSecondary"
                        align="center"
                    >
                        No posts available.
                    </Typography>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        align="center"
                    >
                        write your first post !!!
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

// Prop validation for the `allPosts` array
Posts.propTypes = {
  allPosts: PropTypes.arrayOf(
      PropTypes.shape({
          id: PropTypes.number.isRequired,
          user_id: PropTypes.number.isRequired,
          postText: PropTypes.string.isRequired,
          postImagePath: PropTypes.string,
          created_at: PropTypes.string.isRequired,
          time_passed: PropTypes.string.isRequired,
          liked: PropTypes.bool.isRequired,
          likes_count: PropTypes.number.isRequired,
          user: PropTypes.shape({
              id: PropTypes.number.isRequired,
              username: PropTypes.string.isRequired,
              profileImagePath: PropTypes.string.isRequired,
          }).isRequired,
          comments: PropTypes.arrayOf(
              PropTypes.shape({
                  id: PropTypes.number.isRequired,
                  post_id: PropTypes.number.isRequired,
                  user_id: PropTypes.number.isRequired,
                  comment_text: PropTypes.string.isRequired,
                  created_at: PropTypes.string.isRequired,
                  time_passed: PropTypes.string.isRequired,
                  user: PropTypes.shape({
                      id: PropTypes.number.isRequired,
                      username: PropTypes.string.isRequired,
                      profileImagePath: PropTypes.string.isRequired,
                  }).isRequired,
              })
          ).isRequired,
      })
  ).isRequired,
};

export default Posts;