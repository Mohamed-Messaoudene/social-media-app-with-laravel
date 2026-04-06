import { ProfileUser } from "@/types/profile";
import { useMemo } from "react";

type CompletionStep = {
    key: string;
    label: string;
    description: string;
    done: boolean;
    points: number;
};

export function useProfileCompletion(user: ProfileUser) {
    return useMemo(() => {
        const steps: CompletionStep[] = [
            {
                key: "profile_image",
                label: "Add a profile photo",
                description: "Let people know who you are",
                done: Boolean(user.profile_image_url),
                points: 25,
            },
            {
                key: "cover_image",
                label: "Add a cover photo",
                description: "Personalize your profile header",
                done: Boolean(user.cover_image_url),
                points: 15,
            },
            {
                key: "bio",
                label: "Write a bio",
                description: "Tell the world a little about yourself",
                done: Boolean(user.bio && user.bio.trim().length > 0),
                points: 25,
            },
            {
                key: "full_name",
                label: "Add your full name",
                description: "Help friends find you more easily",
                done: Boolean(
                    user.full_name && user.full_name.trim().length > 0
                ),
                points: 20,
            },
            {
                key: "location",
                label: "Add your location",
                description: "Connect with people near you",
                done: Boolean(
                    user.location && user.location.trim().length > 0
                ),
                points: 15,
            },
        ];

        const totalPoints = steps.reduce((sum, s) => sum + s.points, 0);
        const earnedPoints = steps
            .filter((s) => s.done)
            .reduce((sum, s) => sum + s.points, 0);
        const percentage = Math.round((earnedPoints / totalPoints) * 100);

        return { steps, percentage };
    }, [user]);
}