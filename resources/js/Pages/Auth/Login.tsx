import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import { Box, Button, Typography, Container, useTheme } from "@mui/material";
import { teal } from "@mui/material/colors";
import { Login as LoginIcon } from "@mui/icons-material";
import SideImage from "../../components/auth/SideImage";
import Header from "../../components/auth/Header";
import FormInput from "../../components/ui/FormInput";
import { useSnackBar } from "../../context/SnackBarContext";
import { route } from "ziggy-js";
import z from "zod";
import { loginSchema } from "../../schemas/auth";

// Derive the type from the schema — no need to define it manually
type LoginFormData = z.infer<typeof loginSchema>;

// Type for client-side errors (separate from server errors)
type ClientErrors = Partial<Record<keyof LoginFormData, string>>;

function Login() {
    const {
        data,
        post,
        setData,
        processing,
        errors: serverErrors,
    } = useForm<LoginFormData>({
        email: "",
        password: "",
    });

    // Client-side Zod errors stored separately from server errors
    const [clientErrors, setClientErrors] = useState<ClientErrors>({});

    const { showSnackBar } = useSnackBar();
    const theme = useTheme();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(name as keyof LoginFormData, value);

        // ✅ Parse only the changed field using a partial pick
        const singleFieldSchema = loginSchema.pick({
            [name]: true,
        } as Record<keyof LoginFormData, true>);

        const fieldResult = singleFieldSchema.safeParse({ [name]: value });

        setClientErrors((prev) => ({
            ...prev,
            [name]: fieldResult.success
                ? undefined
                : z.flattenError(fieldResult.error).fieldErrors[
                      name as keyof LoginFormData
                  ]?.[0],
        }));
    };

    const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // ✅ Validate entire form before sending to server
        const result = loginSchema.safeParse(data);

        if (!result.success) {
            const { fieldErrors } = z.flattenError(result.error);

            setClientErrors({
                email: fieldErrors.email?.[0],
                password: fieldErrors.password?.[0],
            });

            return;
        }

        // Clear client errors before submitting
        setClientErrors({});

        post(route("login"), {
            onError: () => {
                showSnackBar("Login failed. Check credentials.", "error");
            },
            onSuccess: () => {
                showSnackBar("Login successful!", "success");
            },
        });
    };

     // ✅ Merge errors: client errors take priority, server errors fill the rest
    // This means Zod catches format issues first, server catches auth issues
    const mergedErrors: ClientErrors = {
        ...serverErrors,
        ...clientErrors,
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            pt="30px"
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
                        color={theme.palette.text.secondary}
                        width="50%"
                    >
                        <Typography variant="h6" mt={2}>
                            Members Log In
                        </Typography>

                        <form
                            style={{ width: "100%" }}
                            onSubmit={handleLoginSubmit}
                        >
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                width="100%"
                            >
                                {/* ✅ Reusable Inputs */}
                                <FormInput
                                    label="Email"
                                    name="email"
                                    value={data.email}
                                    onChange={handleChange}
                                    error={mergedErrors?.email}
                                />

                                <FormInput
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={data.password}
                                    onChange={handleChange}
                                    error={mergedErrors?.password}
                                />

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

                        <Typography variant="body1">
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
