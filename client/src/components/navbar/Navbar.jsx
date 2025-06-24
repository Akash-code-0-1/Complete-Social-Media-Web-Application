import React, { useState, useContext, useEffect, useRef } from 'react';
import './Navbar.scss';
import { Link } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { DarkModeContext } from '../../context/darkModeContext';
import { AuthContext } from '../../context/authContext';
import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../../axios'; // Assuming a pre-configured axios instance
import moment from "moment";








const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);

  const [searchQuery, setSearchQuery] = useState('');

  // Fetch search results using React Query
  const { isLoading, error, data: searchResults } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () =>
      searchQuery.trim()
        ? makeRequest.get('/users', { params: { search: searchQuery } }).then((res) => res.data)
        : Promise.resolve([]), // Avoid unnecessary API calls for empty query
    enabled: !!searchQuery.trim(), // Fetch only if query exists
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await makeRequest.get("/notifications");
        setNotifications(res.data);
        setUnreadCount(res.data.length);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchNotifications();
  }, []);


  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);




  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span>Junno</span>
        </Link>
        {/* <HomeOutlinedIcon /> */}
        {darkMode ? (
          <LightModeOutlinedIcon onClick={toggle} style={{ cursor: "pointer" }} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} style={{ cursor: "pointer" }} />
        )}
        {/* <GridViewOutlinedIcon /> */}
        <div className="search" ref={searchRef}>
          <SearchOutlinedIcon />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
          />
          {searchQuery && showSearchResults && (
            <div className="searchResults">
              {isLoading ? (
                <div>Loading...</div>
              ) : error ? (
                <div>Error fetching results</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <Link
                    to={`/profile/${user.id}`}
                    key={user.id}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearchResults(false); // Hide on click
                    }}
                  >
                    <div className="searchResultItem">
                      <img
                        src={
                          user.profilePic
                            ? '/upload/' + user.profilePic
                            : '/user-icon-1024x1024-dtzturco.png'
                        }
                        alt=""
                      />
                      <span>{user.name}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div>No users found</div>
              )}
            </div>
          )}
        </div>

      </div>
      <div className="right">
        {/* <PersonOutlineOutlinedIcon /> */}
        <MailOutlinedIcon />

        {/* notification section */}
        {/* <NotificationsOutlinedIcon /> */}

        <div className="notif-icon" onClick={() => setOpen(!open)}>
          <NotificationsOutlinedIcon />
          {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
        </div>
        {open && (
          <div className="notif-dropdown">
            {notifications.length === 0 ? (
              <p>No new notifications</p>
            ) : (
              notifications.map((n, i) => (
                <div className="notif-item" key={i}>
                  <img
                    src={n.fromPic ? "/upload/" + n.fromPic : "/default-profile.png"}
                    alt=""
                    className="profile-pic"
                  />
                  <div className="notif-content">
                    <span className="bold">{n.fromName}</span>{" "}
                    {n.type === "liked" && "liked your post"}
                    {n.type === "commented" && `commented on your post`}
                    <br />
                    <small>{moment(n.createdAt).fromNow()}</small>
                  </div>
                  {n.postImg && (
                    <img src={`/upload/${n.postImg}`} alt="post" className="thumb" />
                  )}
                </div>
              ))
            )}
          </div>
        )}


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
      </div>
    </div>
  );
};

export default Navbar;









// import React, { useContext } from 'react';
// import './Navbar.scss';
// import { Link } from 'react-router-dom';
// import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
// import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
// import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
// import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
// import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
// import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
// import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
// import { DarkModeContext } from '../../context/darkModeContext';
// import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
// import { AuthContext } from '../../context/authContext';

// const Navbar = () => {
//   const { toggle, darkMode } = useContext(DarkModeContext);
//   const { currentUser } = useContext(AuthContext);

//   return (
//     <div className="navbar">
//       <div className="left">
//         <Link to="/" style={{ textDecoration: "none" }}>
//           <span>Junno</span>
//         </Link>
//         <HomeOutlinedIcon />
//         {darkMode ? (
//           <LightModeOutlinedIcon onClick={toggle} />
//         ) : (
//           <DarkModeOutlinedIcon onClick={toggle} />
//         )}
//         <GridViewOutlinedIcon />
//         <div className="search">
//           <SearchOutlinedIcon />
//           <input type="text" placeholder="Search here..." />
//         </div>
//       </div>
//       <div className="right">
//         <PersonOutlineOutlinedIcon />
//         <MailOutlinedIcon />
//         <NotificationsOutlinedIcon />

