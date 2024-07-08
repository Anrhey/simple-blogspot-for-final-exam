"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  IconButton,
  Paper,
  Typography,
  Grid,
  Avatar,
  Divider,
  CircularProgress,
  Tooltip,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CardActions,
  Button,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProfileCard from "../Profile/ProfileCard";
import CreatePost from "../CreatePost/createpost";
import { UploadButton } from "../../../utils/uploadthing";
import SearchPosts from "../SearchPost/SearchPost";
import { likePost, fetchPost } from "./actions";
import { createPost } from "../CreatePost/actions";
import Link from "next/link";

const Homepage = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPost(),
  });

  const [currentLikePostId, setCurrentLikePostId] = useState(null);

  const likeMutation = useMutation({
    mutationFn: async (postId) => {
      await likePost(postId, token);
    },
    onMutate: (postId) => {
      setCurrentLikePostId(postId);
    },
    onSettled: () => {
      setCurrentLikePostId(null);
      queryClient.invalidateQueries(["posts"]);
    },
  });

  // const likeMutation = useMutation({
  //   mutationFn: async (postId) => {
  //     await likePost(postId, token);
  //   },
  //   onMutate: async (postId) => {
  //     setCurrentLikePostId(postId);

  //     // Optimistically update the data
  //     await queryClient.cancelQueries(["posts"]);

  //     const previousData = queryClient.getQueryData(["posts"]);

  //     queryClient.setQueryData(["posts"], (old) => {
  //       return old.map((post) =>
  //         post.postId === postId
  //           ? {
  //               ...post,
  //               likes: post.likes.map((like) =>
  //                 like.userId === parseInt(token)
  //                   ? { ...like, isLiked: !like.isLiked }
  //                   : like
  //               ),
  //             }
  //           : post
  //       );
  //     });

  //     return { previousData };
  //   },
  //   onSettled: () => {
  //     setCurrentLikePostId(null);
  //     queryClient.invalidateQueries(["posts"]);
  //   },
  //   onError: (err, postId, context) => {
  //     queryClient.setQueryData(["posts"], context.previousData);
  //   },
  // });

  const handleLikeToggle = async (postId) => {
    await likeMutation.mutateAsync(postId);
  };

  const renderLikeButton = (post) => {
    const userLike = post.likes.find((like) => like.userId === parseInt(token));

    return (
      <IconButton
        onClick={() => handleLikeToggle(post.postId)}
        aria-label={userLike && userLike.isLiked ? "unlike" : "like"}
        color="primary"
        size="medium"
      >
        <Tooltip
          title={userLike && userLike.isLiked ? "Unlike" : "Like"}
          placement="top"
        >
          {currentLikePostId === post.postId ? (
            <CircularProgress size={24} />
          ) : userLike && userLike.isLiked ? (
            <ThumbDown />
          ) : (
            <ThumbUp />
          )}
          {post.likes.filter((like) => like.isLiked).length}
        </Tooltip>
      </IconButton>
    );
  };

  //create post
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const mutation = useMutation({
    mutationFn: () => createPost(formData, token),
    onSuccess: () => {
      queryClient.invalidateQueries("posts");
      queryClient.refetchQueries("posts");
      //setSuccessMessage(true);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
    // refetch();
  };

  const truncateContent = (content, maxLength) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <div>Error loading posts</div>;

  return (
    <>
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
              <SearchPosts />
            </Paper>

            {/* <CreatePost /> */}

            <Card sx={{ mb: 4, backgroundColor: "#2d3748", color: "white" }}>
              <CardHeader
                title="Create a Blog Post"
                titleTypographyProps={{ variant: "h6", color: "white" }}
              />
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Blog Title"
                    variant="outlined"
                    margin="normal"
                    name="title"
                    onChange={handleChange}
                    InputProps={{
                      style: { backgroundColor: "#4a5568", color: "white" },
                    }}
                    InputLabelProps={{
                      style: { color: "white" },
                    }}
                    // onFocus={handleTitleFocus}
                    // onBlur={handleTitleBlur}
                  />
                  <TextField
                    fullWidth
                    label="Write your post here..."
                    variant="outlined"
                    margin="normal"
                    name="content"
                    onChange={handleChange}
                    multiline
                    rows={4}
                    InputProps={{
                      style: { backgroundColor: "#4a5568", color: "white" },
                    }}
                    InputLabelProps={{
                      style: { color: "white" },
                    }}
                    // onFocus={handleTextareaFocus}
                    // onBlur={handleTextareaBlur}
                  />
                  <Box mt={2} display="flex" justifyContent="space-between">
                    <IconButton color="primary" component="label">
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          // Do something with the response
                          console.log("Files: ", res);
                          setFormData({ ...formData, imageUrl: res[0].url });
                        }}
                        onUploadError={(error) => {
                          // Do something with the error.
                          alert(`ERROR! ${error.message}`);
                        }}
                      />
                      {formData.imageUrl.length ? (
                        <img
                          src={formData.imageUrl}
                          alt="Uploaded"
                          style={{
                            maxHeight: "200px",
                            borderRadius: "8px",
                            marginTop: "10px",
                          }}
                        />
                      ) : null}
                    </IconButton>
                    <Button
                      disabled={mutation.isPending}
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Post
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
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
                Post created successfully!
              </Alert>
            </Snackbar>

            {/* Blog Posts */}
            <Box sx={{ mt: 4 }}>
              {mutation.isPending ? (
                <CircularProgress />
              ) : (
                data
                  ?.slice()
                  .reverse()
                  .map((post, index) => (
                    <Card key={index} sx={{ mb: 4 }}>
                      <Link href={`/ViewPost/${post.postId}`} passHref>
                        <CardHeader
                          avatar={<Avatar src={post.author.profileImage} />}
                          title={post.author.name}
                          subheader={new Date(
                            post.createdAt
                          ).toLocaleDateString()}
                        />
                        <CardContent>
                          <Typography variant="h5" component="div">
                            {truncateContent(post.title, 150)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {truncateContent(post.content, 250)}
                          </Typography>
                        </CardContent>
                      </Link>
                      {post.imageUrl && (
                        <CardMedia
                          component="img"
                          height="194"
                          image={post.imageUrl}
                          alt={post.title}
                          sx={{
                            padding: 1,
                          }}
                        />
                      )}

                      <CardActions disableSpacing>
                        {renderLikeButton(post)}
                        <Button size="small" color="primary">
                          {post.comments.length} Comments
                        </Button>
                      </CardActions>
                    </Card>
                  ))
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Homepage;

// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Container,
//   IconButton,
//   Paper,
//   Typography,
//   Grid,
//   Avatar,
//   Divider,
//   CircularProgress,
//   Tooltip,
//   Card,
//   CardContent,
//   CardHeader,
//   CardMedia,
//   CardActions,
//   Button,
// } from "@mui/material";
// import { ThumbUp, ThumbDown } from "@mui/icons-material";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import ProfileCard from "../Profile/ProfileCard";
// import CreatePost from "../CreatePost/createpost";
// import SearchPosts from "../SearchPost/SearchPost";
// import { likePost, fetchPost } from "./actions";
// import Link from "next/link";

// const Homepage = () => {
//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       setToken(localStorage.getItem("token"));
//     }
//   }, []);

//   const queryClient = useQueryClient();

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["posts"],
//     queryFn: async () => await fetchPost(),
//   });

//   const [currentLikePostId, setCurrentLikePostId] = useState(null);

//   const likeMutation = useMutation({
//     mutationFn: async (postId) => {
//       await likePost(postId, token);
//     },
//     onMutate: (postId) => {
//       setCurrentLikePostId(postId);
//     },
//     onSettled: () => {
//       setCurrentLikePostId(null);
//       queryClient.invalidateQueries(["posts"]);
//     },
//   });

//   const handleLikeToggle = async (postId) => {
//     await likeMutation.mutateAsync(postId);
//   };

//   const renderLikeButton = (post) => {
//     const userLike = post.likes.find((like) => like.userId === parseInt(token));

//     return (
//       <IconButton
//         onClick={() => handleLikeToggle(post.postId)}
//         aria-label={userLike && userLike.isLiked ? "unlike" : "like"}
//         color="primary"
//         size="medium"
//       >
//         <Tooltip
//           title={userLike && userLike.isLiked ? "Unlike" : "Like"}
//           placement="top"
//         >
//           {currentLikePostId === post.postId ? (
//             <CircularProgress size={24} />
//           ) : userLike && userLike.isLiked ? (
//             <ThumbDown />
//           ) : (
//             <ThumbUp />
//           )}
//           {post.likes.filter((like) => like.isLiked).length}
//         </Tooltip>
//       </IconButton>
//     );
//   };

//   if (isLoading) return <CircularProgress />;
//   if (isError) return <div>Error loading posts</div>;

//   return (
//     <>
//       <Container sx={{ mt: 4 }}>
//         <Grid container spacing={4}>
//           {/* Profile Section */}
//           <Grid item xs={12} md={4}>
//             <ProfileCard />
//           </Grid>

//           {/* Main Content Section */}
//           <Grid item xs={12} md={8}>
//             <Paper
//               component="form"
//               sx={{
//                 p: "2px 4px",
//                 display: "flex",
//                 alignItems: "center",
//                 mb: 4,
//               }}
//             >
//               <SearchPosts />
//             </Paper>

//             <CreatePost />

//             {/* Blog Posts */}
//             <Box sx={{ mt: 4 }}>
//               {data
//                 .slice()
//                 .reverse()
//                 .map((post, index) => (
//                   <Card key={index} sx={{ mb: 4 }}>
//                     <Link href={`/ViewPost/${post.postId}`} passHref>
//                       <CardHeader
//                         avatar={<Avatar src={post.author.profileImage} />}
//                         title={post.author.name}
//                         subheader={new Date(
//                           post.createdAt
//                         ).toLocaleDateString()}
//                       />
//                       <CardContent>
//                         <Typography variant="h5" component="div">
//                           {post.title}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           {post.content}
//                         </Typography>
//                       </CardContent>
//                     </Link>
//                     {post.imageUrl && (
//                       <CardMedia
//                         component="img"
//                         height="194"
//                         image={post.imageUrl}
//                         alt={post.title}
//                         sx={{
//                           padding: 1,
//                         }}
//                       />
//                     )}

//                     <CardActions disableSpacing>
//                       {renderLikeButton(post)}
//                       <Button size="small" color="primary">
//                         {post.comments.length} Comments
//                       </Button>
//                     </CardActions>
//                   </Card>
//                 ))}
//             </Box>
//           </Grid>
//         </Grid>
//       </Container>
//     </>
//   );
// };

// export default Homepage;

//BREAK HERE

// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Container,
//   IconButton,
//   Paper,
//   Typography,
//   Grid,
//   Avatar,
//   Divider,
//   CircularProgress,
//   Tooltip,
//   Card,
//   CardContent,
//   CardHeader,
//   CardMedia,
//   CardActions,
//   Button,
// } from "@mui/material";
// import { ThumbUp, ThumbDown } from "@mui/icons-material";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import ProfileCard from "../Profile/ProfileCard";
// import CreatePost from "../CreatePost/createpost";
// import SearchPosts from "../SearchPost/SearchPost";
// import { likePost, fetchPost } from "./actions";
// import Link from "next/link";

// const Homepage = () => {
//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       setToken(localStorage.getItem("token"));
//     }
//   }, []);

//   const queryClient = useQueryClient();

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["posts"],
//     queryFn: async () => await fetchPost(),
//   });

//   const likeMutation = useMutation({
//     mutationFn: async (postId) => {
//       await likePost(postId, token);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(["posts"]);
//     },
//   });

//   const handleLikeToggle = async (postId) => {
//     await likeMutation.mutateAsync(postId);
//   };

//   const renderLikeButton = (post) => {
//     const userLike = post.likes.find((like) => like.userId === parseInt(token));

//     return (
//       <IconButton
//         onClick={() => handleLikeToggle(post.postId)}
//         aria-label={userLike && userLike.isLiked ? "unlike" : "like"}
//         color="primary"
//         size="medium"
//       >
//         <Tooltip
//           title={userLike && userLike.isLiked ? "Unlike" : "Like"}
//           placement="top"
//         >
//           {userLike && userLike.isLiked ? <ThumbDown /> : <ThumbUp />}
//           {post.likes.filter((like) => like.isLiked).length}
//         </Tooltip>
//       </IconButton>
//     );
//   };

//   if (isLoading) return <CircularProgress />;
//   if (isError) return <div>Error loading posts</div>;

//   return (
//     <>
//       <Container sx={{ mt: 4 }}>
//         <Grid container spacing={4}>
//           {/* Profile Section */}
//           <Grid item xs={12} md={4}>
//             <ProfileCard />
//           </Grid>

//           {/* Main Content Section */}
//           <Grid item xs={12} md={8}>
//             <Paper
//               component="form"
//               sx={{
//                 p: "2px 4px",
//                 display: "flex",
//                 alignItems: "center",
//                 mb: 4,
//               }}
//             >
//               <SearchPosts />
//             </Paper>

//             <CreatePost />

//             {/* Blog Posts */}
//             <Box sx={{ mt: 4 }}>
//               {data
//                 .slice()
//                 .reverse()
//                 .map((post, index) => (
//                   <Card key={index} sx={{ mb: 4 }}>
//                     <Link href={`/ViewPost/${post.postId}`} passHref>
//                       <CardHeader
//                         avatar={<Avatar src={post.author.profileImage} />}
//                         title={post.author.name}
//                         subheader={new Date(
//                           post.createdAt
//                         ).toLocaleDateString()}
//                       />
//                       <CardContent>
//                         <Typography variant="h5" component="div">
//                           {post.title}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           {post.content}
//                         </Typography>
//                       </CardContent>
//                     </Link>
//                     {post.imageUrl && (
//                       <CardMedia
//                         component="img"
//                         height="194"
//                         image={post.imageUrl}
//                         alt={post.title}
//                         sx={{
//                           padding: 1,
//                         }}
//                       />
//                     )}

//                     <CardActions disableSpacing>
//                       {renderLikeButton(post)}
//                       <Button size="small" color="primary">
//                         {post.comments.length} Comments
//                       </Button>
//                     </CardActions>
//                   </Card>
//                 ))}
//             </Box>
//           </Grid>
//         </Grid>
//       </Container>
//     </>
//   );
// };

// export default Homepage;
