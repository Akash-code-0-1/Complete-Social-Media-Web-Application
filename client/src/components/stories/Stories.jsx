import React, { useContext, useState } from "react";
import "./Stories.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [activeIndex, setActiveIndex] = useState(null); // New state to handle active story

  // Fetch stories
  const { isLoading, error, data: stories = [] } = useQuery({
    queryKey: ["stories"],
    queryFn: () => makeRequest.get("/stories").then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: async (story) => {
      return makeRequest.post("/stories", story);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      const imgUrl = res.data;
      mutation.mutate({ img: imgUrl });
    } catch (err) {
      console.error("Error uploading story:", err);
    }
  };

  const handleStoryClick = (index) => {
    setActiveIndex(index);
  };

  const handleClose = () => {
    setActiveIndex(null);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : stories.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < stories.length - 1 ? prev + 1 : 0));
  };

  return (
    <>
      <div className="stories">
        <div className="story" key={currentUser.id}>
          <img
            src={
              currentUser?.profilePic
                ? "/upload/" + currentUser.profilePic
                : "/default-profile.png"
            }
            alt={currentUser.name || "User"}
          />
          <span style={{ color: "white" }}>{currentUser.name}</span>
          <button>
            <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
              +
            </label>
          </button>
          <input
            type="file"
            id="file-upload"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {isLoading ? (
          <p>Loading stories...</p>
        ) : error ? (
          <p>Error fetching stories!</p>
        ) : (
          stories.map((story, index) => (
            <div
              className="story"
              key={story.id}
              onClick={() => handleStoryClick(index)}
            >
              <img src={"/upload/" + story.img} alt={story.name} />
              <span style={{ color: "white" }}>{story.name}</span>
            </div>
          ))
        )}
      </div>

{activeIndex !== null && (
  <div className="story-overlay" onClick={handleClose}>
    <img
      src={"/upload/" + stories[activeIndex].img}
      alt={stories[activeIndex].name}
      className="story-full-image"
      onClick={(e) => e.stopPropagation()}
    />
    <div className="story-username">{stories[activeIndex].name}</div>
    <button
      className="nav-btn prev"
      onClick={(e) => {
        e.stopPropagation();
        handlePrev();
      }}
    >
      ‹
    </button>
    <button
      className="nav-btn next"
      onClick={(e) => {
        e.stopPropagation();
        handleNext();
      }}
    >
      ›
    </button>
    <button
      className="close-btn"
      onClick={(e) => {
        e.stopPropagation();
        handleClose();
      }}
    >
      ✕
    </button>
  </div>
)}

    </>
  );
};

export default Stories;



