import {
    Box,
    Button,
    ButtonBase,
    Container,
    TextField,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import { Link } from "@inertiajs/inertia-react";
import { blueGrey, teal } from "@mui/material/colors";
import React from "react";
import Header from "../components/auth/Header";
import SideImage from "../components/auth/SideImage";
import { useForm } from "@inertiajs/inertia-react";
import ImageInput from "../components/ImageInput";
import { Inertia } from "@inertiajs/inertia";
import { useSnackBar } from "../context/SnackBarContext";

function Register() {
    const theme = useTheme();
    const { data, setData, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        location: "",
    });
    const { setSnackBarParams } = useSnackBar();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const handleRegisterSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("username", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("location", data.location);
        // Append files if they exist
        if (data.profileImage) {
            formData.append("profileImage", data.profileImage);
        }
        if (data.covertureImage) {
            formData.append("covertureImage", data.covertureImage);
        }
        console.log("Sending register request", formData.values);
        // Send the form data to the server
        Inertia.post("/register", formData, {
            onSuccess: () => {
                setSnackBarParams({
                    open: true,
                    color: "success",
                    message:
                        "Registration successful! Welcom to the login page.",
                });
            },
            onError: (errors) => {
                setSnackBarParams({
                    open: true,
                    color: "warning",
                    message: errors,
                });
                console.error("Registration errors:", errors);
            },
        });
    };

    return (
        <Box
            pt={"30px"}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            <Container
                className="boxShadow"
                maxWidth="md"
                sx={{
                    width: "85vw",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px",
                }}
            >
                <Header title="Sign Up Form" />
                <Box
                    className="boxShadow"
                    sx={{
                        width: "100%",
                        height: "65vh",
                        display: "flex",
                    }}
                >
                    <SideImage url="/sign-up-concept-illustration_114360-7965.avif" alt="sign up image" />
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-around"
                        alignItems="center"
                        color={blueGrey[500]}
                        width="50%"
                    >
                        <Typography
                            variant="h6"
                            color={theme.palette.primary.text}
                            mt={1}
                        >
                            Create Account
                        </Typography>
                        <form
                            encType="multipart/form-data"
                            style={{ width: "100%" }}
                            onSubmit={handleRegisterSubmit}
                        >
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="space-around"
                                width={"100%"}
                            >
                                <Tooltip
                                    title={errors.name ? errors.name : ""}
                                    placement="bottom-start"
                                    open={Boolean(errors.name)}
                                    arrow
                                >
                                    <TextField
                                        label="Name"
                                        variant="standard"
                                        name="name"
                                        sx={{
                                            mb: "20px",
                                            width: "70%",
                                            "& .MuiInputBase-input": {
                                                fontSize: "15px",
                                            },
                                        }}
                                        value={data.name}
                                        onChange={handleChange}
                                    />
                                </Tooltip>

                                <Tooltip
                                    title={errors.email ? errors.email : ""}
                                    placement="bottom-start"
                                    open={Boolean(errors.email)}
                                    arrow
                                >
                                    <TextField
                                        label="Email"
                                        variant="standard"
                                        name="email"
                                        sx={{
                                            mb: "20px",
                                            width: "70%",
                                            "& .MuiInputBase-input": {
                                                fontSize: "15px",
                                            },
                                        }}
                                        value={data.email}
                                        onChange={handleChange}
                                    />
                                </Tooltip>

                                <Tooltip
                                    title={
                                        errors.password ? errors.password : ""
                                    }
                                    placement="bottom-start"
                                    open={Boolean(errors.password)}
                                    arrow
                                >
                                    <TextField
                                        label="Password"
                                        type="password"
                                        variant="standard"
                                        name="password"
                                        sx={{
                                            mb: "20px",
                                            width: "70%",
                                            "& .MuiInputBase-input": {
                                                fontSize: "15px",
                                            },
                                        }}
                                        value={data.password}
                                        onChange={handleChange}
                                    />
                                </Tooltip>
                                <Tooltip
                                    title={
                                        errors.location ? errors.location : ""
                                    }
                                    placement="bottom-start"
                                    open={Boolean(errors.location)}
                                    arrow
                                >
                                    <TextField
                                        label="Location"
                                        type="string"
                                        variant="standard"
                                        name="location"
                                        sx={{
                                            mb: "20px",
                                            width: "70%",
                                            "& .MuiInputBase-input": {
                                                fontSize: "15px",
                                            },
                                        }}
                                        value={data.location}
                                        onChange={handleChange}
                                    />
                                </Tooltip>
                                <Box
                                    width="60%"
                                    display="flex"
                                    justifyContent="space-between"
                                    marginBottom={"20px"}
                                >
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                    >
                                        <Typography
                                            variant="body1"
                                            color={theme.palette.primary.text}
                                            mb="10px"
                                            fontSize="14px"
                                        >
                                            Profile Image
                                        </Typography>
                                        <ImageInput
                                            name="profileImage"
                                            setValue={setData}
                                            initialImagePath={
                                                "/emptyProfileImage.png"
                                            }
                                        />
                                    </Box>
                                    <Box
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                    >
                                        <Typography
                                            variant="body1"
                                            color={theme.palette.primary.text}
                                            mb="10px"
                                            fontSize="14px"
                                        >
                                            Cover Image
                                        </Typography>
                                        <ImageInput
                                            name="covertureImage"
                                            setValue={setData}
                                            initialImagePath={
                                                "/emptyCoverture.png"
                                            }
                                        />
                                    </Box>
                                </Box>

                                <Button
                                    type="submit"
                                    variant="outlined"
                                    sx={{
                                        fontWeight: "bold",
                                        color: teal[400],
                                        borderColor: teal[400],
                                    }}
                                    disabled={processing}
                                >
                                    Sign up
                                </Button>
                            </Box>
                        </form>

                        <Typography variant="body1" color="inherit">
                            Already Have Account?{" "}
                            <Link href="login" style={{ color: "orange" }}>
                                Log In
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default Register;
