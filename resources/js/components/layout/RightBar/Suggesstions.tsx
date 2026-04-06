import React from "react";
import { usePage, router } from "@inertiajs/react";
import { PersonAddAlt1 } from "@mui/icons-material";
import { useSnackBar } from "@/context/SnackBarContext";
import { SharedProps } from "@/types/global";
import { RightbarCard, UserRow, EmptyState } from "@/components/layout/RightBar/RightBarShared";
import { ProfileUser } from "@/types/profile";

function Suggestions() {
    const { suggestions } = usePage<SharedProps & { suggestions: ProfileUser[] }>().props;
    const { showSnackBar } = useSnackBar();

    const handleFollow = (id: number, username: string) => {
        router.post(
            `/profile/${id}/follow`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => showSnackBar(`Following @${username}`, "success"),
                onError: () => showSnackBar("Could not follow. Try again.", "warning"),
            }
        );
    };

    return (
        <RightbarCard title="People you may know" action={{ label: "See all", href: "/suggestions" }}>
            {suggestions.length > 0 ? (
                suggestions.slice(0, 5).map((s) => (
                    <UserRow
                        key={s.id}
                        id={s.id}
                        username={s.username}
                        profileImagePath={s.profile_image_url}
                        actionLabel="Follow"
                        actionColor="primary"
                        onAction={() => handleFollow(s.id, s.username)}
                    />
                ))
            ) : (
                <EmptyState
                    icon={<PersonAddAlt1 fontSize="inherit" />}
                    title="No suggestions right now"
                    subtitle="Check back later for new people to connect with."
                />
            )}
        </RightbarCard>
    );
}

export default Suggestions;