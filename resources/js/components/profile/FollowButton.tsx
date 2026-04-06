import { Check, PersonAddAlt1 } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from "react";

function FollowButton({
    isFollowing,
    isFollowedBy,
    onClick,
}: {
    isFollowing: boolean;
    isFollowedBy: boolean;
    onClick: () => void;
}) {
    const [hovered, setHovered] = useState(false);

    if (isFollowing) {
        return (
            <Button
                size="small"
                variant={hovered ? "outlined" : "contained"}
                color={hovered ? "error" : "primary"}
                startIcon={hovered ? undefined : <Check fontSize="small" />}
                onClick={onClick}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "20px",
                    px: 2.5,
                    minWidth: 110,
                    transition: "all 0.2s ease",
                }}
            >
                {hovered ? "Unfollow" : "Following"}
            </Button>
        );
    }

    return (
        <Button
            size="small"
            variant="contained"
            startIcon={<PersonAddAlt1 fontSize="small" />}
            onClick={onClick}
            sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "20px",
                px: 2.5,
                minWidth: 110,
            }}
        >
            {isFollowedBy ? "Follow Back" : "Follow"}
        </Button>
    );
}

export default FollowButton;