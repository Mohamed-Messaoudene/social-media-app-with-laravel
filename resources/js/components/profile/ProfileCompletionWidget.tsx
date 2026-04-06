import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { ProfileUser } from "@/types/profile";
import { router } from "@inertiajs/react";
import { CheckCircle, EditNote, RadioButtonUnchecked, TrendingUp } from "@mui/icons-material";
import { alpha, Box, Button, Chip, Collapse, LinearProgress, Typography, useTheme } from "@mui/material";
import React from "react";

function ProfileCompletionWidget({ user }: { user: ProfileUser }) {
    const theme = useTheme();
    const [expanded, setExpanded] = React.useState(false);
    const { steps, percentage } = useProfileCompletion(user);
    const incomplete = steps.filter((s) => !s.done);
    const isComplete = percentage === 100;

    // Color shifts amber → blue → green as percentage grows
    const progressColor =
        percentage < 40 ? "#f59e0b" : percentage < 75 ? "#3b82f6" : "#10b981";

    if (isComplete) {
        return (
            <Box
                sx={{
                    width: "100%",
                    borderRadius: "12px",
                    border: `1.5px solid ${alpha("#10b981", 0.4)}`,
                    backgroundColor: alpha("#10b981", 0.06),
                    px: 2.5,
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                }}
            >
                <CheckCircle sx={{ color: "#10b981", fontSize: 22 }} />
                <Box>
                    <Typography variant="body2" fontWeight={700} color="#10b981">
                        Profile complete!
                    </Typography>
                    <Typography
                        variant="caption"
                        color={theme.palette.text.secondary}
                    >
                        Your profile is fully set up. Looking great 🎉
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: "100%",
                borderRadius: "12px",
                border: `1.5px solid ${alpha(progressColor, 0.3)}`,
                backgroundColor: alpha(progressColor, 0.04),
                px: 2.5,
                py: 2,
                mb: 2,
            }}
        >
            {/* Header row */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
            >
                <Box display="flex" alignItems="center" gap={1}>
                    <TrendingUp sx={{ fontSize: 18, color: progressColor }} />
                    <Typography
                        variant="body2"
                        fontWeight={700}
                        color={theme.palette.text.primary}
                    >
                        Complete your profile
                    </Typography>
                </Box>
                <Typography
                    variant="body2"
                    fontWeight={800}
                    sx={{ color: progressColor }}
                >
                    {percentage}%
                </Typography>
            </Box>

            {/* Progress bar */}
            <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                    height: 6,
                    borderRadius: 4,
                    mb: 1.5,
                    backgroundColor: alpha(progressColor, 0.15),
                    "& .MuiLinearProgress-bar": {
                        borderRadius: 4,
                        backgroundColor: progressColor,
                        transition: "transform 0.6s ease",
                    },
                }}
            />

            {/* Remaining count + toggle */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography
                    variant="caption"
                    color={theme.palette.text.secondary}
                >
                    {incomplete.length} step
                    {incomplete.length !== 1 ? "s" : ""} remaining
                </Typography>
                <Typography
                    variant="caption"
                    fontWeight={600}
                    sx={{
                        color: progressColor,
                        cursor: "pointer",
                        userSelect: "none",
                        "&:hover": { textDecoration: "underline" },
                    }}
                    onClick={() => setExpanded((p) => !p)}
                >
                    {expanded ? "Hide steps ↑" : "Show steps ↓"}
                </Typography>
            </Box>

            {/* Expandable checklist */}
            <Collapse in={expanded}>
                <Box mt={1.5} display="flex" flexDirection="column" gap={0.8}>
                    {steps.map((step) => (
                        <Box
                            key={step.key}
                            display="flex"
                            alignItems="center"
                            gap={1.2}
                            sx={{
                                opacity: step.done ? 0.4 : 1,
                                transition: "opacity 0.2s",
                            }}
                        >
                            {step.done ? (
                                <CheckCircle
                                    sx={{
                                        fontSize: 17,
                                        color: "#10b981",
                                        flexShrink: 0,
                                    }}
                                />
                            ) : (
                                <RadioButtonUnchecked
                                    sx={{
                                        fontSize: 17,
                                        color: alpha(
                                            theme.palette.text.secondary,
                                            0.5
                                        ),
                                        flexShrink: 0,
                                    }}
                                />
                            )}
                            <Box flex={1} minWidth={0}>
                                <Typography
                                    variant="caption"
                                    fontWeight={step.done ? 500 : 600}
                                    color={theme.palette.text.primary}
                                    sx={{
                                        textDecoration: step.done
                                            ? "line-through"
                                            : "none",
                                    }}
                                >
                                    {step.label}
                                </Typography>
                                {!step.done && (
                                    <Typography
                                        variant="caption"
                                        display="block"
                                        color={theme.palette.text.secondary}
                                        fontSize="10px"
                                    >
                                        {step.description}
                                    </Typography>
                                )}
                            </Box>
                            <Chip
                                label={`+${step.points}%`}
                                size="small"
                                sx={{
                                    height: 18,
                                    fontSize: "10px",
                                    fontWeight: 700,
                                    backgroundColor: step.done
                                        ? alpha("#10b981", 0.12)
                                        : alpha(progressColor, 0.12),
                                    color: step.done ? "#10b981" : progressColor,
                                    "& .MuiChip-label": { px: 0.8 },
                                }}
                            />
                        </Box>
                    ))}
                </Box>

                {/* CTA button */}
                <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    startIcon={<EditNote />}
                    onClick={() => router.visit("/profile/edit")}
                    sx={{
                        mt: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: "8px",
                        backgroundColor: progressColor,
                        boxShadow: "none",
                        "&:hover": {
                            backgroundColor: progressColor,
                            filter: "brightness(0.88)",
                            boxShadow: "none",
                        },
                    }}
                >
                    Complete your profile now
                </Button>
            </Collapse>
        </Box>
    );
}

export default ProfileCompletionWidget;