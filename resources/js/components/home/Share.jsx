import React, { useState } from "react";
import {
    Box,
    Divider,
    Button,
    TextField,
    useTheme,
    Avatar,
    Typography,
    IconButton,
    Popover,
} from "@mui/material";
import { AddPhotoAlternate as AddPhoto, Diversity3, Send, EmojiEmotions } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useForm } from "@inertiajs/inertia-react";
import { useAuth } from "../../context/AuthContext";
import { useSnackBar } from "../../context/SnackBarContext";
import EmojiPicker from "emoji-picker-react"; // Import Emoji Picker

function Share() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const { setSnackBarParams } = useSnackBar();
    const theme = useTheme();
    const { user } = useAuth();
    
    const [anchorEl, setAnchorEl] = useState(null); // For emoji picker
    const inputLabel = `Hi ${user.username}, what is on your mind?`;

    const { data, setData, processing, errors, post } = useForm({
        postText: "",
        postImage: null,
    });

    const handlePostClick = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("postText", data.postText);
        if (data.postImage) {
            formData.append("postImage", data.postImage);
        }
        post(`/posts`, {
            data: formData,
            onSuccess: () => {
                setSnackBarParams({
                    open: true,
                    color: "success",
                    message: "Post created successfully!",
                });
                setData({ postText: "", postImage: null });
                setSelectedImage(null);
            },
            onError: (errors) => {
                setErrorMessage(errors.postText || "An error occurred while creating the post.");
            },
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setData("postImage", file);
            setErrorMessage("");
        }
    };

    // Open/Close Emoji Picker
    const handleOpenEmojiPicker = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseEmojiPicker = () => {
        setAnchorEl(null);
    };

    const handleEmojiClick = (emojiData) => {
        setData("postText", data.postText + emojiData.emoji);
        handleCloseEmojiPicker();
    };

    return (
        <Box
            minHeight="150px"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
            sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: "8px",
                padding: "6px 20px",
                margin: "25px 0px 10px 0px",
                boxShadow: "2px 8px 19px -5px rgba(159,162,175,0.5)",
            }}
        >
            <Box width="100%" display="flex" alignItems="center" marginBottom="15px">
                <Avatar
                    src={user.profileImagePath}
                    alt="Profile"
                    sx={{ width: 30, height: 30, margin: "10px 15px 0 0" }}
                />
                <TextField
                    fullWidth
                    multiline
                    maxRows={6}
                    label={inputLabel}
                    value={data.postText}
                    onChange={(e) => setData("postText", e.target.value)}
                    variant="standard"
                    error={!!errors.postText}
                    helperText={errors.postText}
                    sx={{
                        "& .MuiInput-underline:before": { borderBottom: "none" },
                        "& .MuiInput-underline:after": { borderBottom: "none" },
                        "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: "none" },
                    }}
                />
                <IconButton onClick={handleOpenEmojiPicker}>
                    <EmojiEmotions sx={{ color: "#ffcc00" }} />
                </IconButton>
            </Box>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleCloseEmojiPicker}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                <EmojiPicker onEmojiClick={handleEmojiClick} />
            </Popover>

            <Divider sx={{ width: "100%", marginBottom: "10px" }} />

            {selectedImage && (
                <img
                    src={selectedImage}
                    alt="Post Preview"
                    width="98%"
                    style={{ marginBlock: "15px", borderRadius: "8px" }}
                />
            )}

            {errorMessage && (
                <Typography color="error" sx={{ fontSize: "14px", marginBottom: "10px", width: "100%" }}>
                    {errorMessage}
                </Typography>
            )}

            <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
                <Box width="40%" display="flex" alignItems="center">
                    <Button
                        variant="text"
                        component="label"
                        startIcon={<AddPhoto sx={{ color: "orange" }} />}
                        sx={{ fontSize: "12px", textTransform: "none", color: theme.palette.primary.text, marginRight: "8px" }}
                    >
                        Add image
                        <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                    </Button>
                    <Button
                        variant="text"
                        startIcon={<Diversity3 sx={{ color: "blue" }} />}
                        sx={{ fontSize: "12px", textTransform: "none", color: theme.palette.primary.text }}
                    >
                        Tag friends
                    </Button>
                </Box>
                <LoadingButton
                    type="submit"
                    size="small"
                    onClick={handlePostClick}
                    endIcon={<Send />}
                    loading={processing}
                    loadingPosition="end"
                    variant="contained"
                    sx={{ textTransform: "none", color: "white" }}
                >
                    Post
                </LoadingButton>
            </Box>
        </Box>
    );
}

export default Share;
