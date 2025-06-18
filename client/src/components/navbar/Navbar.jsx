import React, { useState, useContext } from 'react';
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

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span>Junno</span>
        </Link>
        <HomeOutlinedIcon />
        {darkMode ? (
          <LightModeOutlinedIcon onClick={toggle} style={{ cursor: "pointer" }} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} style={{ cursor: "pointer" }} />
        )}
        <GridViewOutlinedIcon />
        <div className="search">
          <SearchOutlinedIcon />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
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
                  >
                    <div className="searchResultItem">
                      <img
                        src={user.profilePic ? '/upload/' + user.profilePic : +'/user-icon-1024x1024-dtzturco.png'}
                        alt={""}
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
        <PersonOutlineOutlinedIcon />
        <MailOutlinedIcon />
        <NotificationsOutlinedIcon />

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