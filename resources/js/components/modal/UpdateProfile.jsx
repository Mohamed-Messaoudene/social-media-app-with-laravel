import React, { useState } from "react";
import {
    Backdrop,
    Box,
    Modal,
    Fade,
    Button,
    Typography,
    TextField,
    useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Send } from "@mui/icons-material";
import CustomButton from "../CustomButton";
import ImageInput from "../ImageInput";
import { useAuth } from "../../context/AuthContext";
import { useSnackBar } from "../../context/SnackBarContext";
import { useForm, usePage } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "45%",
    height: "70vh",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

const UpdateProfile = ({ profileInfo }) => {
    const [open, setOpen] = useState(false);
    const {
        id,
        email,
        username,
        location,
        profileImagePath,
        covertureImagePath,
    } = profileInfo || {};
    const { setSnackBarParams } = useSnackBar();
    const theme = useTheme();

    // Inertia's useForm hook
    const { data, setData, processing, errors, reset } = useForm({
        email: email || "",
        username: username || "",
        location: location || "",
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        reset(); // Reset the form when closing the modal
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("username", data.username);
        formData.append("email", data.email);
        formData.append("location", data.location);
        // Append files if they exist
        if (data.profileImage) {
            formData.append("profileImage", data.profileImage);
        }
        if (data.covertureImage) {
            formData.append("covertureImage", data.covertureImage);
        }
        Inertia.post(`/profile/${id}`, formData, {
            onSuccess: () => {
                setSnackBarParams({
                    open: true,
                    color: "success",
                    message: "profile updated successfully",
                });
                reset();
                handleClose();
            },
            onError: () => {
                setSnackBarParams({
                    open: true,
                    color: "warning",
                    message: "profile updating failed ,please try again !!!",
                });
            },
        });
    };

    return (
        <div>
            <Button
                variant="contained"
                onClick={handleOpen}
                sx={{ textTransform: "none" }}
            >
                Update Profile
            </Button>
            <Modal
                aria-labelledby="update-profile-modal"
                aria-describedby="update-profile-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{ backdrop: { timeout: 500 } }}
            >
                <Fade in={open}>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <Box sx={modalStyle}>
                            <Box
                                sx={{
                                    height: "90%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                {/* Header Section */}
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <Typography
                                        variant="h5"
                                        color={theme.palette.primary.text}
                                    >
                                        Update Your Profile
                                    </Typography>
                                    <CustomButton
                                        content="Close"
                                        bgcolor="orange"
                                        handleClick={handleClose}
                                    />
                                </Box>

                                {/* Profile and Cover Image Section */}
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    mb={2}
                                >
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                    >
                                        <Typography
                                            variant="body2"
                                            color={theme.palette.primary.text}
                                            mb={1}
                                        >
                                            Profile
                                        </Typography>
                                        <ImageInput
                                            name="profileImage"
                                            setValue={setData}
                                            initialImagePath={profileImagePath}
                                        />
                                    </Box>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                    >
                                        <Typography
                                            variant="body2"
                                            color={theme.palette.primary.text}
                                            mb={1}
                                        >
                                            Cover
                                        </Typography>
                                        <ImageInput
                                            name="covertureImage"
                                            setValue={setData}
                                            initialImagePath={
                                                covertureImagePath
                                            }
                                        />
                                    </Box>
                                </Box>

                                {/* Form Fields */}
                                <TextField
                                    label="Email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    variant="filled"
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Username"
                                    value={data.username}
                                    onChange={(e) =>
                                        setData("username", e.target.value)
                                    }
                                    variant="filled"
                                    error={!!errors.username}
                                    helperText={errors.username}
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />

                                <TextField
                                    label="Country/City"
                                    value={data.location}
                                    onChange={(e) =>
                                        setData("location", e.target.value)
                                    }
                                    variant="filled"
                                    error={!!errors.location}
                                    helperText={errors.location}
                                    fullWidth
                                />
                            </Box>

                            {/* Submit Button */}
                            <LoadingButton
                                type="submit"
                                size="small"
                                endIcon={<Send />}
                                loading={processing}
                                loadingPosition="end"
                                variant="contained"
                                sx={{
                                    textTransform: "none",
                                    color: "white",
                                    mt: 2,
                                }}
                            >
                                {processing ? "Updating..." : "Update"}
                            </LoadingButton>
                        </Box>
                    </form>
                </Fade>
            </Modal>
        </div>
    );
};

export default UpdateProfile;
