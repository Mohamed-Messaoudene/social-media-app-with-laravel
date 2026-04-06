import React from "react";
import { Box, Typography, useTheme, alpha, ButtonBase, Avatar } from "@mui/material";
import { Link, usePage } from "@inertiajs/react";
import { WifiOff } from "@mui/icons-material";
import { SharedProps } from "@/types/global";
import { RightbarCard, EmptyState } from "@/components/layout/RightBar/RightBarShared";
import { ProfileUser } from "@/types/profile";

function OnlineDot() {
    return (
        <Box
            sx={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                backgroundColor: "#22c55e",
                border: "2px solid white",
                position: "absolute",
                bottom: 1,
                right: 1,
                // Subtle pulse animation
                "@keyframes pulse": {
                    "0%, 100%": { boxShadow: "0 0 0 0 rgba(34,197,94,0.4)" },
                    "50%": { boxShadow: "0 0 0 4px rgba(34,197,94,0)" },
                },
                animation: "pulse 2s ease-in-out infinite",
            }}
        />
    );
}

function OnlineFriends() {
    const theme = useTheme();
    const { onlineFriends } = usePage<SharedProps & { onlineFriends: ProfileUser[] }>().props;

    return (
        <RightbarCard title="Active now">
            {onlineFriends && onlineFriends.length > 0 ? (
                <Box display="flex" gap={1.5} flexWrap="wrap" px={1} pb={0.5}>
                    {onlineFriends.slice(0, 8).map((friend) => (
                      <Link
                            key={friend.id}
                            href={`/profile/${friend.id}`}
                            style={{ textDecoration: "none" }}
                        >
                        <ButtonBase
                            key={friend.id}
                            sx={{ borderRadius: "50%" }}
                        >
                            <Box sx={{ position: "relative" }}>
                                <Avatar
                                    src={friend.profile_image_url ?? undefined}
                                    alt={friend.username}
                                    sx={{
                                        width: 38,
                                        height: 38,
                                        border: `2px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                                        transition: "transform 0.15s ease",
                                        "&:hover": { transform: "scale(1.08)" },
                                    }}
                                >
                                    {friend.username.charAt(0).toUpperCase()}
                                </Avatar>
                                <OnlineDot />
                            </Box>
                        </ButtonBase>
                        </Link>
                    ))}
                </Box>
            ) : (
                <EmptyState
                    icon={<WifiOff fontSize="inherit" />}
                    title="Nobody active right now"
                    subtitle="Your friends will appear here when online."
                />
            )}
        </RightbarCard>
    );
}

export default OnlineFriends;