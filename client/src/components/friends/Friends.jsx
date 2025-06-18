import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
import './Friends.scss';

function FriendsList() {
    const { currentUser } = useContext(AuthContext);

    const {
        isLoading,
        error,
        data,
    } = useQuery({
        queryKey: ['friends', currentUser.id],
        queryFn: () =>
            makeRequest.get('/friends/' + currentUser.id).then((res) => res.data),
        enabled: !!currentUser,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching friends</div>;

    return (
        <div className='friends-list'>
            <h2>Followers</h2>
            <ul className='friendsResults'>
                {data.followers.length > 0 ? (
                    data.followers.map((item, idx) => (
                        <li key={idx} className='searchResultItem'>
                            <Link
                                to={`/profile/${item.followerUserId}`}
                                style={{ textDecoration: "none", color: "inherit" }}>
                                <img
                                    src={item.profilePic ? "/upload/" + item.profilePic : "/default-profile.png"}
                                    alt=""
                                />
                                <span>User {item.followerUserId}</span>
                            </Link>
                        </li>
                    ))
                ) : (
                    <div>No followers</div>
                )}

            </ul>

            <h2>Following</h2>
            <ul className='friendsResults'>
                {data.following.length > 0 ? (
                    data.following.map((item, idx) => (
                        <li key={idx} className='searchResultItem'>
                            <Link to={`/profile/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                <img src={item.profilePic ? "/upload/" + item.profilePic : "/default-profile.png"} alt="" />
                                <span>{item.name}</span>
                            </Link>

                        </li>
                    ))
                ) : (
                    <div>Not following anyone</div>
                )}

            </ul>
        </div>
    );
}

export default FriendsList;
