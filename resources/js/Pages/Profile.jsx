import React from "react";
import {
    Email,
    GitHub,
    Instagram,
    LinkedIn,
    People,
    PersonAdd,
    Place,
} from "@mui/icons-material";
import {
    Avatar,
    Box,
    useTheme,
    Typography,
    IconButton,
    Button,
} from "@mui/material";
import UpdateProfile from "../components/modal/UpdateProfile";
import { useAuth } from "../context/AuthContext";
import { useSnackBar } from "../context/SnackBarContext";
import { usePage } from "@inertiajs/inertia-react";
import Posts from "../components/home/Posts";
import { Inertia } from "@inertiajs/inertia";

function Profile() {
    const theme = useTheme();
    const {setSnackBarParams} = useSnackBar();
    const { user: loggedin_user, setUser } = useAuth(); // Get current logged-in user
    const { user: profileUser, posts, auth } = usePage().props;
    const isMe = loggedin_user.id == profileUser.id;
    if (isMe) {
        setUser(auth.user);
    }
    const handleFollow = () => {
        const action = profileUser.is_following ? "unfollow" : "follow";
        Inertia.post(`/profile/${profileUser.id}/${action}`, {}, {
            onSuccess: () => {
                setSnackBarParams({
                    open: true,
                    color: "success",
                    message: `Profile ${action}ed successfully`,
                });
            },
            onError: () => {
                setSnackBarParams({
                    open: true,
                    color: "warning",
                    message: `Profile ${action}ing failed, please try again!`,
                });
            },
        });
    };    

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            minHeight="calc(100vh - 67px)"
            marginTop="6px"
            sx={{
                backgroundColor: theme.palette.background.bgcolor,
            }}
        >
            <Box width="50%">
                <img
                    src={profileUser?.covertureImagePath}
                    alt="profile coverture"
                    style={{
                        width: "100%",
                        height: "auto",
                        aspectRatio: "3 / 1",
                    }}
                />
            </Box>

            <Box width="50%" marginBlock="15px">
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    sx={{
                        position: "relative",
                        backgroundColor: theme.palette.background.paper,
                        border: "1px solid",
                        borderRadius: "8px",
                        borderColor: "blue",
                        boxShadow: "2px 8px 19px -5px rgba(159,162,175,0.5)",
                    }}
                >
                    <Avatar
                        src={profileUser?.profileImagePath}
                        sx={{
                            width: "20%",
                            height: "auto",
                            aspectRatio: "1 / 1",
                            position: "absolute",
                            top: "-35%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            border: "2px solid blue",
                        }}
                    />
                    <Typography
                        variant="h5"
                        color={theme.palette.primary.text}
                        marginBlock="20px"
                        marginTop="80px"
                    >
                        {profileUser.username}
                    </Typography>
                    <Box
                        width={"50%"}
                        display="flex"
                        alignItems="center"
                        justifyContent={"space-between"}
                        marginBottom="20px"
                    >
                        <Box display="flex" alignItems="center">
                            <Place
                                sx={{
                                    marginRight: "8px",
                                    color: theme.palette.primary.text,
                                }}
                            />
                            <Typography
                                variant="body1"
                                fontSize="15px"
                                color={theme.palette.primary.text}
                            >
                                {profileUser.location}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <People
                                sx={{
                                    marginRight: "8px",
                                    color: theme.palette.primary.text,
                                }}
                            />
                            <Typography
                                variant="body1"
                                fontSize="15px"
                                color={theme.palette.primary.text}
                            >
                                {profileUser.followers_count} followers
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <PersonAdd
                                sx={{
                                    marginRight: "8px",
                                    color: theme.palette.primary.text,
                                }}
                            />
                            <Typography
                                variant="body1"
                                fontSize="15px"
                                color={theme.palette.primary.text}
                            >
                                {profileUser.following_count} following
                            </Typography>
                        </Box>
                    </Box>

                    {isMe ? (
                        <UpdateProfile profileInfo={profileUser} />
                    ) : (
                        <Button
                            size="small"
                            variant="contained"
                            sx={{ textTransform: "none" }}
                            onClick={handleFollow}
                        >
                            {profileUser.is_following ? "unfollow" : "Follow"}
                        </Button>
                    )}
                    <Box display="flex" alignItems="center" marginBlock="15px">
                        <IconButton
                            component="a"
                            href="#"
                            target="_blank"
                            color="primary"
                        >
                            <Instagram />
                        </IconButton>
                        <IconButton
                            component="a"
                            href="#"
                            target="_blank"
                            color="primary"
                        >
                            <LinkedIn />
                        </IconButton>
                        <IconButton
                            component="a"
                            href="#"
                            target="_blank"
                            color="primary"
                        >
                            <GitHub />
                        </IconButton>
                        <IconButton
                            component="a"
                            href="#"
                            target="_blank"
                            color="primary"
                        >
                            <Email />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
            <Box width={"50%"} marginBottom={'60px'}>
                <Posts allPosts={posts} />
            </Box>
        </Box>
    );
}

export default Profile;
