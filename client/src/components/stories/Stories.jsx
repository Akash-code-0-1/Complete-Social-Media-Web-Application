import React, { useContext} from "react";
import "./Stories.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Fetch existing stories
  const { isLoading, error, data: stories } = useQuery({
    queryKey: ["stories"],
    queryFn: () => makeRequest.get("/stories").then((res) => res.data),
  });

  // Mutation to upload story
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
      // Upload the file
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      const imgUrl = res.data;

      // Automatically create the story
      mutation.mutate({ img: imgUrl });
    } catch (err) {
      console.error("Error uploading story:", err);
    }
  };

  return (
    <div className="stories">
      {/* Add Story Section */}
      {/* <div class="story-wrapper"> */}
      <div className="story" key={currentUser.id}>
        <img
          src={
            currentUser?.profilePic
              ? "/upload/" + currentUser.profilePic
              : "/default-profile.png"
          }
          alt={currentUser.name || "User"}
        />
        <span style={{color:"white"}}>{currentUser.name}</span>
        <button>
          <label htmlFor="file-upload" style={{ cursor: "pointer" }}>+</label>
        </button>
        <input
          type="file"
          id="file-upload"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
        {/* </div> */}

      {/* Display Stories */}
      {isLoading ? (
        <p>Loading stories...</p>
      ) : error ? (
        <p>Error fetching stories!</p>
      ) : (
        stories.map((story) => (
          <div className="story" key={story.id}>
            <img src={"/upload/" + story.img} alt={story.name} />
            <span style={{color:"white"}}>{story.name}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default Stories;








// import React from 'react'
// import './Stories.scss';
// import { useContext } from "react";
// import { AuthContext } from '../../context/authContext';


// const Stories = () => {

//     const { currentUser } = useContext(AuthContext);
    

//     const stories = [
//         {
//             id: 1,
//             name: "Tayeba",
//             img: "https://images.pexels.com/photos/14912146/pexels-photo-14912146.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
//         },
//         {
//             id: 2,
//             name: "Akash",
//             img: "https://images.pexels.com/photos/26509773/pexels-photo-26509773/free-photo-of-little-girl-in-a-box.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
//         },
//         {
//             id: 3,
//             name: "Siam",
//             img: "https://images.pexels.com/photos/29482576/pexels-photo-29482576/free-photo-of-vibrant-rainbow-lorikeets-perched-on-tree-branch.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
//         },
//         {
//             id: 4,
//             name: "Taohid",
//             img: "https://images.pexels.com/photos/29298251/pexels-photo-29298251/free-photo-of-elderly-woman-in-h-i-an-with-vibrant-lanterns.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
//         },
//     ]

//     return (
//         <div className='stories'>
//             <div className="story" key={currentUser.id}>
//             <img
//               src={
//                 currentUser?.profilePic
//                   ? "/upload/" + currentUser.profilePic  // Use the profile picture if available
//                   : "/default-profile.png"  // Use default if no profile picture
//               }
//               alt={currentUser?.name || "User"}
//             />
//                 <span>{currentUser.name}</span>
//                 <button>+</button>
//             </div>

//             {
//                 stories.map((story) => (
//                     <div className="story" key={story.id}>
//                         <img src={story.img} alt="" />
//                         <span>{story.name}</span>
//                     </div>
//                 ))
//             }
//         </div>
//     )
// }  

// export default Stories;
