import React from 'react'
import './Rightbar.scss'

const Rightbar = () => {
  return (
    <div className='rightbar'>
      <div className="container">
        <div className="item">
          <span>Suggetions for You</span>
          <div className="user">
            <div className="user_info">
              <img src="https://images.pexels.com/photos/8420902/pexels-photo-8420902.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
              <span>Suriya Akter</span>
            </div>

            <div className="buttons">
              <button>Follow</button>
              <button>Dismiss</button>

            </div>



          </div>
          <div className="user">
            <div className="user_info">
              <img src="https://images.pexels.com/photos/2026960/pexels-photo-2026960.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
              <span>Tayeba Moni</span>
            </div>

            <div className="buttons">
              <button>Follow</button>
              <button>Dismiss</button>

            </div>



          </div>
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
              <div className="online"/>
              <span>Shoriful</span>
            </div>
          </div>
          <div className="user">
            <div className="user_info">
              <img src="https://images.pexels.com/photos/246805/pexels-photo-246805.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
              <div className="online"/>
              <span>Tuhin Rana</span>
            </div>
          </div>
          <div className="user">
            <div className="user_info">
              <img src="https://images.pexels.com/photos/1619801/pexels-photo-1619801.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
              <div className="online"/>
              <span>WK Siam</span>
            </div>
          </div>
          <div className="user">
            <div className="user_info">
              <img src="https://images.pexels.com/photos/977796/pexels-photo-977796.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
              <div className="online"/>
              <span>taohid</span>
            </div>
          </div>
          <div className="user">
            <div className="user_info">
              <img src="https://images.pexels.com/photos/1205033/pexels-photo-1205033.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
              <div className="online"/>
              <span>Muzahidul Islam</span>
            </div>
          </div>
          <div className="user">
            <div className="user_info">
              <img src="https://images.pexels.com/photos/27658802/pexels-photo-27658802/free-photo-of-a-woman-in-a-white-shirt-and-jeans-standing-in-front-of-a-street.jpeg?auto=compress&cs=tinysrgb&w=600" alt="" />
              <div className="online"/>
              <span>Sumiya Rahman</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default Rightbar;
