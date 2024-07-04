"use client";

import React, { useEffect, useState } from "react";
import { IoIosLogOut, IoIosHome, IoIosSettings } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import styles from "./styles.module.css";
import CreatePost from "../CreatePost/createpost";
import { useQuery } from "@tanstack/react-query";

const Homepage = () => {
  const token = localStorage.getItem("token");
  const [posts, setPosts] = useState([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["post"],
    queryFn: async () => {
      const res = await fetch("/api/post/fetch-posts", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await res.json();
      setPosts(data);
      return data;
    },
  });

  if (isLoading) <>Loading...</>;
  return (
    <>
      <nav className={styles.navbar}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <a
              href="#"
              className={styles.navLink}
              onClick={() => console.log("home")}
            >
              <IoIosHome size={40} />
            </a>
          </li>
          <li className={styles.navItem}>
            <a
              href="#"
              className={styles.navLink}
              onClick={() => console.log("profile")}
            >
              <FaUserAlt size={40} />
            </a>
          </li>
          <li className={styles.navItem}>
            <a
              href="#"
              className={styles.navLink}
              onClick={() => console.log("settings")}
            >
              <IoIosSettings size={40} />
            </a>
          </li>
          <li className={styles.navItem}>
            <a
              href="#"
              className={styles.navLink}
              onClick={() => console.log("logout")}
            >
              <IoIosLogOut size={40} />
            </a>
          </li>
        </ul>
      </nav>

      <div className={styles.container}>
        {/* Profile Section */}
        <div className={styles.profileSection}>
          <div className={styles.profileContent}>
            <img className={styles.profilePicture} alt={"userimage"} />
            <h2 className={styles.profileUsername}>Username here</h2>
          </div>
        </div>

        {/* Main Content Section */}
        <div className={styles.mainContent}>
          <div className={styles.searchSection}>
            <input
              type="text"
              placeholder="Search for post..."
              className={styles.searchBar}
            />
          </div>
          <CreatePost />
          {/* <div className={styles.createPostSection}>
            <h2 className={styles.createPostTitle}>Create a Blog Post</h2>
            <input
              className={styles.textarea}
              placeholder="Write your post here..."
            ></input>
            <button className={styles.postButton}>Post</button>
          </div> */}

          {/* Blog Posts */}
          <div className={styles.blogPosts}>
            {posts
              .slice()
              .reverse()
              .map((post, index) => (
                <div key={index} className={styles.blogPost}>
                  <div className={styles.blogPostContent}>
                    {post.title}
                    {post.content}
                    {post.imageUrl.length ? (
                      <div>
                        <img src={post.imageUrl} alt="image" />
                      </div>
                    ) : null}
                  </div>
                  <div className={styles.blogPostFooter}>
                    <div>Likes here</div>
                    <div>Comments here</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
