"use client";

import React from "react";
import { IoIosLogOut, IoIosHome, IoIosSettings } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import styles from "./styles.module.css";

const Homepage = () => {
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
          <div className={styles.createPostSection}>
            <h2 className={styles.createPostTitle}>Create a Blog Post</h2>
            <input
              className={styles.textarea}
              placeholder="Write your post here..."
            ></input>
            <button className={styles.postButton}>Post</button>
          </div>

          {/* Blog Posts */}
          <div className={styles.blogPosts}>
            {[1, 2, 3, 4, 5].map((post, index) => (
              <div key={index} className={styles.blogPost}>
                <div className={styles.blogPostContent}>
                  Some Created post here. By user or other users
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
