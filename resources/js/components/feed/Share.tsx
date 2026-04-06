import React, { useState, useRef } from "react";
import {
    Box,
    Divider,
    Button,
    TextField,
    useTheme,
    Avatar,
    Typography,
    IconButton,
    Popover,
    Chip,
    alpha,
} from "@mui/material";
import {
    AddPhotoAlternate as AddPhoto,
    Diversity3,
    Send,
    EmojiEmotions,
    Close as CloseIcon,
    Public,
    Lock,
} from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSnackBar } from "@/context/SnackBarContext";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useForm } from "@inertiajs/react";
import { useAuth } from "@/context/AuthContext";

type ShareFormData = {
    content: string;
    image: File | null;
};

function Share() {
    const theme = useTheme();
    const { user } = useAuth();
    const { showSnackBar } = useSnackBar();

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [emojiAnchor, setEmojiAnchor] = useState<HTMLButtonElement | null>(null);
    const [isPrivate, setIsPrivate] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } =
        useForm<ShareFormData>({
            content: "",
            image: null,
        });

    const charLimit = 500;
    const charCount = data.content.length;
    const nearLimit = charCount > charLimit * 0.8;
    const overLimit = charCount > charLimit;

    // ── Handlers ────────────────────────────────────────────────────────
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.content.trim() && !data.image) return;
        if (overLimit) return;

        post("/posts", {
            forceFormData: true, // ensures file upload works
            onSuccess: () => {
                showSnackBar("Post shared successfully!", "success");
                reset();
                setPreviewUrl(null);
            },
            onError: () => {
                showSnackBar("Could not create post. Please try again.", "error");
            },
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setData("image", file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        setData("image", null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setData("content", data.content + emojiData.emoji);
        setEmojiAnchor(null);
    };

    const isDark = theme.palette.mode === "dark";

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: "16px",
                p: 2.5,
                my: 2,
                boxShadow: `0 2px 16px ${alpha(theme.palette.common.black, 0.07)}`,
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            }}
        >
            {/* ── Top row: avatar + text input ──────────────────────── */}
            <Box display="flex" gap={1.5} alignItems="flex-start">
                <Avatar
                    src={user?.profile_image_url ?? undefined}
                    alt={user?.username}
                    sx={{
                        width: 42,
                        height: 42,
                        flexShrink: 0,
                        border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        mt: 0.5,
                    }}
                >
                    {user?.username?.charAt(0).toUpperCase()}
                </Avatar>

                <Box flex={1}>
                    <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        maxRows={8}
                        placeholder={`What's on your mind, ${user?.username}?`}
                        value={data.content}
                        onChange={(e) => setData("content", e.target.value)}
                        variant="standard"
                        error={Boolean(errors.content) || overLimit}
                        InputProps={{ disableUnderline: true }}
                        sx={{
                            "& .MuiInputBase-input": {
                                fontSize: "15px",
                                lineHeight: 1.55,
                                color: theme.palette.text.primary,
                                "&::placeholder": {
                                    color: alpha(theme.palette.text.secondary, 0.6),
                                    opacity: 1,
                                },
                            },
                        }}
                    />

                    {/* Char counter — only shown near limit */}
                    {nearLimit && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: overLimit ? "#ef4444" : "#f59e0b",
                                fontWeight: 600,
                                display: "block",
                                textAlign: "right",
                                mt: 0.5,
                            }}
                        >
                            {charLimit - charCount}{" "}
                            {charLimit - charCount === 1 ? "character" : "characters"} left
                        </Typography>
                    )}

                    {errors.content && (
                        <Typography
                            variant="caption"
                            color="error"
                            display="block"
                            mt={0.3}
                        >
                            {errors.content}
                        </Typography>
                    )}
                </Box>

                {/* Emoji button */}
                <IconButton
                    size="small"
                    onClick={(e) => setEmojiAnchor(e.currentTarget)}
                    sx={{
                        mt: 0.5,
                        color: "#f59e0b",
                        "&:hover": {
                            backgroundColor: alpha("#f59e0b", 0.1),
                        },
                    }}
                >
                    <EmojiEmotions fontSize="small" />
                </IconButton>
            </Box>

            {/* ── Emoji picker popover ───────────────────────────────── */}
            <Popover
                open={Boolean(emojiAnchor)}
                anchorEl={emojiAnchor}
                onClose={() => setEmojiAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{ sx: { borderRadius: "12px", overflow: "hidden" } }}
            >
                <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    theme={isDark ? Theme.DARK : Theme.LIGHT}
                    height={380}
                />
            </Popover>

            {/* ── Image preview ──────────────────────────────────────── */}
            {previewUrl && (
                <Box
                    sx={{
                        position: "relative",
                        mt: 2,
                        borderRadius: "12px",
                        overflow: "hidden",
                        border: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
                    }}
                >
                    <Box
                        component="img"
                        src={previewUrl}
                        alt="Preview"
                        sx={{
                            width: "100%",
                            maxHeight: 320,
                            objectFit: "cover",
                            display: "block",
                        }}
                    />
                    <IconButton
                        size="small"
                        onClick={handleRemoveImage}
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            backgroundColor: alpha("#000", 0.55),
                            color: "white",
                            "&:hover": { backgroundColor: alpha("#000", 0.75) },
                        }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            )}

            <Divider sx={{ my: 1.8 }} />

            {/* ── Bottom row: actions + submit ───────────────────────── */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={1}
            >
                {/* Left: action buttons */}
                <Box display="flex" alignItems="center" gap={0.5}>
                    {/* Image upload */}
                    <Button
                        component="label"
                        variant="text"
                        size="small"
                        startIcon={<AddPhoto />}
                        sx={{
                            textTransform: "none",
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#f97316",
                            borderRadius: "8px",
                            px: 1.2,
                            "&:hover": {
                                backgroundColor: alpha("#f97316", 0.08),
                            },
                        }}
                    >
                        Photo
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            hidden
                        />
                    </Button>

                    {/* Tag friends */}
                    <Button
                        variant="text"
                        size="small"
                        startIcon={<Diversity3 />}
                        sx={{
                            textTransform: "none",
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#3b82f6",
                            borderRadius: "8px",
                            px: 1.2,
                            "&:hover": {
                                backgroundColor: alpha("#3b82f6", 0.08),
                            },
                        }}
                    >
                        Tag
                    </Button>

                    {/* Audience toggle */}
                    <Chip
                        icon={
                            isPrivate ? (
                                <Lock sx={{ fontSize: "14px !important" }} />
                            ) : (
                                <Public sx={{ fontSize: "14px !important" }} />
                            )
                        }
                        label={isPrivate ? "Only me" : "Everyone"}
                        size="small"
                        onClick={() => setIsPrivate((p) => !p)}
                        sx={{
                            height: 28,
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            borderRadius: "8px",
                            backgroundColor: isPrivate
                                ? alpha("#64748b", 0.1)
                                : alpha("#10b981", 0.1),
                            color: isPrivate ? "#64748b" : "#10b981",
                            border: `1px solid ${isPrivate ? alpha("#64748b", 0.25) : alpha("#10b981", 0.25)}`,
                            "& .MuiChip-icon": {
                                color: "inherit",
                            },
                        }}
                    />
                </Box>

                {/* Right: submit */}
                <LoadingButton
                    type="submit"
                    size="small"
                    endIcon={<Send />}
                    loading={processing}
                    loadingPosition="end"
                    variant="contained"
                    disabled={
                        (!data.content.trim() && !data.image) || overLimit
                    }
                    sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: "10px",
                        px: 2.5,
                        boxShadow: "none",
                        "&:hover": { boxShadow: "none" },
                    }}
                >
                    Share
                </LoadingButton>
            </Box>
        </Box>
    );
}

export default Share;