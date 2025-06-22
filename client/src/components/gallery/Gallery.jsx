import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import "./Gallery.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Gallery = ({ onClose }) => {
    const { currentUser } = useContext(AuthContext);
    const [selectedImg, setSelectedImg] = useState(null);

    const { isLoading, error, data: posts } = useQuery({
        queryKey: ["gallery", currentUser.id],
        queryFn: () =>
            makeRequest.get(`/posts?userId=${currentUser.id}`).then((res) => res.data),
    });

    const overlay = (
        <div className="gallery-overlay" onClick={onClose}>
            <div className="gallery-content" onClick={(e) => e.stopPropagation()}>
                <button className="back-btn" onClick={onClose}>
                    <ArrowBackIcon /> Back
                </button>
                <h2>Your Gallery</h2>

                {isLoading ? (
                    <p className="status-msg">Loading...</p>
                ) : error ? (
                    <p className="status-msg">Something went wrong!</p>
                ) : posts?.length === 0 ? (
                    <p className="status-msg">No images posted yet.</p>
                ) : (
                    <div className="gallery-grid">
                        {posts
                            .filter((post) => post.img)
                            .map((post, idx) => (
                                <img
                                    key={idx}
                                    src={`/upload/${post.img}`}
                                    alt={`gallery-${idx}`}
                                    onClick={() => setSelectedImg(`/upload/${post.img}`)}
                                />
                            ))}
                    </div>
                )}

                {selectedImg && (
                    <div className="image-preview" onClick={() => setSelectedImg(null)}>
                        <img src={selectedImg} alt="Full preview" />
                    </div>
                )}
            </div>
        </div>
    );

    return ReactDOM.createPortal(overlay, document.getElementById("overlay-root"));
};

export default Gallery;
