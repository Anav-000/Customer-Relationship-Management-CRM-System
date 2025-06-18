// pages/PostDetail.js
import React from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get dynamic params

const PostDetail = () => {
  const { slug } = useParams(); // Get slug from the URL

  return (
    <div>
      <h1>Post: {slug}</h1>
      {/* Fetch and display post content based on the slug */}
    </div>
  );
};

export default PostDetail;
