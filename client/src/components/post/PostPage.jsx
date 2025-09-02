import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Post from "../../components/post/Post";

const PostPage = () => {
  const { id } = useParams();

  const { isLoading, error, data } = useQuery({
    queryKey: ["post", id],
    queryFn: () => makeRequest.get(`/posts/${id}`).then((res) => res.data),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Post not found</div>;

  return <Post post={data} />;
};

export default PostPage;
