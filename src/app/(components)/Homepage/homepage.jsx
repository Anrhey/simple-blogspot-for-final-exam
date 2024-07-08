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
} from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProfileCard from "../Profile/ProfileCard";
import CreatePost from "../CreatePost/createpost";
import SearchPosts from "../SearchPost/SearchPost";
import { likePost, fetchPost } from "./actions";
import Link from "next/link";

const Homepage = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    staleTime: 0,
    queryFn: async () => await fetchPost(),
  });

  const [currentLikePostId, setCurrentLikePostId] = useState(null);

  const likeMutation = useMutation({
    mutationFn: async (postId) => {
      await likePost(postId, token);
    },
    onMutate: async (postId) => {
      setCurrentLikePostId(postId);

      // Optimistically update the data
      await queryClient.cancelQueries(["posts"]);

      const previousData = queryClient.getQueryData(["posts"]);

      queryClient.setQueryData(["posts"], (old) => {
        return old.map((post) =>
          post.postId === postId
            ? {
                ...post,
                likes: post.likes.map((like) =>
                  like.userId === parseInt(token)
                    ? { ...like, isLiked: !like.isLiked }
                    : like
                ),
              }
            : post
        );
      });

      return { previousData };
    },
    onSettled: () => {
      setCurrentLikePostId(null);
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (err, postId, context) => {
      queryClient.setQueryData(["posts"], context.previousData);
    },
  });

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

            <CreatePost />

            {/* Blog Posts */}
            <Box sx={{ mt: 4 }}>
              {data
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
                          {post.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {post.content}
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
                ))}
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
