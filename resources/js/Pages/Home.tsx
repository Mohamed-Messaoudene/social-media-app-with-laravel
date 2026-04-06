import React from "react";
import { Box } from "@mui/material";
import Stories from "@/components/feed/stories/Stories";
import Share from "@/components/feed/Share";
import Posts from "@/components/feed/posts/Posts";
import Leftbar from "@/components/layout/Leftbar";
import { usePage } from "@inertiajs/react";
import { HomePageProps } from "@/types/home";
import Rightbar from "@/components/layout/RightBar/Rightbar";

const NAVBAR_HEIGHT = "67px";
const LEFT_WIDTH = "17%";
const RIGHT_WIDTH = "27%";

function Home() {
    const { posts } = usePage<HomePageProps>().props;

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: `calc(100vh - ${NAVBAR_HEIGHT})`,
                width: "100%",
            }}
        >
            {/* ── Leftbar ─────────────────────────────────────────── */}
            <Box
                sx={{
                    width: LEFT_WIDTH,
                    position: "fixed",
                    top: NAVBAR_HEIGHT,
                    left: 0,
                    height: `calc(100vh - ${NAVBAR_HEIGHT})`,
                    zIndex: 10,
                }}
            >
                <Leftbar />
            </Box>

            {/* ── Feed ────────────────────────────────────────────── */}
            <Box
                sx={{
                    width: `calc(100% - ${LEFT_WIDTH} - ${RIGHT_WIDTH})`,
                    marginLeft: LEFT_WIDTH,
                    marginRight: RIGHT_WIDTH,
                    px: { xs: 1.5, md: 3 },
                    py: 2,
                    overflowY: "auto",
                    height: `calc(100vh - ${NAVBAR_HEIGHT})`,
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                }}
            >
                <Stories />
                <Share />
                {posts && <Posts posts={posts} />}
            </Box>

            {/* ── Rightbar ────────────────────────────────────────── */}
            <Box
                sx={{
                    width: RIGHT_WIDTH,
                    position: "fixed",
                    top: NAVBAR_HEIGHT,
                    right: 0,
                    height: `calc(100vh - ${NAVBAR_HEIGHT})`,
                    overflowY: "auto",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                    zIndex: 10,
                }}
            >
                <Rightbar />
            </Box>
        </Box>
    );
}

export default Home;