// pages/Posts.js
import React from 'react';
import { Link } from 'react-router-dom';
import { slugify } from '../utils/slugify';

const Posts = () => {
  const posts = [
    { id: 1, title: 'Hello World!' },
    { id: 2, title: 'React is Awesome!' },
    { id: 3, title: 'Understanding Slugify' },
  ];

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/posts/${slugify(post.title)}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;
