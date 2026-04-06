import { Lock } from "@mui/icons-material";
import { alpha, Box, Typography, useTheme } from "@mui/material";

function PrivateProfileBlock({ username }: { username: string }) {
    const theme = useTheme();

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={10}
            px={4}
            sx={{
                borderRadius: "16px",
                border: `1.5px dashed ${alpha(theme.palette.text.secondary, 0.25)}`,
                backgroundColor: alpha(theme.palette.background.paper, 0.6),
                backdropFilter: "blur(8px)",
                textAlign: "center",
            }}
        >
            <Box
                sx={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    backgroundColor: alpha(theme.palette.text.secondary, 0.08),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2.5,
                }}
            >
                <Lock
                    sx={{
                        fontSize: 34,
                        color: alpha(theme.palette.text.secondary, 0.5),
                    }}
                />
            </Box>
            <Typography
                variant="h6"
                fontWeight={700}
                color={theme.palette.text.primary}
                mb={0.8}
            >
                This account is private
            </Typography>
            <Typography
                variant="body2"
                color={theme.palette.text.secondary}
                maxWidth={320}
                lineHeight={1.6}
            >
                Follow{" "}
                <Box component="span" fontWeight={600} color={theme.palette.text.primary}>
                    @{username}
                </Box>{" "}
                to see their photos, posts, and more. Only approved followers
                can see their content.
            </Typography>
        </Box>
    );
}

export default PrivateProfileBlock;