"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  IconButton,
  InputBase,
  Paper,
  Typography,
  Grid,
  Divider,
  CircularProgress,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProfileCard from "../Profile/ProfileCard";
import { fetchUser } from "./actions";
import { deletePost } from "../EditPost/actions";
import Link from "next/link";

const ProfileFeed = () => {
  const queryClient = useQueryClient();
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);

  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUser(token),
  });

  const mutation = useMutation({
    mutationFn: (id) => deletePost(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      setDeletingPostId(null); // Reset the deleting post ID
      setSuccessMessage(true); // Show success message
    },
    onError: () => {
      setDeletingPostId(null); // Reset the deleting post ID in case of error
    },
  });

  const handleDelete = (postId) => {
    setDeletingPostId(postId);
    mutation.mutate(postId);
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography>Error loading posts</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Section */}
        <Grid item xs={12} md={4}>
          <ProfileCard />
        </Grid>

        {/* Main Content Section */}
        <Grid item xs={12} md={8}>
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              mb: 4,
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search for post..."
            />
          </Paper>

          {/* Blog Posts */}
          <Box sx={{ mt: 4 }}>
            {data?.userData?.posts
              ?.slice()
              .reverse()
              .map((post, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2, position: "relative" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6">{post.title}</Typography>
                    <Box>
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          href={`/edit-post/${post.postId}`}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="secondary"
                          onClick={() => handleDelete(post.postId)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography variant="body1">{post.content}</Typography>
                  {post.imageUrl.length ? (
                    <Box sx={{ mt: 2 }}>
                      <img
                        src={post.imageUrl}
                        alt="image"
                        style={{ maxWidth: "100%", borderRadius: 4 }}
                      />
                    </Box>
                  ) : null}
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body2">
                      {post.likes.length} Likes
                    </Typography>
                    <Typography variant="body2">
                      {post.comments.length} Comments
                    </Typography>
                  </Box>
                  {deletingPostId === post.postId && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  )}
                </Paper>
              ))}
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        open={successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(false)}
      >
        <Alert
          onClose={() => setSuccessMessage(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Post deleted successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfileFeed;

// "use client";

// import React, { useState } from "react";
// import {
//   Box,
//   Container,
//   IconButton,
//   InputBase,
//   Paper,
//   Typography,
//   Grid,
//   Divider,
//   CircularProgress,
//   Tooltip,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import ProfileCard from "../Profile/ProfileCard";
// import { fetchUser } from "./actions";
// import { deletePost } from "../EditPost/actions";
// import Link from "next/link";

// const ProfileFeed = () => {
//   const queryClient = useQueryClient();
//   const [deletingPostId, setDeletingPostId] = useState(null);

//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["user"],
//     queryFn: () => fetchUser(token),
//   });

//   const mutation = useMutation({
//     mutationFn: (id) => deletePost(token, id),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["user"]);
//       setDeletingPostId(null); // Reset the deleting post ID
//     },
//     onError: () => {
//       setDeletingPostId(null); // Reset the deleting post ID in case of error
//     },
//   });

//   const handleDelete = (postId) => {
//     setDeletingPostId(postId);
//     mutation.mutate(postId);
//   };

//   if (isLoading) return <CircularProgress />;
//   if (isError) return <Typography>Error loading posts</Typography>;

//   return (
//     <Container sx={{ mt: 4 }}>
//       <Grid container spacing={4}>
//         {/* Profile Section */}
//         <Grid item xs={12} md={4}>
//           <ProfileCard />
//         </Grid>

//         {/* Main Content Section */}
//         <Grid item xs={12} md={8}>
//           <Paper
//             component="form"
//             sx={{
//               p: "2px 4px",
//               display: "flex",
//               alignItems: "center",
//               mb: 4,
//             }}
//           >
//             <InputBase
//               sx={{ ml: 1, flex: 1 }}
//               placeholder="Search for post..."
//             />
//           </Paper>

//           {/* Blog Posts */}
//           <Box sx={{ mt: 4 }}>
//             {data?.userData?.posts
//               .slice()
//               .reverse()
//               .map((post, index) => (
//                 <Paper key={index} sx={{ p: 2, mb: 2, position: "relative" }}>
//                   <Link href={`/edit-post/${post.postId}`}>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                       }}
//                     >
//                       <Typography variant="h6">{post.title}</Typography>
//                       <Box>
//                         <Tooltip title="Edit">
//                           <IconButton
//                             color="primary"
//                             href={`/edit-post/${post.postId}`}
//                             onClick={() => console.log(post.postId)}
//                           >
//                             <EditIcon />
//                           </IconButton>
//                         </Tooltip>
//                         <Tooltip title="Delete">
//                           <IconButton
//                             color="secondary"
//                             onClick={() => handleDelete(post.postId)}
//                           >
//                             <DeleteIcon />
//                           </IconButton>
//                         </Tooltip>
//                       </Box>
//                     </Box>
//                     <Typography variant="body1">{post.content}</Typography>
//                     {post.imageUrl.length ? (
//                       <Box sx={{ mt: 2 }}>
//                         <img
//                           src={post.imageUrl}
//                           alt="image"
//                           style={{ maxWidth: "100%", borderRadius: 4 }}
//                         />
//                       </Box>
//                     ) : null}
//                   </Link>
//                   <Divider sx={{ my: 2 }} />
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <Typography variant="body2">
//                       {post.likes.length} Likes
//                     </Typography>
//                     <Typography variant="body2">
//                       {post.comments.length} Comments
//                     </Typography>
//                   </Box>
//                   {deletingPostId === post.postId && (
//                     <Box
//                       sx={{
//                         position: "absolute",
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         bottom: 0,
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         backgroundColor: "rgba(255, 255, 255, 0.8)",
//                       }}
//                     >
//                       <CircularProgress />
//                     </Box>
//                   )}
//                 </Paper>
//               ))}
//           </Box>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default ProfileFeed;
