import React from "react";
import { usePage, router } from "@inertiajs/react";
import { PeopleAlt } from "@mui/icons-material";
import { useSnackBar } from "@/context/SnackBarContext";
import { SharedProps } from "@/types/global";
import { RightbarCard, UserRow, EmptyState } from "@/components/layout/RightBar/RightBarShared";
import { ProfileUser } from "@/types/profile";

function MyFriends() {
    const { friends } = usePage<SharedProps & { friends: ProfileUser[] }>().props;
    const { showSnackBar } = useSnackBar();

    const handleUnfollow = (id: number, username: string) => {
        router.post(
            `/profile/${id}/unfollow`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => showSnackBar(`Unfollowed @${username}`, "success"),
                onError: () => showSnackBar("Could not unfollow. Try again.", "warning"),
            }
        );
    };

    return (
        <RightbarCard title="Following" action={{ label: "See all", href: "/friends" }}>
            {friends.length > 0 ? (
                friends.slice(0, 5).map((f) => (
                    <UserRow
                        key={f.id}
                        id={f.id}
                        username={f.username}
                        profileImagePath={f.profile_image_url}
                        actionLabel="Unfollow"
                        actionColor="error"
                        onAction={() => handleUnfollow(f.id, f.username)}
                    />
                ))
            ) : (
                <EmptyState
                    icon={<PeopleAlt fontSize="inherit" />}
                    title="Not following anyone yet"
                    subtitle="Start connecting with people you know."
                />
            )}
        </RightbarCard>
    );
}

export default MyFriends;