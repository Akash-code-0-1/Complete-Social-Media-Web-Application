import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
import './Friends.scss';

function FriendsList() {
    const { currentUser } = useContext(AuthContext);
    const [showFullView, setShowFullView] = useState(true);

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

    if (!showFullView) return null;

    if (isLoading) return (
        <div className='friends-overlay'>
            <div className="friends-content">
                <button onClick={() => setShowFullView(false)} className="back-btn">← Back</button>
                <p>Loading...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className='friends-overlay'>
            <div className="friends-content">
                <button onClick={() => setShowFullView(false)} className="back-btn">← Back</button>
                <p>Error fetching friends</p>
            </div>
        </div>
    );

    return (
        <div className='friends-overlay'>
            <div className="friends-content">
                <button onClick={() => setShowFullView(false)} className="back-btn">←</button>

                <h2>Followers</h2>
                <ul className='friendsResults'>
                    {data.followers.length > 0 ? (
                        data.followers.map((item, idx) => (
                            <li key={idx} className='searchResultItem'>
                                <Link to={`/profile/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                    <img src={item.profilePic ? "/upload/" + item.profilePic : "/default-profile.png"} alt="" />
                                    <span>{item.name}</span>
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
        </div>
    );
}

export default FriendsList;
