import React, { useContext } from 'react'
import routes from '../../routes/sidebar'
import { NavLink, Route } from 'react-router-dom'
import * as Icons from '../../icons'
import { Button } from '@windmill/react-ui'
import { UserContext } from '../../context/UserContext'

function Icon({ icon, ...props }) {
  const Icon = Icons[icon]
  return <Icon {...props} />
}

function SidebarContent() {

  const { setIsCreateFlightModalOpen, token, isCreateAccountOpen, setIsCreateAccountOpen } = useContext(UserContext);


  const openCreateFlightLog = () => {
    if (!token) {
      alert("Only logged in users can create flight log data")
    } else {
      setIsCreateFlightModalOpen(true)
    }
  }

  const openCreateAccountModal = () => {
    setIsCreateAccountOpen(true)
    console.log(isCreateAccountOpen)
  }

  return (
    <div className="py-4 text-gray-500 dark:text-gray-400">
      <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">
        Flight Logs
      </a>        
      <div className="px-6 my-6">
        <Button onClick={openCreateFlightLog}>
          Create Flight Log
          <span className="ml-3" aria-hidden="true">
            +
          </span>
        </Button>
      </div>
      <div className="px-6 my-6">
        <Button onClick={openCreateAccountModal}>
          Create New Account
        </Button>
      </div>
    </div>
  )
}

export default SidebarContent