//         <div className="user">
//           <img
//             src={
//               currentUser?.profilePic
//                 ? "/upload/" + currentUser.profilePic  // Use the profile picture if available
//                 : "/default-profile.png"  // Use default if no profile picture
//             }
//             alt={""}
//           />
//           <span>{currentUser?.name || "Guest"}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;






// // import React, { useContext } from 'react'
// // import './Navbar.scss';
// // import { Link } from 'react-router-dom';
// // import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
// // import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
// // import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
// // import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
// // import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
// // import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
// // import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
// // import { DarkModeContext } from '../../context/darkModeContext';
// // import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
// // import { AuthContext } from '../../context/authContext';


// // const Navbar = () => {

// //   const { toggle, darkMode } = useContext(DarkModeContext);
// //   const { currentUser } = useContext(AuthContext);

// //   console.log(currentUser);


// //   return (
// //     <div className='navbar'>
// //       <div className="left">
// //         <Link to="/" style={{ textDecoration: "none" }}>
// //           <span>Junno</span>


// //         </Link>
// //         <HomeOutlinedIcon />
// //         {
// //           darkMode ? (<LightModeOutlinedIcon onClick={toggle} />) : (<DarkModeOutlinedIcon onClick={toggle} />)
// //         }
// //         <GridViewOutlinedIcon />


// //         <div className="search">
// //           <SearchOutlinedIcon />
// //           <input type="text" placeholder='Search here...' />
// //         </div>



// //       </div>
// //       <div className="right">
// //         <PersonOutlineOutlinedIcon />
// //         <MailOutlinedIcon />
// //         <NotificationsOutlinedIcon />

// //         {/* <div className="user">
// //           <img
// //             src={
// //               currentUser?.profilePic?.startsWith("http")
// //                 ? currentUser.profilePic
// //                 : `/upload/${currentUser.profilePic || ""}`
// //             }
// //             alt={currentUser?.name || "User"}
// //           />
// //           <span>{currentUser?.name || "Guest"}</span>
// //         </div> */}


// //         <div className="user">
// //           <img src={"/upload/" + currentUser.profilePic} alt="" />
// //           <span>{currentUser.name}</span>
// //         </div>

// //       </div>
// //     </div>
// //   )
// // }

// // export default Navbar;


// import React, { useContext } from 'react';
// import './Navbar.scss';
// import { Link } from 'react-router-dom';
// import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
// import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
// import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
// import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
// import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
// import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
// import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
// import { DarkModeContext } from '../../context/darkModeContext';
// import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
// import { AuthContext } from '../../context/authContext';

// const Navbar = () => {
//   const { toggle, darkMode } = useContext(DarkModeContext);
//   const { currentUser } = useContext(AuthContext);

//   return (
//     <div className="navbar">
//       <div className="left">
//         <Link to="/" style={{ textDecoration: "none" }}>
//           <span>Junno</span>
//         </Link>
//         <HomeOutlinedIcon />
//         {darkMode ? (
//           <LightModeOutlinedIcon onClick={toggle} />
//         ) : (
//           <DarkModeOutlinedIcon onClick={toggle} />
//         )}
//         <GridViewOutlinedIcon />
//         <div className="search">
//           <SearchOutlinedIcon />
//           <input type="text" placeholder="Search here..." />
//         </div>
//       </div>
//       <div className="right">
//         <PersonOutlineOutlinedIcon />
//         <MailOutlinedIcon />
//         <NotificationsOutlinedIcon />

//         <div className="user">
//           {/* Check if profilePic exists and is not null */}
//           <img
//             src={
//               currentUser?.profilePic
//                 ? "/upload/" + currentUser.profilePic  // Use the profile picture if available
//                 : "/default-profile.png"  // Use default if no profile picture
//             }
//             alt={currentUser?.name || "User"}
//           />
//           <span>{currentUser?.name || "Guest"}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Navbar;