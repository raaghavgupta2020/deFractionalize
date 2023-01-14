import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import useStickyHeader from "../../header/StickyHeader";
import NotificationData from "./notification-data.json";

const DashboardHeader = () => {
    const BrandLogo = "img/core-img/dashboard-logo.png";

    let [check] = useState(true);
    const sticky = useStickyHeader(10);
    const stickyClass = `${(sticky && check) ? 'sticky-on' : ''}`

    const [isActive, setActive] = useState(false);

    const handleToggle = () => {
        setActive(!isActive);
    };

    const userDropdownData = [
        {
            path: "/dashboard",
            icon: "bi-person-circle",
            text: "Dashboard"
        },
       
    ]

    const userInfo = [
        {
            thumbnail: "img/bg-img/u2.jpg",
            username: "Designing W.",
            userType: "Premium User"
        }
    ]

    const balanceCard = [
        {
            title: "Current balance",
            icon: "img/core-img/ethereum.png",
            balance: 4.0678,
            balanceType: "ETH"
        }
    ]

    const AdminNav = [
      {
        id: 1,
        path: "/dashboard",
        icon: "bi-speedometer",
        text: "Dashboard",
      },
      {
        id: 2,
        path: "/epns",
        icon: "bi-speedometer",
        text: "epns inbox",
      },
     
    ];

    const userDropdownList = userDropdownData.map((elem, index) => (
        <li key={index}>
            <Link className="dropdown-item" to={elem.path} >
                <i className={`me-2 bi ${elem.icon}`} />
                {elem.text}
            </Link>
        </li>
    ))

    const notificationCards = NotificationData.slice(0, 4).map((elem, index) => (
        <li key={index}>
            <Link className="dropdown-item" to={`/notification-details/${elem.id}`} >
                <i className={`me-2 bg-${elem.icon[0].color} bi ${elem.icon[0].icon}`} />
                {elem.notification}
            </Link>
        </li>
    ))

    return (
        <div className='pt-10'>


            <div className={`admin-sidebar-wrap mt-20 ${isActive ? "sidebar-active" : "sidebar-disabled"}`} >
                <div className="overflowY-scroll">
                    {/* User Profile */}
                    <div className="user-profile">
                        {/* User Name */}
                        <div className="user-name mb-5">
                            <div className="d-flex align-items-center">
                                <img src={`${process.env.PUBLIC_URL}/${userInfo[0].thumbnail}`} alt="" />
                                <div className="ms-3">
                                    <h6 className="lh-1 text-dark fz-18">{userInfo[0].username}</h6>
                                    <span className="badge bg-primary fz-12">{userInfo[0].userType}</span>
                                </div>
                            </div>
                        </div>


                    </div>

                    {/* Sidenav */}
                    <div className="sidenav">
                        <ul>
                            <li>Menu</li>
                            {AdminNav.map((elem, index) => (
                                <li key={index}>
                                    <NavLink to={elem.path} >
                                        <i className={`bi ${elem.icon}`} />
                                        {elem.text}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    

                </div>
            </div>
        </div>
    )
}

export default DashboardHeader;