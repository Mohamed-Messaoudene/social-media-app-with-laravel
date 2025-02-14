import React from "react";
import { Box } from "@mui/material"; // Use `Grid` instead of `Grid2`
import Stories from "../components/home/Stories";
import Share from "../components/home/Share";
import Posts from "../components/home/Posts";
import Leftbar from "../components/Leftbar";
import Rightbar from "../components/RightBar/Rightbar";
import { usePage } from "@inertiajs/inertia-react";

function Home() {
    const {posts} = usePage().props;
    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "calc(100vh - 70px)",
                width: "100%",
            }}
        >
            {/* Leftbar - Fixed */}
            <Box
                sx={{
                    width: "16.66%", // 2/12 of the grid
                    position: "fixed",
                    height: "calc(100vh - 70px)",
                }}
            >
                <Leftbar />
            </Box>

            {/* Middle Section - Scrollable */}
            <Box
                sx={{
                    width: "51%", // 6/12 of the grid
                    marginLeft: "16.66%", // Offset by the width of the leftbar
                    paddingLeft: "20px",
                    overflowY: "auto", // Allow scrolling
                    height: "calc(100vh - 70px)",
                    scrollbarWidth: "none", // Hide scrollbar for Firefox
                    "&::-webkit-scrollbar": {
                        display: "none", // Hide scrollbar for Chrome, Safari, and Opera
                    },
                }}
            >
                <Stories />
                <Share/>
                <Posts allPosts={posts}/>
            </Box>

            {/* Rightbar - Fixed */}
            <Box
                sx={{
                    width: "28%", // 4/12 of the grid
                    position: "fixed",
                    right: 0,
                    height: "calc(100vh - 70px)",
                    paddingInline: "20px",
                }}
            >
                <Rightbar />
            </Box>
        </Box>
    );
}

export default Home;
