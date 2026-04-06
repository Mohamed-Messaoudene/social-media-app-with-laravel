import React from "react";
import { Box, Typography } from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied"; // Import an icon
import { PaginatedResponse } from "@/types/common";
import { Post as PostType } from "@/types/post";
import Post from "./Post";

type PostsProps = {
    posts: PaginatedResponse<PostType>;
};
function Posts({ posts }: PostsProps) {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
            paddingInline={"20px"}
        >
            {posts?.data.length > 0 ? (
                posts.data.map((post) => <Post key={post.id} post={post} />)
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

export default Posts;
