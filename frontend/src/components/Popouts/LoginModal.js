import React, { useContext, useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@windmill/react-ui'
import { Input, HelperText, Label, Select, Textarea } from '@windmill/react-ui'
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { GET_FLIGHT_LOG, IS_ADMIN, LOGIN_USER } from '../../config/constants';

const Modals = ({isModalOpen, setModalStatus}) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isIncorrectCreds, setIsIncorrectCreds] = useState(false)
  const { token, storeToken, removeToken } = useContext(UserContext);
  const { isLoginModalOpen, setIsLoginModalOpen, tableData, setTableData, isAdmin, setIsAdmin } = useContext(UserContext)
  const [ isLoading, setIsLoading ] = useState(false)

  const handleClick = () => {
    setModalStatus(!isModalOpen)
  }

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    try {
      // Make Axios request with form data
      setIsLoading(true)
      const response = await axios.post(LOGIN_USER, {
        username,
        password,
      });

      if (response.data.status == true) {
        storeToken(response.data.token);
        console.log(response.data.token)
      }

      try {
        const res = await axios.get(GET_FLIGHT_LOG, {
          headers: {
            'x-auth-token': response.data.token
          }
        });
        console.log(res.data)
        setTableData(res.data); 
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
      closeModal()

      try {
        const res = await axios.get(IS_ADMIN, {
          headers: {
            'x-auth-token': response.data.token
          }
        });

        if (res.data.isAdmin == true) {
          setIsAdmin(true)
        }
      } catch (error) {
        setIsAdmin(false)
      }
      closeModal()
    } catch (error) {
      setIsLoading(false)
      setIsIncorrectCreds(true)
      console.error('Error submitting form:', error);
    }
  
  };



  const closeModal = () => {
    setUsername("")
    setPassword("")
    setIsLoginModalOpen(false)
  }

  return (
      <Modal isOpen={isLoginModalOpen} onClose={closeModal}>
        <ModalHeader>Login</ModalHeader>
        <form onSubmit = {handleSubmit}>
        <ModalBody>
        <div className="hidden sm:block">
          <Label>
            <span>Username</span>
            {isIncorrectCreds 
            ? <Input
              className="mt-1"
              value={username}
              valid={false}
              onChange={(e) => setUsername(e.target.value)}
            />
            : <Input
              className="mt-1"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            }
          </Label>
        </div>
        <div className="hidden sm:block pt-5">
        <Label>
            <span>Password</span>
            {isIncorrectCreds 
            ? <Input
              className="mt-1"
              type="password"
              value={password}
              valid={false}
              onChange={(e) => setPassword(e.target.value)}
            />
            : <Input
              className="mt-1"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            }
          </Label>
        </div>
        </ModalBody>

        <ModalFooter>
        <div>
          {isLoading ? <Button disabled>Logging In</Button> : <Button type="submit">Login</Button>}
          
        </div>
      </ModalFooter>
      </form>
      </Modal>
  )
}

export default Modals
