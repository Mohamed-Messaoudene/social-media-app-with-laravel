import React, { useState } from "react";
import { Send } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Avatar,
  Box,
  InputBase,
  Typography,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
} from "@mui/material";
import UserAvatar from "../UserAvatar";
import { grey } from "@mui/material/colors";
import PropTypes from "prop-types";
import { useSnackBar } from "../../context/SnackBarContext";
import { useAuth } from "../../context/AuthContext";
import { Inertia } from "@inertiajs/inertia";
import { Link } from "@inertiajs/inertia-react";

function Comments({ postId, postComments }) {
  const theme = useTheme();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSnackBarParams } = useSnackBar();

  console.log(postComments);

  const handleCommentPost = async () => {
    setLoading(true); // Start loading

    try {
      // Send a POST request to the backend using Inertia
      await Inertia.post(`/posts/${postId}/comments`, {
        comment_text: newComment,
      });

      // Reset the input field and stop loading
      setNewComment("");
      setSnackBarParams({
        open: true,
        message: "Comment posted successfully!",
        severity: "success",
      });
    } catch (error) {
      // Handle errors
      setSnackBarParams({
        open: true,
        message: "Failed to post comment. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const navigateProfilePage = (userId) => {
    console.log("Navigating to profile page:", userId); // Debug log
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginBlock="15px"
      >
        <Avatar
          src={user.profileImagePath}
          alt="Story Image"
          sx={{
            width: 30,
            height: 30,
          }}
        />
        <InputBase
          sx={{
            width: "80%",
            marginBlock: 1,
            pl: 1,
            border: "1px solid",
            borderColor: grey[300],
            color: theme.palette.primary.text,
            fontSize: "12px",
          }}
          value={newComment}
          onChange={(e) => {
            setNewComment(e.target.value);
          }}
          placeholder="Write a comment ..."
          inputProps={{ "aria-label": "write a comment" }}
        />
        <LoadingButton
          size="small"
          onClick={handleCommentPost}
          endIcon={<Send />}
          loading={loading}
          loadingPosition="end"
          variant="contained"
          sx={{ padding: "2px 3px", textTransform: "none", color: "white" }}
        >
          Send
        </LoadingButton>
      </Box>

      {postComments.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={3}
          my={2}
          border="1px dashed"
          borderColor={grey[300]}
          borderRadius="8px"
          sx={{
            backgroundColor: theme.palette.background.bgcolor,
          }}
        >
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              mb: 1,
              width: 40,
              height: 40,
            }}
          >
            <Send sx={{ color: "white", fontSize: 20 }} />
          </Avatar>
          <Typography
            variant="subtitle1"
            color="textPrimary"
            fontWeight="bold"
            textAlign="center"
          >
            No comments yet
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            textAlign="center"
            mt={0.5}
          >
            Be the first to share your thoughts!
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableBody>
              {postComments.map((comment, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Link href={`/profile/${comment.user.id}`} style={{textDecoration:"none"}}>
                      <UserAvatar
                        imgUrl={comment.user.profileImagePath}
                        username={comment.user.username}
                        extraInfo={comment.comment_text} // Use `comment_text` instead of `content`
                      />
                      </Link>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.primary.text,
                          paddingRight: "6px",
                          fontSize: "12px",
                        }}
                      >
                        {comment.time_passed}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}

// Props validation using PropTypes
Comments.propTypes = {
  postId: PropTypes.number.isRequired, // Validate postId
  postComments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      post_id: PropTypes.number.isRequired,
      user_id: PropTypes.number.isRequired,
      comment_text: PropTypes.string.isRequired, // Corrected prop name
      created_at: PropTypes.string.isRequired,
      time_passed: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        username: PropTypes.string.isRequired,
        profileImagePath: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

export default Comments;