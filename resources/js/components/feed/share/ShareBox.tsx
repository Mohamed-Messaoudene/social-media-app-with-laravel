import React, { Suspense, useRef } from "react";
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
    alpha,
} from "@mui/material";
import {
    AddPhotoAlternate as AddPhoto,
    Diversity3,
    EmojiEmotions,
    Close as CloseIcon,
    ArrowForward,
    Image as ImageIcon,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { ShareFormData, VISIBILITY_OPTIONS } from "@/types/post";
import type { EmojiClickData } from "emoji-picker-react";
import { Theme } from "emoji-picker-react";
// ✅ Only the heavy default export (the component) gets lazy loaded
const EmojiPicker = React.lazy(() => import("emoji-picker-react"));

// ─── Props ────────────────────────────────────────────────────────────────────

type ShareBoxProps = {
    data: ShareFormData;
    setData: <K extends keyof ShareFormData>(
        key: K,
        value: ShareFormData[K],
    ) => void;
    errors: Partial<Record<keyof ShareFormData, string>>;
    previewUrl: string | null;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveImage: () => void;
    onEmojiClick: (emojiData: EmojiClickData) => void;
    onNext: () => void;
    canSubmit: boolean;
    emojiAnchor: HTMLButtonElement | null;
    setEmojiAnchor: (el: HTMLButtonElement | null) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
};

// ─── Component ────────────────────────────────────────────────────────────────

function ShareBox({
    data,
    setData,
    errors,
    previewUrl,
    onImageChange,
    onRemoveImage,
    onEmojiClick,
    onNext,
    canSubmit,
    emojiAnchor,
    setEmojiAnchor,
    fileInputRef,
}: ShareBoxProps) {
    const theme = useTheme();
    const { user } = useAuth();
    const isDark = theme.palette.mode === "dark";

    const selectedVisibility = VISIBILITY_OPTIONS.find(
        (v) => v.value === data.visibility,
    )!;

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: "16px",
                p: 2.5,
                my: 2,
                boxShadow: `0 2px 16px ${alpha(theme.palette.common.black, 0.07)}`,
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            }}
        >
            {/* ── Avatar + textarea ──────────────────────────── */}
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
                        value={data.post_content}
                        onChange={(e) =>
                            setData("post_content", e.target.value)
                        }
                        variant="standard"
                        error={Boolean(errors.post_content)}
                        InputProps={{ disableUnderline: true }}
                        sx={{
                            "& .MuiInputBase-input": {
                                fontSize: "15px",
                                lineHeight: 1.55,
                                color: theme.palette.text.primary,
                                "&::placeholder": {
                                    color: alpha(
                                        theme.palette.text.secondary,
                                        0.6,
                                    ),
                                    opacity: 1,
                                },
                            },
                        }}
                    />

                    {errors.post_content && (
                        <Typography
                            variant="caption"
                            color="error"
                            display="block"
                            mt={0.3}
                        >
                            {errors.post_content}
                        </Typography>
                    )}
                </Box>

                {/* Emoji trigger */}
                <IconButton
                    size="small"
                    onClick={(e) => setEmojiAnchor(e.currentTarget)}
                    sx={{
                        mt: 0.5,
                        color: "#f59e0b",
                        "&:hover": { backgroundColor: alpha("#f59e0b", 0.1) },
                    }}
                >
                    <EmojiEmotions fontSize="small" />
                </IconButton>
            </Box>

            {/* ── Emoji popover ──────────────────────────────── */}
            <Popover
                open={Boolean(emojiAnchor)}
                anchorEl={emojiAnchor}
                onClose={() => setEmojiAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                    sx: { borderRadius: "12px", overflow: "hidden" },
                }}
            >
                <Suspense fallback={null}>
                    {emojiAnchor && (
                        <EmojiPicker
                            onEmojiClick={onEmojiClick}
                            theme={isDark ? Theme.DARK : Theme.LIGHT}
                            height={380}
                        />
                    )}
                </Suspense>
            </Popover>

            {/* ── Image preview ──────────────────────────────── */}
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
                            maxHeight: 280,
                            objectFit: "cover",
                            display: "block",
                        }}
                    />
                    <IconButton
                        size="small"
                        onClick={onRemoveImage}
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

            {/* ── Bottom actions ─────────────────────────────── */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={1}
            >
                <Box display="flex" alignItems="center" gap={0.5}>
                    {/* Photo upload */}
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
                            onChange={onImageChange}
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

                    {/* Visibility badge — also opens modal */}
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                        onClick={canSubmit ? onNext : undefined}
                        sx={{
                            px: 1,
                            py: 0.4,
                            borderRadius: "8px",
                            backgroundColor: alpha(
                                selectedVisibility.color,
                                0.07,
                            ),
                            color: selectedVisibility.color,
                            cursor: canSubmit ? "pointer" : "default",
                            transition: "background 0.15s",
                            "&:hover": canSubmit
                                ? {
                                      backgroundColor: alpha(
                                          selectedVisibility.color,
                                          0.13,
                                      ),
                                  }
                                : {},
                        }}
                    >
                        {<selectedVisibility.icon />}
                        <Typography
                            variant="caption"
                            fontWeight={600}
                            fontSize="12px"
                        >
                            {selectedVisibility.label}
                        </Typography>
                    </Box>
                </Box>

                {/* Next button */}
                <Button
                    variant="contained"
                    size="small"
                    endIcon={<ArrowForward />}
                    disabled={!canSubmit}
                    onClick={onNext}
                    sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: "10px",
                        px: 2.5,
                        boxShadow: "none",
                        "&:hover": { boxShadow: "none" },
                    }}
                >
                    Next
                </Button>
            </Box>

            {/* Empty hint */}
            {!data.post_content && !data.image && (
                <Box
                    display="flex"
                    alignItems="center"
                    gap={0.8}
                    mt={1}
                    sx={{ opacity: 0.35 }}
                >
                    <ImageIcon sx={{ fontSize: 13, color: "text.disabled" }} />
                    <Typography variant="caption" color="text.disabled">
                        Write something or add a photo to continue
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

export default ShareBox;
