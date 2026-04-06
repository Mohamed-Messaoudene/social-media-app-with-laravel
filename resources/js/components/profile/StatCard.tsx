import { Link } from "@inertiajs/react";
import { alpha, Box, Typography, useTheme } from "@mui/material";

function StatCard({
    icon,
    value,
    label,
    href,
    clickable = false,
}: {
    icon: React.ReactNode;
    value: number;
    label: string;
    href?: string;
    clickable?: boolean;
}) {
    const theme = useTheme();

    const content = (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            px={3}
            py={1.5}
            sx={{
                borderRadius: "12px",
                cursor: clickable ? "pointer" : "default",
                transition: "all 0.2s ease",
                "&:hover": clickable
                    ? {
                          backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.08
                          ),
                          transform: "translateY(-2px)",
                      }
                    : {},
            }}
        >
            <Box
                display="flex"
                alignItems="center"
                gap={0.5}
                color={theme.palette.primary.main}
                mb={0.3}
            >
                {icon}
                <Typography
                    variant="h6"
                    fontWeight={700}
                    color={theme.palette.text.primary}
                    lineHeight={1}
                >
                    {value.toLocaleString()}
                </Typography>
            </Box>
            <Typography
                variant="caption"
                color={theme.palette.text.secondary}
                fontWeight={500}
                letterSpacing="0.05em"
                textTransform="uppercase"
                fontSize="10px"
            >
                {label}
            </Typography>
        </Box>
    );

    if (clickable && href) {
        return (
            <Link href={href} style={{ textDecoration: "none" }}>
                {content}
            </Link>
        );
    }

    return content;
}

export default StatCard;