import React, { useState, useRef } from "react";
import { useForm } from "@inertiajs/react";
import { EmojiClickData } from "emoji-picker-react";
import { useSnackBar } from "@/context/SnackBarContext";
import ShareBox from "./ShareBox";
import PostPreviewModal from "./PostPreviewModal";
import { ShareFormData } from "@/types/post";

/**
 * Share
 *
 * Entry point for the post creation flow.
 * Owns all state and passes down only what each child needs.
 *
 * Flow:
 *   ShareBox (write) → Next → PostPreviewModal (review) → Publish
 */
function Share() {
    const { showSnackBar } = useSnackBar();

    // ── Local UI state ─────────────────────────────────────────────────
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [emojiAnchor, setEmojiAnchor] = useState<HTMLButtonElement | null>(
        null,
    );
    const [modalOpen, setModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // ── Form state (single source of truth for both children) ──────────
    const { data, setData, post, processing, errors, reset } =
        useForm<ShareFormData>({
            post_content: "",
            image: null,
            visibility: "public",
            comments_enabled: true,
            published_at: null,
        });
    // ── Handlers ───────────────────────────────────────────────────────

    const handlePublish = () => {
        post("/posts", {
            forceFormData: true,
            onSuccess: () => {
                showSnackBar(
                    data.published_at
                        ? `Post scheduled for ${new Date(data.published_at).toLocaleString()}`
                        : "Post shared successfully!",
                    "success",
                );
                reset();
                setPreviewUrl(null);
                setModalOpen(false);
            },
            onError: () => {
                showSnackBar(
                    "Could not create post. Please try again.",
                    "error",
                );
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
        setData("post_content", data.post_content + emojiData.emoji);
        setEmojiAnchor(null);
    };

    return (
        <>
            <ShareBox
                data={data}
                setData={setData}
                errors={errors}
                previewUrl={previewUrl}
                onImageChange={handleImageChange}
                onRemoveImage={handleRemoveImage}
                onEmojiClick={handleEmojiClick}
                onNext={() => setModalOpen(true)}
                canSubmit={!errors.post_content && !errors.image}
                emojiAnchor={emojiAnchor}
                setEmojiAnchor={setEmojiAnchor}
                fileInputRef={fileInputRef}
            />

            <PostPreviewModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onPublish={handlePublish}
                data={data}
                setData={setData}
                previewUrl={previewUrl}
                processing={processing}
            />
        </>
    );
}

export default Share;
