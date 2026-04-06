import React from "react";
import {
    Email,
    GitHub,
    Instagram,
    LinkedIn,
    People,
    PersonAdd,
    Place,
    Article,
    EditNote,
    HowToReg,
} from "@mui/icons-material";
import {
    Avatar,
    Box,
    useTheme,
    Typography,
    IconButton,
    Button,
    Chip,
    Divider,
    Tooltip,
    alpha,
} from "@mui/material";
import { useSnackBar } from "../context/SnackBarContext";
import Posts from "@/components/feed/posts/Posts";
import { router, usePage } from "@inertiajs/react";
import { ProfilePageProps } from "@/types/profile";
import defaultCoverImage from "@/assets/default_cover_image.jpg";
import StatCard from "@/components/profile/StatCard";
import FollowButton from "@/components/profile/FollowButton";
import PrivateProfileBlock from "@/components/profile/PrivateProfileBlock";
import ProfileCompletionWidget from "@/components/profile/ProfileCompletionWidget";


// ─── Main Profile Page ─────────────────────────────────────────────────────────
function Profile() {
    const theme = useTheme();
    const { showSnackBar } = useSnackBar();
    const { user, stats, relationships, posts } =
        usePage<ProfilePageProps>().props;

    const handleFollow = () => {
        const action = relationships.is_following ? "unfollow" : "follow";
        router.post(
            `/profile/${user.id}/${action}`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    showSnackBar(
                        `${action === "follow" ? "Following" : "Unfollowed"} @${user.username}`,
                        "success"
                    );
                },
                onError: () => {
                    showSnackBar(
                        `Could not ${action}. Please try again.`,
                        "warning"
                    );
                },
            }
        );
    };

    const canSeePosts =
        relationships.is_own_profile ||
        relationships.is_following ||
        !relationships.is_private;

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            minHeight="calc(100vh - 67px)"
            sx={{ backgroundColor: theme.palette.background.default }}
        >
            {/* ── Cover Image ───────────────────────────────────────────── */}
            <Box
                width="100%"
                sx={{
                    position: "relative",
                    height: { xs: 160, md: 260 },
                    overflow: "hidden",
                }}
            >
                <Box
                    component="img"
                    src={user.cover_image_url || defaultCoverImage}
                    alt="cover"
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35) 100%)",
                    }}
                />
            </Box>

            {/* ── Profile Card ──────────────────────────────────────────── */}
            <Box
                width={{ xs: "95%", sm: "80%", md: "60%", lg: "50%" }}
                sx={{ mt: "-60px", mb: 3, position: "relative", zIndex: 1 }}
            >
                <Box
                    sx={{
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: "16px",
                        boxShadow: `0 4px 24px ${alpha(theme.palette.common.black, 0.1)}`,
                        overflow: "visible",
                        pt: "70px",
                        pb: 3,
                        px: 3,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "relative",
                    }}
                >
                    {/* Avatar */}
                    <Avatar
                        src={user.profile_image_url || "/default-avatar.png"}
                        sx={{
                            width: 110,
                            height: 110,
                            position: "absolute",
                            top: -55,
                            left: "50%",
                            transform: "translateX(-50%)",
                            border: `4px solid ${theme.palette.background.paper}`,
                            boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.2)}`,
                        }}
                    />

                    {/* Name + username */}
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        color={theme.palette.text.primary}
                        textAlign="center"
                    >
                        {user.full_name}
                    </Typography>
                    <Typography
                        variant="body2"
                        color={theme.palette.text.secondary}
                        mb={1}
                    >
                        @{user.username}
                    </Typography>

                    {/* Mutual follow badge */}
                    {!relationships.is_own_profile &&
                        relationships.is_followed_by && (
                            <Chip
                                icon={<HowToReg fontSize="small" />}
                                label="Follows you"
                                size="small"
                                sx={{
                                    mb: 1.5,
                                    fontSize: "11px",
                                    backgroundColor: alpha(
                                        theme.palette.primary.main,
                                        0.1
                                    ),
                                    color: theme.palette.primary.main,
                                    fontWeight: 600,
                                }}
                            />
                        )}

                    {/* Bio */}
                    {user.bio && (
                        <Typography
                            variant="body2"
                            color={theme.palette.text.secondary}
                            textAlign="center"
                            maxWidth={400}
                            lineHeight={1.6}
                            mb={1.5}
                        >
                            {user.bio}
                        </Typography>
                    )}

                    {/* Location */}
                    {user.location && (
                        <Box display="flex" alignItems="center" gap={0.5} mb={2}>
                            <Place
                                sx={{
                                    fontSize: 16,
                                    color: theme.palette.text.disabled,
                                }}
                            />
                            <Typography
                                variant="caption"
                                color={theme.palette.text.secondary}
                                fontWeight={500}
                            >
                                {user.location}
                            </Typography>
                        </Box>
                    )}

                    <Divider flexItem sx={{ mb: 2 }} />

                    {/* Stats row */}
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap={1}
                        mb={2.5}
                        flexWrap="wrap"
                    >
                        <StatCard
                            icon={<Article sx={{ fontSize: 16 }} />}
                            value={stats.posts_count}
                            label="Posts"
                        />
                        <Divider orientation="vertical" flexItem />
                        <StatCard
                            icon={<People sx={{ fontSize: 16 }} />}
                            value={stats.followers_count}
                            label="Followers"
                            href={`/profile/${user.id}/followers`}
                            clickable
                        />
                        <Divider orientation="vertical" flexItem />
                        <StatCard
                            icon={<PersonAdd sx={{ fontSize: 16 }} />}
                            value={stats.following_count}
                            label="Following"
                            href={`/profile/${user.id}/following`}
                            clickable
                        />
                    </Box>

                    {/* Action buttons */}
                    <Box display="flex" gap={1.5} alignItems="center" mb={2}>
                        {relationships.is_own_profile ? (
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<EditNote />}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 600,
                                    borderRadius: "20px",
                                    px: 2.5,
                                }}
                                onClick={() => router.visit("/profile/edit")}
                            >
                                Edit Profile
                            </Button>
                        ) : (
                            <FollowButton
                                isFollowing={relationships.is_following}
                                isFollowedBy={relationships.is_followed_by}
                                onClick={handleFollow}
                            />
                        )}
                    </Box>

                    {/* ── Completion widget — own profile only ── */}
                    {relationships.is_own_profile && (
                        <Box width="100%" px={1}>
                            <ProfileCompletionWidget user={user} />
                        </Box>
                    )}

                    {/* Social links */}
                    <Box display="flex" gap={0.5}>
                        {[
                            { icon: <Instagram />, label: "Instagram" },
                            { icon: <LinkedIn />, label: "LinkedIn" },
                            { icon: <GitHub />, label: "GitHub" },
                            { icon: <Email />, label: "Email" },
                        ].map(({ icon, label }) => (
                            <Tooltip title={label} key={label}>
                                <IconButton
                                    component="a"
                                    href="#"
                                    target="_blank"
                                    size="small"
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        "&:hover": {
                                            color: theme.palette.primary.main,
                                            backgroundColor: alpha(
                                                theme.palette.primary.main,
                                                0.08
                                            ),
                                        },
                                    }}
                                >
                                    {icon}
                                </IconButton>
                            </Tooltip>
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* ── Posts Section ─────────────────────────────────────────── */}
            <Box
                width={{ xs: "95%", sm: "80%", md: "60%", lg: "50%" }}
                mb={8}
            >
                {canSeePosts ? (
                    <>
                        {posts && posts.data.length > 0 ? (
                            <Posts posts={posts} />
                        ) : (
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                py={8}
                                sx={{
                                    borderRadius: "16px",
                                    border: `1.5px dashed ${alpha(theme.palette.text.secondary, 0.2)}`,
                                    backgroundColor: alpha(
                                        theme.palette.background.paper,
                                        0.5
                                    ),
                                    textAlign: "center",
                                }}
                            >
                                <Article
                                    sx={{
                                        fontSize: 48,
                                        color: alpha(
                                            theme.palette.text.secondary,
                                            0.3
                                        ),
                                        mb: 1.5,
                                    }}
                                />
                                <Typography
                                    variant="body1"
                                    fontWeight={600}
                                    color={theme.palette.text.primary}
                                    mb={0.5}
                                >
                                    No posts yet
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color={theme.palette.text.secondary}
                                >
                                    {relationships.is_own_profile
                                        ? "Share your first post with your followers."
                                        : `@${user.username} hasn't posted anything yet.`}
                                </Typography>
                            </Box>
                        )}
                    </>
                ) : (
                    <PrivateProfileBlock username={user.username} />
                )}
            </Box>
        </Box>
    );
}

export default Profile;