import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import UserAvatar from "../../ui/Avatar";
import CustomButton from "../../ui/CustomButton";
import ScrollableBox from "../../ui/ScrollableBox";
import { Link, usePage } from "@inertiajs/react";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1"; // Import suggestion icon
import { Inertia } from "@inertiajs/inertia";
import { useSnackBar } from "../../../context/SnackBarContext";
import { SharedProps } from "../../../types/global";
import { User } from "../../../types/common";

function Suggestions() {
    const { suggestions } = usePage<
        SharedProps & {
            suggestions: User[];
        }
    >().props;
    const theme = useTheme();
    const { showSnackBar } = useSnackBar();

    const handleFollow = (suggestionId: number): void => {
        Inertia.post(
            `/profile/${suggestionId}/follow`,
            {},
            {
                onSuccess: () => {
                    showSnackBar("profile followed successfully");
                },
                onError: () => {
                    showSnackBar(
                        "profile following failed ,please try again !!!",
                        "warning",
                    );
                },
            },
        );
    };

    return (
        <Box
            width="100%"
            padding="12px"
            borderRadius="8px"
            sx={{
                backgroundColor: theme.palette.background.paper,
                boxShadow: "2px 8px 19px -5px rgba(159,162,175,0.5)",
            }}
        >
            <Typography
                variant="body1"
                sx={{
                    color: theme.palette.text.primary,
                    marginBottom: "20px",
                    fontWeight: "bold",
                }}
            >
                Suggestions for you
            </Typography>

            {suggestions.length > 0 ? (
                <ScrollableBox maxHeight="150px" scrollAmount={150}>
                    {suggestions.map((suggestion, index) => (
                        <Box
                            key={index}
                            height="40px"
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            marginBottom="8px"
                        >
                            <Link
                                href={`/profile/${suggestion.id}`}
                                style={{ textDecoration: "none" }}
                            >
                                <UserAvatar
                                    imgUrl={suggestion.profileImagePath}
                                    username={suggestion.username}
                                />
                            </Link>

                            <Box>
                                <CustomButton
                                    content="Follow"
                                    bgcolor="blue"
                                    handleClick={() =>
                                        handleFollow(suggestion.id)
                                    }
                                />
                                {/* <CustomButton content="Dismiss" bgcolor="red" /> */}
                            </Box>
                        </Box>
                    ))}
                </ScrollableBox>
            ) : (
                // No Suggestions UI
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="center"
                    padding="20px"
                >
                    <PersonAddAlt1Icon
                        sx={{
                            fontSize: 50,
                            color: theme.palette.primary.main,
                            marginBottom: "10px",
                        }}
                    />
                    <Typography
                        variant="body2"
                        sx={{ color: theme.palette.text.secondary }}
                    >
                        No new suggestions at the moment.
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{ color: theme.palette.text.disabled }}
                    >
                        Check back later for new people to follow.
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

export default Suggestions;
