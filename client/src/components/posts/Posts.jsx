import React from 'react';
import Post from "../post/Post";
import './Posts.scss';
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from '../../axios';

const Posts = ({userId}) => {

    const { isLoading, error, data } = useQuery({
        queryKey: ['posts'],
        queryFn: () =>
            makeRequest.get("/posts?userId="+userId).then((res) => res.data),
    });

    console.log(data);


    if (isLoading) {
        return <div className="posts">Loading...</div>;
    }

    if (error) {
        return <div className="posts">Error: {error.message}</div>;
    }

    // const posts = [
    //     {
    //         id: 1,
    //         name: "Tayeba",
    //         userI: 1,
    //         profilePicture: "https://images.pexels.com/photos/26509773/pexels-photo-26509773/free-photo-of-little-girl-in-a-box.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",

    //         desc: "lorem this is a dummy text this is not correct here",

    //         img: "https://images.pexels.com/photos/26509773/pexels-photo-26509773/free-photo-of-little-girl-in-a-box.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    //     },
    //     {
    //         id: 2,
    //         name: "Tayeba",
    //         userI: 2,
    //         profilePicture: "https://images.pexels.com/photos/26509773/pexels-photo-26509773/free-photo-of-little-girl-in-a-box.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",

    //         desc: "lorem this is a dummy text this is not correct here",
    //     },
    // ];
    return (
        <div className='posts'>
            {data.length > 0 ? (
                data.map((post) =>

                    <Post post={post} key={post.id}

                    />)
            ) : (
                <div>No posts available</div>
            )}
        </div>
    )
}

export default Posts;
