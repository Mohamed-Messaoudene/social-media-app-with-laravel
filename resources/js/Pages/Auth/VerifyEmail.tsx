import React from "react";
import { router, usePage } from "@inertiajs/react";
import {
    Box,
    Button,
    Typography,
    Container,
    Paper,
    CircularProgress,
    Stack,
} from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import RefreshIcon from "@mui/icons-material/Refresh";
import { teal } from "@mui/material/colors";
import { useSnackBar } from "@/context/SnackBarContext";
import { useAuth } from "@/context/AuthContext";
import { route } from "ziggy-js";

function VerifyEmail() {
    const [loading, setLoading] = React.useState(false);
    const { showSnackBar } = useSnackBar();


    const {user} = useAuth();

    const handleResend = () => {
        setLoading(true);

        router.post(
            route("verification.send"),
            {},
            {
                onSuccess: () => {
                    showSnackBar("Verification email sent successfully!");
                },
                onError: () => {
                    showSnackBar("Failed to resend verification email.");
                },
                onFinish: () => {
                    setLoading(false);
                },
            }
        );
    };

    return (
        <Box
            minHeight="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
                background: "linear-gradient(135deg, #f5f7fa, #e4ecf7)",
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={4}
                    sx={{
                        p: 5,
                        borderRadius: "16px",
                        textAlign: "center",
                    }}
                >
                    <Stack spacing={3} alignItems="center">
                        {/* Icon */}
                        <MarkEmailReadIcon
                            sx={{
                                fontSize: 60,
                                color: teal[500],
                            }}
                        />

                        {/* Title */}
                        <Typography variant="h5" fontWeight="bold">
                            Verify Your Email Address
                        </Typography>

                        {/* Message */}
                        <Typography variant="body1" color="text.secondary">
                            We’ve sent a verification link to:
                        </Typography>

                        {/* Email Highlight */}
                        <Typography
                            variant="body1"
                            fontWeight="bold"
                            sx={{
                                color: teal[600],
                                wordBreak: "break-all",
                            }}
                        >
                            {user?.email}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Please check your inbox and click the link to verify your account.
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Didn’t receive the email? We can send it again.
                        </Typography>

                        {/* Button */}
                        <Button
                            variant="contained"
                            startIcon={
                                loading ? (
                                    <CircularProgress size={18} color="inherit" />
                                ) : (
                                    <RefreshIcon />
                                )
                            }
                            onClick={handleResend}
                            disabled={loading}
                            sx={{
                                mt: 2,
                                px: 4,
                                py: 1.2,
                                fontWeight: "bold",
                                backgroundColor: teal[500],
                                "&:hover": {
                                    backgroundColor: teal[700],
                                },
                            }}
                        >
                            {loading ? "Sending..." : "Resend Verification Email"}
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}

export default VerifyEmail;