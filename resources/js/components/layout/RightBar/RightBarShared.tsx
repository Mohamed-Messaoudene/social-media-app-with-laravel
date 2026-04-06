import React from "react";
import {
    Box,
    Typography,
    useTheme,
    alpha,
    ButtonBase,
    Button,
} from "@mui/material";
import { Link } from "@inertiajs/react";
import UserAvatar from "@/components/ui/Avatar";

// ─── Shared card wrapper ───────────────────────────────────────────────────────
export function RightbarCard({
    title,
    children,
    action,
}: {
    title: string;
    children: React.ReactNode;
    action?: { label: string; href: string };
}) {
    const theme = useTheme();
    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: "14px",
                boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.06)}`,
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                px={2}
                pt={2}
                pb={1.2}
            >
                <Typography
                    variant="body2"
                    fontWeight={700}
                    color={theme.palette.text.primary}
                    letterSpacing="0.01em"
                >
                    {title}
                </Typography>
                {action && (
                    <Link href={action.href} style={{ textDecoration: "none" }}>
                    <Typography
                        variant="caption"
                        fontWeight={600}
                        sx={{
                            color: theme.palette.primary.main,
                            textDecoration: "none",
                            "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        {action.label}
                    </Typography>
                    </Link>
                )}
            </Box>

            {/* Content */}
            <Box px={1.5} pb={1.5}>
                {children}
            </Box>
        </Box>
    );
}

// ─── Shared user row ───────────────────────────────────────────────────────────
export function UserRow({
    id,
    username,
    profileImagePath,
    actionLabel,
    actionColor,
    onAction,
}: {
    id: number;
    username: string;
    profileImagePath: string | null;
    actionLabel: string;
    actionColor: "primary" | "error" | "success";
    onAction: () => void;
}) {
    const theme = useTheme();
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{
                px: 1,
                py: 0.8,
                borderRadius: "10px",
                transition: "background 0.15s",
                "&:hover": {
                    backgroundColor: alpha(theme.palette.text.primary, 0.04),
                },
            }}
        >
            <Link href={`/profile/${username}`} style={{ textDecoration: "none" }}>
            <ButtonBase
                sx={{ borderRadius: "8px", flexShrink: 0 }}
            >
                <UserAvatar imgUrl={profileImagePath} username={username} />
            </ButtonBase>
            </Link>

            <Button
                size="small"
                variant="outlined"
                color={actionColor}
                onClick={onAction}
                sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "11px",
                    borderRadius: "8px",
                    py: 0.3,
                    px: 1.2,
                    minWidth: 0,
                }}
            >
                {actionLabel}
            </Button>
        </Box>
    );
}

// ─── Empty state ───────────────────────────────────────────────────────────────
export function EmptyState({
    icon,
    title,
    subtitle,
}: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
}) {
    const theme = useTheme();
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            textAlign="center"
            py={2.5}
            px={1}
        >
            <Box
                sx={{
                    color: alpha(theme.palette.text.secondary, 0.35),
                    fontSize: 36,
                    mb: 1,
                    display: "flex",
                }}
            >
                {icon}
            </Box>
            <Typography
                variant="body2"
                fontWeight={600}
                color={theme.palette.text.secondary}
                mb={0.3}
            >
                {title}
            </Typography>
            {subtitle && (
                <Typography
                    variant="caption"
                    color={theme.palette.text.disabled}
                    lineHeight={1.4}
                >
                    {subtitle}
                </Typography>
            )}
        </Box>
    );
}