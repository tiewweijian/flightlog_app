import React, { useContext, useState } from 'react'
import { SidebarContext } from '../context/SidebarContext'
import {
  SearchIcon,
  MoonIcon,
  SunIcon,
  BellIcon,
  MenuIcon,
  OutlinePersonIcon,
  OutlineCogIcon,
  OutlineLogoutIcon,
  ModalsIcon,
} from '../icons'
import { Avatar, Badge, Input, Dropdown, DropdownItem, WindmillContext } from '@windmill/react-ui'
import CreateFlightLogModal from './Popouts/CreateFlightLogModal'
import { UserContext } from '../context/UserContext'
import useClickOutside from '../hooks/useClickOutside'

function Header() {
  const { mode, toggleMode } = useContext(WindmillContext)
  const { toggleSidebar } = useContext(SidebarContext)

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const { isCreateFlightModalOpen, setIsCreateFlightModalOpen, isLoginModalOpen, setIsLoginModalOpen, token, removeToken, setSearchText } = useContext(UserContext);


  const dropdownRef = useClickOutside(() => {
    if (isProfileMenuOpen) {
      setIsProfileMenuOpen(false);
    }
  });

  function handleCreateButton() {

    if (!token) {
      alert("Only logged in users can create flight log data")
    } else {
      console.log(isCreateFlightModalOpen)
      setIsCreateFlightModalOpen(true)
    }
  }

  function handleProfileClick() {
    console.log(isProfileMenuOpen)
    setIsProfileMenuOpen(!isProfileMenuOpen)
  }

  const closeModal = () => {
    setIsCreateFlightModalOpen(false)
  }

  const openLoginModal =() => {
    setIsProfileMenuOpen(false)
    setIsLoginModalOpen(true)
  }

  const logout = () => {
    alert("Successfully Logged Out")
    removeToken() 
    setIsLoginModalOpen(true)
  }

  const handleSearchChange = (e) => {

  }

  return (
    <div>
      <CreateFlightLogModal isModalOpen={isCreateFlightModalOpen} setModalStatus={closeModal}/> 

      <header className="z-40 py-4 bg-white shadow-bottom dark:bg-gray-800">

        <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
          {/* <!-- Mobile hamburger --> */}
          <button
            className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-purple"
            onClick={toggleSidebar}
            aria-label="Menu"
          >
            <MenuIcon className="w-6 h-6" aria-hidden="true" />
          </button>
          {/* <!-- Search input --> */}
          <div className="flex justify-center flex-1 lg:mr-32">
            <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
              <div className="absolute inset-y-0 flex items-center pl-2">
                <SearchIcon className="w-4 h-4" aria-hidden="true" />
              </div>
              <Input
                className="pl-8 text-gray-700"
                placeholder="Search Flight IDs"
                aria-label="Search"
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
          <ul className="flex items-center flex-shrink-0 space-x-6">
            {/* <!-- Theme toggler --> */}
            <li className="flex">
              <button
                className="rounded-md focus:outline-none focus:shadow-outline-purple"
                onClick={toggleMode}
                aria-label="Toggle color mode"
              >
                {mode === 'dark' ? (
                  <SunIcon className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <MoonIcon className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
            </li>
            <button
              className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={handleCreateButton}
              aria-label="Notifications"
            >
              <ModalsIcon className="w-5 h-5" aria-hidden="true" />
              {/* <!-- Notification badge --> */}
            </button>
            {/* <!-- Profile menu --> */}
            <li className="relative" ref={dropdownRef}>
              <button
                className="rounded-full focus:shadow-outline-purple focus:outline-none"
                onClick={handleProfileClick}
                aria-label="Account"
                aria-haspopup="true"
              >
                <Avatar
                  className="align-middle"
                  src="https://cdn.icon-icons.com/icons2/2468/PNG/512/user_icon_149329.png"
                  alt=""
                  aria-hidden="true"
                />
              </button>
             
                <Dropdown align="right" isOpen={isProfileMenuOpen} onClose={() => handleProfileClick}>
                  {!token 
                  ? <DropdownItem onClick={openLoginModal}>
                  <OutlineLogoutIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                  <span>Log In</span>
                  </DropdownItem>
                  : <DropdownItem onClick={logout}>
                  <OutlineLogoutIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                  <span>Log Out</span>
                  </DropdownItem>}
                  </Dropdown>
            </li>
          </ul>
        </div>
      </header>
    </div>
  )
}

export default Header
