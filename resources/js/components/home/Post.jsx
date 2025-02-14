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
import UserAvatar from "../UserAvatar";
import PropTypes from "prop-types";
import { useSnackBar } from "../../context/SnackBarContext";
import { Inertia } from "@inertiajs/inertia";
import { useAuth } from "../../context/AuthContext";
import { Link } from "@inertiajs/inertia-react";

function Post({ post}) {
    const [showComments, setShowComments] = useState(false); // Initially hide comments
    const theme = useTheme();
    const { user } = useAuth();
    const {setSnackBarParams} = useSnackBar();
    const postId = post.id;
    const isMine = post.user.id == user.id;

    // Delete post handler
    const handleDeletePost = async () => {
     Inertia.delete(`/posts/${postId}`,{
        onSuccess: () => {
            setSnackBarParams({
                open: true,
                color: "success",
                message: "post deleted successfully",
            });
        },
        onError: () => {
            setSnackBarParams({
                open: true,
                color: "warning",
                message: "post deleting failed ,please try again !!!",
            });
        },
     })
    };

    // Like post handler
    const handleLikeClick = async () => {
        if (post.liked) {
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
                <Link
                    href={`/profile/${post.user_id}`}
                    style={{ textDecoration: "none" }}
                >
                    <UserAvatar
                        imgUrl={post.user.profileImagePath}
                        username={post.user.username}
                        extraInfo={post.time_passed}
                    />
                </Link>
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
                    color={theme.palette.primary.text}
                    padding="10px 0px 10px 10px"
                >
                    {post.postText}
                </Typography>
                {post.postImagePath && (
                    <img
                        src={post.postImagePath}
                        alt="post photo"
                        width="98%"
                        style={{ marginBlock: "5px" }}
                    />
                )}
            </Box>
            <Box display="flex" alignItems="center">
                <FormControlLabel
                    sx={{ color: theme.palette.primary.text }}
                    control={
                        <Checkbox
                            icon={<FavoriteBorder />}
                            checkedIcon={<Favorite sx={{ color: "red" }} />}
                            checked={post.liked}
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
                        color: theme.palette.primary.text,
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
                        color: theme.palette.primary.text,
                    }}
                >
                    Share
                </Button>
            </Box>
            {showComments && (
                <Box>
                    <Comments postId={post.id} postComments={post.comments} />
                </Box>
            )}
        </Box>
    );
}

// Prop Types Validation
Post.propTypes = {
    post: PropTypes.shape({
        id: PropTypes.number.isRequired,
        postText: PropTypes.string.isRequired,
        postImagePath: PropTypes.string,
        likes_count: PropTypes.number.isRequired,
        user: PropTypes.shape({
            id: PropTypes.number.isRequired,
            profileImagePath: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
        }).isRequired,
        time_passed: PropTypes.string.isRequired,
        liked: PropTypes.bool.isRequired,
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
    }).isRequired,
};

export default Post;
