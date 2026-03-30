import React from "react";
import { Link } from "@inertiajs/react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Tooltip,
    Container,
    useTheme,
} from "@mui/material";
import { blueGrey, teal } from "@mui/material/colors";
import { Login as LoginIcon } from "@mui/icons-material";
import SideImage from "../../components/auth/SideImage";
import Header from "../../components/auth/Header";
import { useForm } from "@inertiajs/react";
import { useSnackBar } from "../../context/SnackBarContext";

function Login() {
    const { data, post, setData, processing, errors } = useForm({
        email: "",
        password: "",
    });
    const { showSnackBar } = useSnackBar();
    const theme = useTheme();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };
   console.log('we are at login page')
    const handleLoginSubmit = (event) => {

        event.preventDefault();
        post(route("login"), {
            onError: (errors) => {
                // errors is passed directly as a parameter here — always fresh
                showSnackBar("Login failed. Check credentials.", "error");
            },
            onSuccess: () => {
                showSnackBar("Login successful!", "success");
            },
        });
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            pt={"30px"}
        >
            <Container
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
                <Header title="Login Form" />
                <Box
                    sx={{
                        width: "100%",
                        height: "60vh",
                        display: "flex",
                    }}
                >
                    <SideImage url="/login-affiliate.webp" alt="log in image" />
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-around"
                        alignItems="center"
                        color={blueGrey[500]}
                        width="50%"
                    >
                        <Typography variant="h6" color="inherit" mt={2}>
                            Members Log In
                        </Typography>
                        <form
                            style={{ width: "100%" }}
                            onSubmit={handleLoginSubmit} // Correctly pass the submit handler
                        >
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="space-around"
                                width={"100%"}
                            >
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
                                            color: theme.palette.primary,
                                            mb: "30px",
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
                                        name="password"
                                        variant="standard"
                                        sx={{
                                            mb: "30px",
                                            width: "70%",
                                            "& .MuiInputBase-input": {
                                                fontSize: "15px",
                                            },
                                        }}
                                        value={data.password}
                                        onChange={handleChange}
                                    />
                                </Tooltip>
                                <Button
                                    type="submit"
                                    variant="outlined"
                                    startIcon={<LoginIcon />}
                                    sx={{
                                        fontWeight: "bold",
                                        color: teal[500],
                                        borderColor: teal[500],
                                    }}
                                    disabled={processing}
                                >
                                    Sign in
                                </Button>
                            </Box>
                        </form>
                        <Typography variant="body1" color="inherit">
                            New here?{" "}
                            <Link href="/register" style={{ color: "orange" }}>
                                Sign Up
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
export default Login;
