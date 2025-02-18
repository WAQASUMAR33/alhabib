"use client";
import { useState, useEffect } from 'react';
import {
  FaSignOutAlt,
  FaChevronDown,
  FaUsers,
  FaGamepad,
  FaMoneyCheckAlt,
  FaCog,
  FaQuestionCircle,
  FaUserTie,
  FaBoxOpen,
  FaTicketAlt,
  FaPassport,
  FaSuitcaseRolling, // Import the new icon for Account Management
} from 'react-icons/fa';
import { PiBank, PiHandDeposit } from "react-icons/pi";
import { PiHandWithdraw } from "react-icons/pi";
import { BiCoinStack } from "react-icons/bi";
import { CiBank } from "react-icons/ci";
import { useRouter } from 'next/navigation';
import { MdHistory } from "react-icons/md";
import { Analytics, AnalyticsOutlined, Home, LocalActivity } from '@mui/icons-material';
import { UserIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Logout } from '@/app/Store/Slice';
import Image from 'next/image';
import { Group, Hotel, Plane, PlaneLanding } from 'lucide-react';
const Sidebar = () => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('Guest'); // Default values
  const [userRole, setUserRole] = useState('admin'); // Default role
  const [openDropdowns, setOpenDropdowns] = useState({});
  const router = useRouter();

  const toggleDropdown = (key) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleLogout = () => {
    dispatch(Logout());
    // Perform any additional actions on logout if needed
    window.location.href = '/';
  };

  useEffect(() => {
    // Optional: You can add logic here for loading user info if needed
  }, []);

  // Define menu items with roles
  const menuItems = [
    {
      title: "Admin Management",
      path: "/admin-dashboard/Admin-Management",
      icon: <FaUsers className="h-5 w-5" />,
      roles: ["admin", "sub admin"],
    },
    {
      title: "Agents Management",
      path: "/admin-dashboard/Agent-Management",
      icon: <FaUserTie className="h-5 w-5" />,
      roles: ["admin", "sub admin"],
    },
    {
      title: "Flight Management",
      icon: <PlaneLanding className="h-5 w-5" />,
      roles: ["admin", "sub admin"],
      subitems: [
        {
          title: "Flight Groups",
          path: "/admin-dashboard/Flight-Group-Management",
          icon: <Group className="h-5 w-5" />,
          roles: ["admin", "sub admin"],
        },
        {
          title: "Flight Sector",
          path: "/admin-dashboard/Flight-Sector-Management",
          icon: <LocalActivity className="h-5 w-5" />,
          roles: ["admin", "sub admin"],
        },
        {
          title: "Flight Airline",
          path: "/admin-dashboard/Flight-Airline-Management",
          icon: <Plane className="h-5 w-5" />,
          roles: ["admin", "sub admin"],
        },
        {
          title: "Flights",
          path: "/admin-dashboard/Group-Flight-Management",
          icon: <PlaneLanding className="h-5 w-5" />,
          roles: ["admin", "sub admin"],
        },
        // {
        //   title: "Flights Bookings",
        //   path: "/admin-dashboard/Flight-Booking-Management",
        //   icon: <PlaneLanding className="h-5 w-5" />,
        //   roles: ["admin", "sub admin"],
        // },
        // {
        //   title: "Group Flights Bookings",
        //   path: "/admin-dashboard/Group-Flight-Booking-Management",
        //   icon: <PlaneLanding className="h-5 w-5" />,
        //   roles: ["admin", "sub admin"],
        // },
      ]
    },
   
    {
      title: "Hotel Management",
      icon: <Hotel className="h-5 w-5" />,
      roles: ["admin", "sub admin"],
      subitems: [
        {
          title: "Room Types",
          path: "/admin-dashboard/Hotel-Management/Room-Type",
          icon: <Home className="h-5 w-5" />,
          roles: ["admin", "sub admin"],
        },
        {
          title: "Hotels",
          path: "/admin-dashboard/Hotel-Management/Hotel",
          icon: <Home className="h-5 w-5" />,
          roles: ["admin", "sub admin"],
        },
        // {
        //   title: "Hotel Booking",
        //   path: "/admin-dashboard/Hotel-Management//Hotel-Booking",
        //   icon: <PiHandWithdraw className="h-5 w-5" />,
        //   roles: ["admin", "sub admin"],
        // },
      ]
    },
    {
      title: "Package Management",
      path: "/admin-dashboard/Package-Management",
      icon: <FaSuitcaseRolling className="h-5 w-5" />,
      roles: ["admin", "sub admin"],
    },


    {
      title: "Requests",
      icon: <Hotel className="h-5 w-5" />,
      roles: ["admin", "sub admin"],
      subitems: [
        {
          title: "Flights Bookings",
          path: "/admin-dashboard/Flight-Booking-Management",
          icon: <PlaneLanding className="h-5 w-5" />,
          roles: ["admin", "sub admin"],
        },
        {
          title: "Group Flights Bookings",
          path: "/admin-dashboard/Group-Flight-Booking-Management",
          icon: <PlaneLanding className="h-5 w-5" />,
          roles: ["admin", "sub admin"],
        },
        {
          title: "Hotel Booking",
          path: "/admin-dashboard/Hotel-Management/Hotel-Booking",
          icon: <PiHandWithdraw className="h-5 w-5" />,
          roles: ["admin", "sub admin"],
        },
        {
          title: "Package Bookings",
          path: "/admin-dashboard/Package-Booking-Management",
          icon: <FaBoxOpen className="h-5 w-5" />,
          roles: ["admin", "sub admin"],
        },
        {
          title: "Payment Requests",
          path: "/admin-dashboard/Payment-Management",
          icon: <BiCoinStack className="h-5 w-5" />,
          roles: ["admin", "sub admin"],
        },
      ]
    },
    // {
    //   title: "Visa Management",
    //   path: "/admin-dashboard/Visa-Management",
    //   icon: <PiHandDeposit className="h-5 w-5" />,
    //   roles: ["admin", "sub admin"],
    // },
    // {
    //   title: "Ticket Management",
    //   path: "/admin-dashboard/Ticket-Management",
    //   icon: <PiHandDeposit className="h-5 w-5" />,
    //   roles: ["admin", "sub admin"],
    // },
   
    // {
    //   title: "Flight Groups",
    //   path: "/admin-dashboard/Flight-Group-Management",
    //   icon: <Group className="h-5 w-5" />,
    //   roles: ["admin", "sub admin"],
    // },
    // {
    //   title: "Flight Sector",
    //   path: "/admin-dashboard/Flight-Sector-Management",
    //   icon: <LocalActivity className="h-5 w-5" />,
    //   roles: ["admin", "sub admin"],
    // },
    // {
    //   title: "Flight Airline",
    //   path: "/admin-dashboard/Flight-Airline-Management",
    //   icon: <Plane className="h-5 w-5" />,
    //   roles: ["admin", "sub admin"],
    // },
    // {
    //   title: "Flights",
    //   path: "/admin-dashboard/Group-Flight-Management",
    //   icon: <PlaneLanding className="h-5 w-5" />,
    //   roles: ["admin", "sub admin"],
    // },
    // {
    //   title: "Package Bookings",
    //   path: "/admin-dashboard/Package-Booking-Management",
    //   icon: <FaBoxOpen className="h-5 w-5" />,
    //   roles: ["admin", "sub admin"],
    // },
    // {
    //   title: "Ticket Bookings",
    //   path: "/admin-dashboard/Ticket-Booking-Management",
    //   icon: <FaTicketAlt className="h-5 w-5" />,
    //   roles: ["admin", "sub admin"],
    // },
    // {
    //   title: "Visa Bookings",
    //   path: "/admin-dashboard/Visa-Booking-Management",
    //   icon: <FaPassport className="h-5 w-5" />,
    //   roles: ["admin", "sub admin"],
    // },
    // {
    //   title: "Payment Requests",
    //   path: "/admin-dashboard/Payment-Management",
    //   icon: <BiCoinStack className="h-5 w-5" />,
    //   roles: ["admin", "sub admin"],
    // },
    {
      title: "Ledgers",
      path: "/admin-dashboard/Ledgers",
      icon: <MdHistory className="h-5 w-5" />,
      roles: ["admin", "sub admin"],
    },
    {
      title: "Bank Accounts",
      path: "/admin-dashboard/Bank-Accounts",
      icon: <PiBank className="h-5 w-5" />,
      roles: ["admin", "sub admin"],
    },
    {
      title: "Settings",
      path: "/admin-dashboard/settings",
      icon: <FaCog className="h-5 w-5" />,
      roles: ["admin"],
    },
  ];
  
  


  return (
    <div className="bg-white text-gray-800 w-full min-h-screen flex flex-col border">
      <div className="px-6 pt-2 text-center">
        <div
          className=" mb-4 w-full text-3xl flex justify-center items-center "
        >
          <img src="/logo/logo1.jpg" width={50} height={50} alt="logo" className='object-contain w-full h-20' />
        </div>
        {/* <h2 className="text-xl font-semibold">Al Habib</h2> */}
      </div>

      {/* Menu Section */}
      <div className="flex-1 p-4 ">
        <ul className=" space-y-2">
          {/* Dynamic Menu Items */}
          <li key='home'>
            <a href='/admin-dashboard/Analytics'>
              <button className="flex hover:ml-3 transform transition-all duration-300 items-center p-2 hover:bg-gray-200/20 border-gray-500/20 border hover:border-gray-800 hover:border-1 rounded-md w-full">
                <AnalyticsOutlined />
                <span className="ml-3 text-sm font-medium">
                  Analytics
                </span>
              </button>
            </a>
          </li>

        
          {menuItems.map((item) =>
            item.roles.includes(userRole) && (<>
              {item.path ? <>  <li key={item.title}>
                <a href={item.path}>
                  <button className="flex hover:ml-3 transform transition-all duration-300 items-center p-2 hover:bg-gray-200/20 border-gray-500/20 border hover:border-gray-800 hover:border-1 rounded-md w-full">
                    {item.icon}
                    <span className="ml-3 text-sm font-medium">
                      {item.title}
                    </span>
                  </button>
                </a>
              </li></> : (<>
                <li key={item.title}>
                  <button
                    onClick={() => item.subitems && toggleDropdown(item.title)}
                    className="flex hover:ml-3 transform transition-all duration-300 items-center p-2 hover:bg-gray-200/20 border-gray-500/20 border hover:border-gray-800 hover:border-1 rounded-md w-full"
                  >
                    {item.icon}
                    <span className="ml-3 text-sm font-medium">{item.title}</span>
                    {item.subitems && (
                      <FaChevronDown
                        className={`h-4 w-4 ml-auto transform transition-transform duration-200 ${openDropdowns[item.title] ? 'rotate-180' : ''
                          }`}
                      />
                    )}
                  </button>
                  {item.subitems && openDropdowns[item.title] && (
                    <ul className="ml-6 mt-2 space-y-2">
                      {item.subitems.map((subitem) =>
                        subitem.roles.includes(userRole) && (
                          <li key={subitem.title}>
                            <a href={subitem.path}>
                              <button className="flex items-center p-2 hover:bg-gray-200/20 rounded-md w-full">
                                {subitem.icon}
                                <span className="ml-3 text-sm font-medium">{subitem.title}</span>
                              </button>
                            </a>
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </li>
              </>)} </>))}


              <li key='profile'>
            <a href='/admin-dashboard/Manage-Profile'>
              <button className="flex hover:ml-3 transform transition-all duration-300 items-center p-2 hover:bg-gray-200/20 border-gray-500/20 border hover:border-gray-800 hover:border-1 rounded-md w-full">
                <UserIcon className='size-5' />
                <span className="ml-3 text-sm font-medium">
                  Manage Profile
                </span>
              </button>
            </a>
          </li>
          {/* Logout Button */}
          <li className="mt-6">
            <button
              className="flex hover:ml-3 transform transition-all duration-300 items-center p-3 hover:bg-gray-200/20 border-gray-500/20 border hover:border-gray-800 hover:border-1 rounded-md w-full"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="h-5 w-5" />
              <span className="ml-3 text-sm font-medium">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

