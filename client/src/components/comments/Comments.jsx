import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Fetch comments
  const { isLoading, error, data } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => makeRequest.get(`/comments?postId=${postId}`).then((res) => res.data),
  });

  // Mutation for adding comments
  const mutation = useMutation({
    mutationFn: (newComment) => makeRequest.post("/comments", newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] }); // Invalidate and refetch
    },
  });

  const handleClick = (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc(""); // Clear input after submitting
  };

  // Render component
  return (
    <div className="comments">
      <div className="write">
      <img
          src={
            currentUser?.profilePic
              ? "/upload/" + currentUser.profilePic  // Use the profile picture if available
              : "/default-profile.png"  // Use default if no profile picture
            }
            alt={""}
      />
        <input
          type="text"
          placeholder="Write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>

      {isLoading && <div>Loading comments...</div>}
      {error && <div>Error: {error.message}</div>}
      {!isLoading &&
        !error &&
        data.map((comment) => (
          <div className="comment" key={comment.id}>
            {/* <img src={comment.profilePic} alt="" /> */}
            <img src={"/upload/" + comment.profilePic} alt="" />
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.desc}</p>
            </div>
            <span className="date">{moment(comment.createdAt).fromNow()}</span>
          </div>
        ))}
    </div>
  );
};

export default Comments;


// const Comments = () => {
//   const { currentUser } = useContext(AuthContext);
//   //Temporary
//   // const comments = [
//   //   {
//   //     id: 1,
//   //     desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam",
//   //     name: "John Doe",
//   //     userId: 1,
//   //     profilePicture:
//   //       "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//   //   },
//   //   {
//   //     id: 2,
//   //     desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam",
//   //     name: "Jane Doe",
//   //     userId: 2,
//   //     profilePicture:
//   //       "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
//   //   },
//   // ];

 


//   return (
//     <div className="comments">
//       <div className="write">
//         <img src={currentUser.profilePicture} alt="" />
//         <input type="text" placeholder="write a comment" />
//         <button>Send</button>
//       </div>
//       {comments.map((comment) => (
//         <div className="comment">
//           <img src={comment.profilePicture} alt="" />
//           <div className="info">
//             <span>{comment.name}</span>
//             <p>{comment.desc}</p>
//           </div>
//           <span className="date">1 hour ago</span>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Comments;
