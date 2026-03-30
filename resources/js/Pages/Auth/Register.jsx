import {
    Box,
    Button,
    Container,
    Typography,
    useTheme,
} from "@mui/material";
import { blueGrey, teal } from "@mui/material/colors";
import React from "react";
import Header from "../../components/auth/Header";
import SideImage from "../../components/auth/SideImage";
import FormInput from "../../components/ui/FormInput"; // ✅ reusable input
import { useSnackBar } from "../../context/SnackBarContext";
import { useForm, Link } from "@inertiajs/react";
import { route } from "ziggy-js";

function Register() {
    const theme = useTheme();
    const { showSnackBar } = useSnackBar();

    const { data, setData, post, processing, errors } = useForm({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        birth_date: "",
        password: "",
        password_confirmation: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleRegisterSubmit = (event) => {
        event.preventDefault();
        post(route("register"), {
            onSuccess: () => {
                showSnackBar(
                    "Registration successful! Please verify your email.",
                    "success",
                );
            },
            onError: () => {
                showSnackBar(
                    "Registration failed. Please check the form.",
                    "error",
                );
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
                    sx={{ width: "100%", height: "65vh", display: "flex" }}
                >
                    <SideImage
                        url="/sign-up-concept-illustration_114360-7965.avif"
                        alt="sign up image"
                    />
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-around"
                        alignItems="center"
                        color={blueGrey[500]}
                        width="50%"
                        sx={{ overflowY: "auto", py: 2 }}
                    >
                        <Typography
                            variant="h6"
                            color={theme.palette.primary.text}
                            mt={1}
                        >
                            Create Account
                        </Typography>

                        <form
                            style={{ width: "100%" }}
                            onSubmit={handleRegisterSubmit}
                        >
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                width="100%"
                            >
                                <FormInput
                                    label="Username"
                                    name="username"
                                    value={data.username}
                                    onChange={handleChange}
                                    error={errors.username}
                                />

                                <FormInput
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={data.email}
                                    onChange={handleChange}
                                    error={errors.email}
                                />

                                <FormInput
                                    label="First Name"
                                    name="first_name"
                                    value={data.first_name}
                                    onChange={handleChange}
                                    error={errors.first_name}
                                />

                                <FormInput
                                    label="Last Name"
                                    name="last_name"
                                    value={data.last_name}
                                    onChange={handleChange}
                                    error={errors.last_name}
                                />

                                <FormInput
                                    label="Birth Date"
                                    name="birth_date"
                                    type="date"
                                    value={data.birth_date}
                                    onChange={handleChange}
                                    error={errors.birth_date}
                                    InputLabelProps={{ shrink: true }}
                                />

                                <FormInput
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={data.password}
                                    onChange={handleChange}
                                    error={errors.password}
                                />

                                <FormInput
                                    label="Confirm Password"
                                    name="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={handleChange}
                                    error={errors.password_confirmation}
                                />

                                <Button
                                    type="submit"
                                    variant="outlined"
                                    sx={{
                                        fontWeight: "bold",
                                        color: teal[400],
                                        borderColor: teal[400],
                                        mt: 1,
                                    }}
                                    disabled={processing}
                                >
                                    Sign up
                                </Button>
                            </Box>
                        </form>

                        <Typography variant="body1" color="inherit" mt={1}>
                            Already Have Account?{" "}
                            <Link href="/login" style={{ color: "orange" }}>
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