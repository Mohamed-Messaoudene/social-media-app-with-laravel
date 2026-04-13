import React, { useState } from "react";
import {
    Box,
    Divider,
    Button,
    TextField,
    useTheme,
    Avatar,
    Typography,
    IconButton,
    alpha,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    ToggleButton,
    ToggleButtonGroup,
    Switch,
    Collapse,
    Chip,
} from "@mui/material";
import {
    Close as CloseIcon,
    Schedule,
    EditNote,
    CheckCircle,
} from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import { ShareFormData, Visibility, VISIBILITY_OPTIONS } from "@/types/post";
import { useAuth } from "@/context/AuthContext";

// ─── Props ────────────────────────────────────────────────────────────────────

type PostPreviewModalProps = {
    open: boolean;
    onClose: () => void;
    onPublish: () => void;
    data: ShareFormData;
    setData: <K extends keyof ShareFormData>(key: K, value: ShareFormData[K]) => void;
    previewUrl: string | null;
    processing: boolean;
};

// ─── Component ────────────────────────────────────────────────────────────────

function PostPreviewModal({
    open,
    onClose,
    onPublish,
    data,
    setData,
    previewUrl,
    processing,
}: PostPreviewModalProps) {
    const theme = useTheme();
    const { user } = useAuth();
    const [scheduleEnabled, setScheduleEnabled] = useState(false);

    const selectedVisibility = VISIBILITY_OPTIONS.find(
        (v) => v.value === data.visibility
    )!;

    const handleScheduleToggle = (enabled: boolean) => {
        setScheduleEnabled(enabled);
        if (!enabled) {
            setData("published_at", null);
        } else {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(12, 0, 0, 0);
            setData("published_at", tomorrow.toISOString().slice(0, 16));
        }
    };

    const minDateTime = new Date(Date.now() + 5 * 60 * 1000)
        .toISOString()
        .slice(0, 16);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "20px",
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: `0 24px 48px ${alpha(theme.palette.common.black, 0.18)}`,
                },
            }}
        >
            {/* ── Header ──────────────────────────────────────── */}
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pb: 1,
                    pt: 2.5,
                    px: 3,
                }}
            >
                <Box>
                    <Typography variant="h6" fontWeight={700} lineHeight={1.2}>
                        Review your post
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Choose who sees it and when
                    </Typography>
                </Box>
                <IconButton
                    size="small"
                    onClick={onClose}
                    sx={{
                        color: theme.palette.text.secondary,
                        "&:hover": {
                            backgroundColor: alpha(theme.palette.text.secondary, 0.08),
                        },
                    }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ px: 3, pt: 1, pb: 0 }}>
                {/* ── Post mini-preview ──────────────────────── */}
                <Box
                    sx={{
                        borderRadius: "14px",
                        border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
                        backgroundColor: alpha(theme.palette.background.default, 0.5),
                        p: 2,
                        mb: 3,
                    }}
                >
                    <Box display="flex" gap={1.5} alignItems="flex-start">
                        <Avatar
                            src={user?.profile_image_url ?? undefined}
                            sx={{ width: 36, height: 36, flexShrink: 0 }}
                        >
                            {user?.username?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box flex={1} minWidth={0}>
                            <Box
                                display="flex"
                                alignItems="center"
                                gap={0.8}
                                flexWrap="wrap"
                                mb={0.5}
                            >
                                <Typography variant="body2" fontWeight={700} color="text.primary">
                                    {user?.username}
                                </Typography>

                                {/* Visibility chip */}
                                <Chip
                                    icon={<selectedVisibility.icon />}
                                    label={selectedVisibility.label}
                                    size="small"
                                    sx={{
                                        height: 18,
                                        fontSize: "10px",
                                        fontWeight: 600,
                                        backgroundColor: alpha(selectedVisibility.color, 0.1),
                                        color: selectedVisibility.color,
                                        "& .MuiChip-label": { px: 0.7 },
                                        "& .MuiChip-icon": { color: "inherit" },
                                    }}
                                />

                                {/* Scheduled chip */}
                                {data.published_at && (
                                    <Chip
                                        icon={<Schedule sx={{ fontSize: "11px !important" }} />}
                                        label="Scheduled"
                                        size="small"
                                        sx={{
                                            height: 18,
                                            fontSize: "10px",
                                            fontWeight: 600,
                                            backgroundColor: alpha("#f59e0b", 0.1),
                                            color: "#f59e0b",
                                            "& .MuiChip-label": { px: 0.7 },
                                            "& .MuiChip-icon": { color: "inherit" },
                                        }}
                                    />
                                )}
                            </Box>

                            {/* Content preview (3 lines max) */}
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    lineHeight: 1.5,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }}
                            >
                                {data.post_content}
                            </Typography>

                            {/* Image thumbnail */}
                            {previewUrl && (
                                <Box
                                    sx={{
                                        mt: 1.5,
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                        height: 110,
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={previewUrl}
                                        alt="preview"
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            display: "block",
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* ── Visibility selector ────────────────────── */}
                <Typography variant="body2" fontWeight={700} color="text.primary" mb={1.2}>
                    Who can see this?
                </Typography>
                <ToggleButtonGroup
                    value={data.visibility}
                    exclusive
                    onChange={(_, val) => {
                        if (val) setData("visibility", val as Visibility);
                    }}
                    fullWidth
                    sx={{ gap: 1, mb: 3 }}
                >
                    {VISIBILITY_OPTIONS.map((opt) => (
                        <ToggleButton
                            key={opt.value}
                            value={opt.value}
                            sx={{
                                flex: 1,
                                flexDirection: "column",
                                gap: 0.5,
                                py: 1.5,
                                px: 1,
                                borderRadius: "12px !important",
                                border: `1.5px solid ${alpha(theme.palette.divider, 0.5)} !important`,
                                textTransform: "none",
                                transition: "all 0.15s ease",
                                "&.Mui-selected": {
                                    backgroundColor: alpha(opt.color, 0.08),
                                    borderColor: `${alpha(opt.color, 0.5)} !important`,
                                    color: opt.color,
                                    "&:hover": { backgroundColor: alpha(opt.color, 0.12) },
                                },
                                "&:hover": { backgroundColor: alpha(opt.color, 0.05) },
                            }}
                        >
                            <Box
                                sx={{
                                    color:
                                        data.visibility === opt.value
                                            ? opt.color
                                            : alpha(theme.palette.text.secondary, 0.4),
                                    display: "flex",
                                    transition: "color 0.15s",
                                }}
                            >
                                {<opt.icon/>}
                            </Box>
                            <Typography
                                variant="caption"
                                fontWeight={600}
                                lineHeight={1}
                                color={data.visibility === opt.value ? opt.color : "text.secondary"}
                            >
                                {opt.label}
                            </Typography>
                            <Typography
                                variant="caption"
                                fontSize="10px"
                                color="text.disabled"
                                lineHeight={1.2}
                                textAlign="center"
                                sx={{ display: { xs: "none", sm: "block" } }}
                            >
                                {opt.description}
                            </Typography>
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>

                <Divider sx={{ mb: 2.5 }} />

                {/* ── Comments toggle ────────────────────────── */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1.5}
                    sx={{
                        p: 1.5,
                        borderRadius: "12px",
                        backgroundColor: alpha(theme.palette.background.default, 0.6),
                    }}
                >
                    <Box>
                        <Typography variant="body2" fontWeight={600} color="text.primary">
                            Allow comments
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Let others reply to this post
                        </Typography>
                    </Box>
                    <Switch
                        checked={data.comments_enabled}
                        onChange={(e) => setData("comments_enabled", e.target.checked)}
                        size="small"
                        color="primary"
                    />
                </Box>

                {/* ── Schedule toggle ────────────────────────── */}
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: "12px",
                        backgroundColor: alpha(theme.palette.background.default, 0.6),
                        mb: 1,
                    }}
                >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                            <Typography variant="body2" fontWeight={600} color="text.primary">
                                Schedule for later
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Publish at a specific date and time
                            </Typography>
                        </Box>
                        <Switch
                            checked={scheduleEnabled}
                            onChange={(e) => handleScheduleToggle(e.target.checked)}
                            size="small"
                            color="warning"
                        />
                    </Box>

                    <Collapse in={scheduleEnabled}>
                        <Box mt={1.5}>
                            <TextField
                                type="datetime-local"
                                fullWidth
                                size="small"
                                value={data.published_at ?? ""}
                                onChange={(e) =>
                                    setData("published_at", e.target.value || null)
                                }
                                inputProps={{ min: minDateTime }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "10px",
                                        fontSize: "14px",
                                    },
                                }}
                            />
                            {data.published_at && (
                                <Box display="flex" alignItems="center" gap={0.5} mt={0.8}>
                                    <Schedule sx={{ fontSize: 13, color: "#f59e0b" }} />
                                    <Typography variant="caption" color="#f59e0b" fontWeight={600}>
                                        Will publish on{" "}
                                        {new Date(data.published_at).toLocaleString(undefined, {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Collapse>
                </Box>
            </DialogContent>

            {/* ── Footer ──────────────────────────────────────── */}
            <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditNote />}
                    onClick={onClose}
                    sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: "10px",
                        px: 2,
                    }}
                >
                    Edit post
                </Button>
                <LoadingButton
                    variant="contained"
                    size="small"
                    loading={processing}
                    endIcon={scheduleEnabled ? <Schedule /> : <CheckCircle />}
                    loadingPosition="end"
                    onClick={onPublish}
                    sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: "10px",
                        px: 2.5,
                        boxShadow: "none",
                        "&:hover": { boxShadow: "none" },
                    }}
                >
                    {scheduleEnabled ? "Schedule post" : "Publish now"}
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}

export default PostPreviewModal;