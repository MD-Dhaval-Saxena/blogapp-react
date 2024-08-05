import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const GITHUB_API_URL = "https://api.github.com/repos/MD-Dhaval-Saxena/blogapp-react";
  const RAW_CONTENT_URL =
    "https://raw.githubusercontent.com/MD-Dhaval-Saxena/blogapp-react/main/";


    // https://raw.githubusercontent.com/MD-Dhaval-Saxena/blogapp-react/main/blogs/javascript.txt
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await axios.get(`${GITHUB_API_URL}/blogs`);
    const markdownFiles = response.data.filter((file) =>
      file.name.endsWith(".txt")
    );

    const postPromises = markdownFiles.map(async (file) => {
      const content = await axios.get(`${RAW_CONTENT_URL}${file.name}`);
      return { name: file.name, content: content.data };
    });

    const fetchedPosts = await Promise.all(postPromises);
    setPosts(fetchedPosts);
  };

  return (
    <div>
      <h1>My GitHub Blog</h1>
      {posts.map((post) => (
        <div key={post.name}>
          <h2>{post.name}</h2>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
}

export default App;
