import React, { useContext, useEffect, useState } from 'react' 
import { Modal, ModalHeader, ModalBody, ModalFooter, Button} from '@windmill/react-ui'
import { Input, HelperText, Label, Select, Textarea } from '@windmill/react-ui'
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { GET_ALL_USERS, REGISTER_USER } from '../../config/constants';
const CreateAccountModal = () => {


  const { token, isCreateAccountOpen, setIsCreateAccountOpen, setUserData } = useContext(UserContext);
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [accountExists, setAccountExist] = useState(false)
  const [differentPassword, setDifferentPassword] = useState(false)

  const closeModal = () => {
    setIsCreateAccountOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password != confirmPassword) {
      alert("Different Password")
      setDifferentPassword(true)
    } else if (username.toLocaleLowerCase() == "admin") {
      alert("Username not allowed")
      setAccountExist(true)
    } else {
  
      const accountData = {
        username: username, 
        password: password
      }
  
      try {
        const response = await axios.post(REGISTER_USER, accountData);
        console.log(response.data) 
        alert("Account created")
        closeModal()

        try {
          const res = await axios.get(GET_ALL_USERS, {
            headers: {
              'x-auth-token': token
            }
          });
          console.log(res.data)
          setUserData(res.data); 
        } catch (error) {
          console.log(error)
        }

      } catch (error) {
        if (error.response.data.msg == "User already exists") {
          alert("Username is used")
          setAccountExist(true)
        } 
        console.error('Error updating flight log:', error);
      }
    }
  }

  return (
      <Modal isOpen={isCreateAccountOpen} onClose={closeModal} >
        <ModalHeader>Create Account</ModalHeader>
        <form onSubmit = {handleSubmit}>
        <ModalBody>
        <div className="hidden sm:block">
          <Label>
            <span>Username</span>
            {accountExists ? 
            <Input
            className="mt-1"
            valid={false}
            value={username}
            onChange={(e) => setUsername(e.target.value)}/>
            : <Input
            className="mt-1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}/>
            }
            </Label>
        </div>
        <div className="hidden sm:block">
          <Label>
            <span>Password</span>
            {differentPassword ? 
            <Input
            className="mt-1"
            type="password"
            valid={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>
            : <Input
            className="mt-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}/>
            }
            </Label>
        </div>
        <div className="hidden sm:block">
          <Label>
            <span>Password</span>
            {differentPassword ? 
            <Input
            className="mt-1"
            type="password"
            valid={false}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}/>
            : <Input
            className="mt-1"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}/>
            }
            </Label>
        </div>
        </ModalBody>

        <ModalFooter>
        <div>
          <Button type="submit">Create Account</Button>
        </div>
      </ModalFooter>
      </form>
      </Modal>
  )
}

export default CreateAccountModal
