import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import './Rightbar.scss';
// import { useQuery } from "@tanstack/react-query";
import moment from "moment";


const getActivityText = (type, content) => {
  switch (type) {
    case "posted":
      return `posted: \"${content}\"`;
    case "commented":
      return `commented: \"${content}\"`;
    case "liked":
      return `liked a post`;
    case "story":
      return `added a story`;
    default:
      return "did something";
  }
};


const Rightbar = () => {

  const { currentUser } = useContext(AuthContext);
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [visibleSuggestions, setVisibleSuggestions] = useState([]);
  const [justFollowed, setJustFollowed] = useState([]);


  const dismissedKey = `dismissed_suggestions_${currentUser.id}`;

  const loadSuggestions = async () => {
    try {
      const dismissedIds = JSON.parse(localStorage.getItem(dismissedKey)) || [];

      const res = await makeRequest.get(`/suggestedFriends/${currentUser.id}`);
      const filtered = res.data.filter(user => !dismissedIds.includes(user.id));

      setAllSuggestions(filtered);
      setVisibleSuggestions(filtered.slice(0, 3));
    } catch (err) {
      console.error("Error fetching suggestions", err);
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, []);

  const rotateSuggestion = (userId) => {
    setAllSuggestions(prevAll => {
      const remaining = prevAll.filter(user => user.id !== userId);

      setVisibleSuggestions(prevVisible => {
        const updated = prevVisible.filter(user => user.id !== userId);
        const next = remaining.find(
          user => !updated.some(u => u.id === user.id)
        );

        if (next) return [...updated, next].slice(0, 3);
        return updated;
      });

      return remaining;
    });
  };


  const handleFollow = async (userId) => {
    try {
      await makeRequest.post("/relationships", { userId });

      // Show 'Following' temporarily
      setJustFollowed(prev => [...prev, userId]);

      setTimeout(() => {
        rotateSuggestion(userId);
        setJustFollowed(prev => prev.filter(id => id !== userId));
      }, 3000); // 3 seconds
    } catch (err) {
      console.error("Error following user", err);
    }
  };



  const handleDismiss = (userId) => {
    const dismissedIds = JSON.parse(localStorage.getItem(dismissedKey)) || [];
    const updated = [...dismissedIds, userId];
    localStorage.setItem(dismissedKey, JSON.stringify(updated));

    rotateSuggestion(userId);
  };

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await makeRequest.get("/activities");
        setData(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, []);


  // const [activities, setActivities] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(false);

  // const getActivityText = (type, content) => {
  //   if (type === "posted") return `shared a post: "${content}"`;
  //   return "";
  // };

  // useEffect(() => {
  //   const fetchActivities = async () => {
  //     try {
  //       const res = await makeRequest.get("/activities");
  //       setActivities(res.data);
  //     } catch (err) {
  //       console.error("Activity fetch error", err);
  //       setError(true);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchActivities();
  // }, []);

  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await makeRequest.get("/onlineFriends");
        setFriends(res.data);
      } catch (err) {
        console.error("Error fetching online friends", err);
      }
    };
    fetchFriends();
  }, []);


  const getStatusText = (user) => {
    if (user.isOnline) return "Online now";
    if (user.lastSeen) {
      const time = moment(user.lastSeen);
      const now = moment();
      const diff = now.diff(time, 'minutes');

      if (diff < 1) return "Active just now";
      if (diff < 60) return `Active ${diff} min ago`;
      if (diff < 1440) return `Active ${Math.floor(diff / 60)} hrs ago`;
      return `Active ${time.format("MMMM D [at] h:mm A")}`;
    }
    return "Last seen unknown";
  };



  return (
    <div className='rightbar'>
      <div className="container">
        <div className="item">
          <span>Suggestions for You</span>
          {visibleSuggestions.map(user => (
            <div className="user" key={user.id}>
              <div className="user_info">
                <img src={user.profilePic ? "/upload/" + user.profilePic : "/default-profile.png"} alt={user.name} />
                <span>{user.name}</span>
              </div>
              <div className="buttons">
                {justFollowed.includes(user.id) ? (
                  <button disabled>Following</button>
                ) : (
                  <button onClick={() => handleFollow(user.id)}>Follow</button>
                )}
                <button onClick={() => handleDismiss(user.id)}>Dismiss</button>
              </div>
            </div>
          ))}

        </div>


        <div className="item">
          <span>Latest Activities</span>
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error loading</p>
          ) : (
            data.slice(0, 5).map((a, i) => (
              <div className="user" key={i}>
                <div className="user_info">
                  <img
                    src={a.profilePic ? `/upload/${a.profilePic}` : "/default-profile.png"}
                    alt="profile"
                  />
                  <p>
                    <span>{a.name}</span> {getActivityText(a.type, a.content)}
                  </p>
                </div>
                <span>{moment(a.createdAt).fromNow()}</span>
              </div>
            ))
          )}
        </div>

        {/* <div className="item">
          <span>Latest Activities</span>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error loading activities</p>
          ) : (
            activities.map((a, i) => (
              <div className="user" key={i}>
                <div className="user_info">
                  <img
                    src={a.profilePic ? `/upload/${a.profilePic}` : "/default-profile.png"}
                    alt=""
                  />
                  <p>
                    <span>{a.name}</span> {getActivityText(a.type, a.content)}
                  </p>
                </div>
                <span>{moment(a.createdAt).fromNow()}</span>
              </div>
            ))
          )}
        </div> */}

        {/* <div className="item">
          <span>Latest Activities</span>
          <div className="user">
            <div className="user_info">
              <img src="https://images.pexels.com/photos/36029/aroni-arsa-children-little.jpg?auto=compress&cs=tinysrgb&w=600" alt="" />
              <p><span>Tayeba</span> changed her cover photo</p>

            </div>
            <span>1 min ago</span>
          </div>
          <div className="user">
            <div className="user_info">
              <img src="https://images.pexels.com/photos/1416736/pexels-photo-1416736.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
              <p><span>Taohid</span> posted a photo</p>

            </div>
            <span>2 min ago</span>
          </div>
          <div className="user">
            <div className="user_info">
              <img src="https://images.pexels.com/photos/26509773/pexels-photo-26509773/free-photo-of-little-girl-in-a-box.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
              <p><span>Akash</span> feeling sad today</p>

            </div>
            <span>10 min ago</span>
          </div>
          <div className="user">
            <div className="user_info">
              <img src="https://images.pexels.com/photos/974266/pexels-photo-974266.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
              <p><span>Shoriful</span> shared his story</p>

            </div>
            <span>30 min ago</span>
          </div>


        </div> */}


        <div className="item">
          <span>Online Friends</span>
          {friends.map(friend => (
            <div className="user" key={friend.id}>
              <div className="user_info">
                <img
                  src={friend.profilePic ? "/upload/" + friend.profilePic : "/default-profile.png"}
                  alt=""
                />
                <div className={friend.isOnline ? "online-dot" : "offline-dot"} />
                <div className="info-text">
                  <span>{friend.name}</span>
                  <div className="status-text">{getStatusText(friend)}</div>
                </div>
              </div>
            </div>

          ))}

        </div>



      </div>
    </div>
  )
}

export default Rightbar;
