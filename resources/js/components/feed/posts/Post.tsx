import React, { useState } from "react";
import {
    Box,
    IconButton,
    Typography,
    useTheme,
    Button,
    Checkbox,
    FormControlLabel,
    Tooltip,
} from "@mui/material";
import {
    FavoriteBorder,
    SmsOutlined,
    Share,
    Favorite,
    Clear,
} from "@mui/icons-material";
import Comments from "./Comments";
import UserAvatar from "@/components/ui/Avatar";
import { useSnackBar } from "@/context/SnackBarContext";
import { useAuth } from "@/context/AuthContext";
import { Link } from "@inertiajs/react";
import { Post as PostType } from "@/types/post";
import { Inertia } from "@inertiajs/inertia";

function Post({ post }: { post: PostType }) {
    const [showComments, setShowComments] = useState(false); // Initially hide comments
    const theme = useTheme();
    const { user } = useAuth();
    const { showSnackBar } = useSnackBar();
    const postId = post.id;
    const isMine = false;

    // Delete post handler
    const handleDeletePost = async () => {
        Inertia.delete(`/posts/${postId}`, {
            onSuccess: () => {
                showSnackBar( "post deleted successfully");
            },
            onError: () => {
                showSnackBar("post deleting failed ,please try again !!!");
            },
        });
    };

    // Like post handler
    const handleLikeClick = async () => {
        if (post.is_liked_by_auth) {
            Inertia.delete(`/posts/${postId}/likes`);
        } else {
            Inertia.post(`/posts/${postId}/likes`);
        }
    };

    // Handle comment button click
    const handleCommentClick = async () => {
        setShowComments((prev) => !prev);
    };

    return (
        <Box
            width="100%"
            sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: "8px",
                padding: "6px 20px",
                margin: "25px 0px",
                boxShadow: "2px 8px 19px -5px rgba(159,162,175,0.5)",
            }}
        >
            <Box
                height="50px"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                {/* <Link
                    href={`/profile/${post.user_id}`}
                    style={{ textDecoration: "none" }}
                > */}
                    <UserAvatar
                        imgUrl={user?.profile_image_url || "/default-avatar.png"}
                        username={user?.username || "Unknown"}
                        extraInfo={ post.published_at.diff!}
                    />
                {/* </Link> */}
                {isMine && (
                    <Tooltip title="delete" placement="bottom">
                        <IconButton
                            aria-label="show more"
                            onClick={handleDeletePost}
                        >
                            <Clear />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
            <Box>
                <Typography
                    variant="body1"
                    color={theme.palette.text.primary}
                    padding="10px 0px 10px 10px"
                >
                    {post.content}
                </Typography>
                {post.image_url && (
                    <img
                        src={post.image_url}
                        alt="post photo"
                        width="98%"
                        style={{ marginBlock: "5px" }}
                    />
                )}
            </Box>
            <Box display="flex" alignItems="center">
                <FormControlLabel
                    sx={{ color: theme.palette.text.primary }}
                    control={
                        <Checkbox
                            icon={<FavoriteBorder />}
                            checkedIcon={<Favorite sx={{ color: "red" }} />}
                            checked={post.is_liked_by_auth}
                            onChange={handleLikeClick}
                        />
                    }
                    label={`${post.likes_count} likes`}
                />
                <Button
                    variant="text"
                    startIcon={<SmsOutlined />}
                    sx={{
                        textTransform: "none",
                        color: theme.palette.text.primary,
                    }}
                    onClick={handleCommentClick}
                >
                    Comments
                </Button>
                <Button
                    variant="text"
                    startIcon={<Share />}
                    sx={{
                        textTransform: "none",
                        color: theme.palette.text.primary,
                    }}
                >
                    Share
                </Button>
            </Box>
            {/* {showComments && (
                <Box>
                    <Comments postId={post.id} postComments={post.comments} />
                </Box>
            )} */}
        </Box>
    );
}

export default Post;
