import React from "react";
import {
    Box,
    Typography,
    ButtonBase,
    Divider,
    alpha,
    useTheme,
} from "@mui/material";
import {
    Diversity3,
    Groups,
    Storefront,
    OndemandVideo,
    Bookmark,
    Settings,
    Explore,
} from "@mui/icons-material";
import { Link, usePage } from "@inertiajs/react";
import { SharedProps } from "@/types/global";
import UserAvatar from "@/components/ui/Avatar";

type NavItem = {
    label: string;
    icon: React.ReactNode;
    href: string;
    color: string;
};

const NAV_ITEMS: NavItem[] = [
    {
        label: "Friends",
        icon: <Diversity3 />,
        href: "/friends",
        color: "#3b82f6",
    },
    { label: "Explore", icon: <Explore />, href: "/explore", color: "#8b5cf6" },
    { label: "Groups", icon: <Groups />, href: "/groups", color: "#7c3aed" },
    {
        label: "Marketplace",
        icon: <Storefront />,
        href: "/marketplace",
        color: "#10b981",
    },
    {
        label: "Watch",
        icon: <OndemandVideo />,
        href: "/watch",
        color: "#ef4444",
    },
    { label: "Saved", icon: <Bookmark />, href: "/saved", color: "#f59e0b" },
];

function NavButton({ item }: { item: NavItem }) {
    const theme = useTheme();
    return (
        <Link href={item.href} style={{ textDecoration: "none" }}>
            <ButtonBase
                sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 2,
                    py: 1.2,
                    borderRadius: "10px",
                    justifyContent: "flex-start",
                    transition: "all 0.15s ease",
                    "&:hover": {
                        backgroundColor: alpha(item.color, 0.1),
                        "& .nav-icon": { color: item.color },
                        "& .nav-label": { color: theme.palette.text.primary },
                    },
                }}
            >
                <Box
                    className="nav-icon"
                    sx={{
                        color: alpha(theme.palette.text.secondary, 0.6),
                        display: "flex",
                        transition: "color 0.15s ease",
                        fontSize: 20,
                    }}
                >
                    {item.icon}
                </Box>
                <Typography
                    className="nav-label"
                    variant="body2"
                    fontWeight={500}
                    color={theme.palette.text.secondary}
                    sx={{ transition: "color 0.15s ease" }}
                >
                    {item.label}
                </Typography>
            </ButtonBase>
        </Link>
    );
}

function Leftbar() {
    const theme = useTheme();
    const { auth } = usePage<SharedProps>().props;
    const user = auth.user;

    return (
        <Box
            display="flex"
            flexDirection="column"
            height="100%"
            sx={{
                backgroundColor: theme.palette.background.paper,
                borderRight: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                py: 2,
                px: 1,
            }}
        >
            {/* Current user */}
            <Box px={2} mb={2}>
                <Link href="/profile" style={{ textDecoration: "none" }}>
                    <ButtonBase
                        sx={{
                            borderRadius: "10px",
                            width: "100%",
                            justifyContent: "flex-start",
                            p: 1,
                            "&:hover": {
                                backgroundColor: alpha(
                                    theme.palette.primary.main,
                                    0.06,
                                ),
                            },
                        }}
                    >
                        <UserAvatar
                            imgUrl={user!.profile_image_url}
                            username={user!.username}
                        />
                    </ButtonBase>
                </Link>
            </Box>

            <Divider sx={{ mx: 2, mb: 1.5 }} />

            {/* Nav items */}
            <Box display="flex" flexDirection="column" gap={0.3} flex={1}>
                {NAV_ITEMS.map((item) => (
                    <NavButton key={item.label} item={item} />
                ))}
            </Box>

            <Divider sx={{ mx: 2, my: 1.5 }} />

            {/* Settings at bottom */}
            <NavButton
                item={{
                    label: "Settings",
                    icon: <Settings />,
                    href: "/settings",
                    color: "#64748b",
                }}
            />
        </Box>
    );
}

export default Leftbar;
