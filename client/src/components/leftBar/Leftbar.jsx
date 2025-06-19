import React, { useContext, useState } from 'react'
import './Leftbar.scss';

import Friends from '../../assets/inclusion.png';
import Events from '../../assets/events.png';
import Gamming from '../../assets/gamming.png';
import Gallary from '../../assets/picture.png';
import Message from '../../assets/chat.png';
import Tutorials from '../../assets/video-tutorials.png';
import Courses from '../../assets/courses.png';
import Fund from '../../assets/fundraising.png';
import Group from '../../assets/group.png';
import Memories from '../../assets/wall-clock.png';
import { AuthContext } from '../../context/authContext';
import { Link } from 'react-router-dom';

import FriendsList from '../friends/Friends';



const Leftbar = () => {

  const [showFriends, setShowFriends] = useState(false);

  const handleClick = () => {
    setShowFriends((prev) => !prev);
  };


  const { currentUser } = useContext(AuthContext);
  return (
    <div className='leftbar'>
      <div className="container">
        <div className="menus">
          <Link
            to={`/profile/${currentUser.id}`}
            key={currentUser.id}
            style={{ textDecoration: "none" }}>
            <div className="user">

              <img
                src={
                  currentUser?.profilePic
                    ? "/upload/" + currentUser.profilePic  // Use the profile picture if available
                    : "/default-profile.png"  // Use default if no profile picture
                }
                alt={""}
              />
              <span>{currentUser.name}</span>


            </div>
          </Link>

          {/* <div className="item">
            <img src={Friends} alt="" />
            <span>Friends</span>
          </div> */}


          <div className='item' onClick={handleClick}>
            <img src={Friends} alt='person' />
            <span>Your Connections</span>
          </div>

          {showFriends && <FriendsList />}


          <div className="item">
            <img src={Gallary} alt="gallary" />
            <span>Gallery</span>
          </div>

          <div className="item">
            <img src={Memories} alt="memories" />
            <span>Memories</span>
          </div>


          {/* <div className="item">
            <img src={Events} alt="" />
            <span>Events</span>
          </div> */}



          {/* <div className="item">
            <img src={Gamming} alt="" />
            <span>Gamming</span>
          </div> */}

        </div>

        <hr />
        <div className="menus">

          <span>Your Shortcuts</span>

          <div className="item">
            <img src={Message} alt="" />
            <span>Messages</span>
          </div>

          <div className="item">
            <img src={Tutorials} alt="" />
            <span>Tutorials</span>
          </div>


          <div className="item">
            <img src={Courses} alt="" />
            <span>Courses</span>
          </div>

          <div className="item">
            <img src={Group} alt="" />
            <span>Groups</span>
          </div>
        </div>
        <hr />
        <div className="menus">

          <span>Others</span>

          <div className="item">
            <img src={Fund} alt="" />
            <span>Fund</span>
          </div>

          <div className="item">
            <img src={Group} alt="" />
            <span>Groups</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leftbar;
