import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import './Rightbar.scss';


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


        </div>

        <div className="item">
          <span>Online Friends</span>
          <div className="user">
            <div className="user_info">
              <img src="https://images.pexels.com/photos/974266/pexels-photo-974266.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
              <div className="online" />
              <span>Shoriful</span>
            </div>
          </div>
          <div className="user">
            <div className="user_info">
              <img src="https://images.pexels.com/photos/246805/pexels-photo-246805.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
              <div className="online" />
              <span>Tuhin Rana</span>
            </div>
          </div>
          <div className="user">
            <div className="user_info">
              <img src="https://images.pexels.com/photos/1619801/pexels-photo-1619801.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
              <div className="online" />
              <span>WK Siam</span>
            </div>
          </div>
          <div className="user">
            <div className="user_info">
              <img src="https://images.pexels.com/photos/977796/pexels-photo-977796.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
              <div className="online" />
              <span>taohid</span>
            </div>
          </div>
          <div className="user">
            <div className="user_info">
              <img src="https://images.pexels.com/photos/1205033/pexels-photo-1205033.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
              <div className="online" />
              <span>Muzahidul Islam</span>
            </div>
          </div>
          <div className="user">
            <div className="user_info">
              <img src="https://images.pexels.com/photos/27658802/pexels-photo-27658802/free-photo-of-a-woman-in-a-white-shirt-and-jeans-standing-in-front-of-a-street.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
              <div className="online" />
              <span>Sumiya Rahman</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Rightbar;
