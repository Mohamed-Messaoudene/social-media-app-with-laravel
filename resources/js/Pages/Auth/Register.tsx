import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import { blueGrey, teal } from "@mui/material/colors";
import React, { useState } from "react";
import Header from "../../components/auth/Header";
import SideImage from "../../components/auth/SideImage";
import FormInput from "../../components/ui/FormInput"; // ✅ reusable input
import { useSnackBar } from "../../context/SnackBarContext";
import { useForm, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { registerBaseSchema, registerSchema } from "../../schemas/auth";
import z from "zod";

// Derive the type from the schema — no need to define it manually
type RegisterFormData = z.infer<typeof registerSchema>;

// Type for client-side errors (separate from server errors)
type ClientErrors = Partial<Record<keyof RegisterFormData, string>>;

function Register() {
    const theme = useTheme();
    const { showSnackBar } = useSnackBar();

    const {
        data,
        setData,
        post,
        processing,
        errors: serverErrors,
    } = useForm<RegisterFormData>({
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    // Client-side Zod errors stored separately from server errors
    const [clientErrors, setClientErrors] = useState<ClientErrors>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(name as keyof RegisterFormData, value);

        // ✅ Parse only the changed field using a partial pick
        const singleFieldSchema = registerBaseSchema.pick({
            [name]: true,
        } as Record<keyof RegisterFormData, true>);
        const fieldResult = singleFieldSchema.safeParse({ [name]: value });
        setClientErrors((prev) => ({
            ...prev,
            [name]: fieldResult.success
                ? undefined
                : z.flattenError(fieldResult.error).fieldErrors[
                        name as keyof RegisterFormData
                    ]?.[0],
        }));
    };

    const handleRegisterSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        // ✅ Validate the entire form before submitting
        const formResult = registerSchema.safeParse(data);
        if (!formResult.success) {
            const fieldErrors = z.flattenError(formResult.error).fieldErrors;
            setClientErrors(fieldErrors as ClientErrors);
            return;
        }

        // Clear client errors before submitting
        setClientErrors({});


        post(route("register"), {
            onSuccess: () => {
                console.log('ff')
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

    // ✅ Merge errors: client errors take priority, server errors fill the rest
    // This means Zod catches format issues first, server catches auth issues
    const mergedErrors: ClientErrors = {
        ...serverErrors,
        ...clientErrors,
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
                            color={theme.palette.text.primary}
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
                                    error={mergedErrors.username}
                                />

                                <FormInput
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={data.email}
                                    onChange={handleChange}
                                    error={mergedErrors.email}
                                />

                                <FormInput
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={data.password}
                                    onChange={handleChange}
                                    error={mergedErrors.password}
                                />

                                <FormInput
                                    label="Confirm Password"
                                    name="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={handleChange}
                                    error={mergedErrors.password_confirmation}
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
