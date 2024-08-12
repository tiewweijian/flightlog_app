import React, { useContext, useEffect, useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@windmill/react-ui'
import { Input, HelperText, Label, Select, Textarea, TableBody, TableContainer, Table, TableHeader, TableCell,TableRow, TableFooter, } from '@windmill/react-ui'
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { TrashIcon } from '../../icons';
import Swal from 'sweetalert2';
import { DELETE_USER, GET_ALL_USERS } from '../../config/constants';

const AdminControlModal = ({isModalOpen, setModalStatus}) => {

  const { token, storeToken, removeToken } = useContext(UserContext);
  const { isLoginModalOpen, setIsLoginModalOpen, tableData, setTableData, isAdminControlOpen, setIsAdminControlOpen, userData, setUserData } = useContext(UserContext)

  const closeModal = () => {
    setIsAdminControlOpen(false)
  }
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(GET_ALL_USERS, {
          headers: {
            'x-auth-token': token
          }
        });
        console.log(response.data)
        setUserData(response.data)
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (token) {
      fetchUsers()
    }
  }, [token]);

  const asyncAlert = async () => {
    const result = await Swal.fire({
      title: 'You are deleting this user and cannot be recovered',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'YES',
      cancelButtonText: 'NO',
    });
  
    return result.isConfirmed ? 'YES' : 'NO';
  };
  
  const handleDelete = async (row, token) => {

    const result = await asyncAlert() 

    if (result == 'YES') {
      try {
        await axios.delete(DELETE_USER + row._id, {
          headers: {
            'x-auth-token': token // Include the token in the headers if needed
          }
        });
  
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
        console.error('Error deleting the flight log:', error);
      }
    }
  } 

  return (
      <Modal isOpen={isAdminControlOpen} onClose={closeModal}>
        <ModalHeader>Delete Users</ModalHeader>
        <ModalBody>
        <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Username</TableCell>
              <TableCell>ID</TableCell>
              <TableCell></TableCell>

            </tr>
          </TableHeader>
          <TableBody>
            {userData.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <p className="font-semibold">{user.username}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user._id}</span>
                </TableCell>
                <TableCell>
                  {user.username == "admin" ? "" : <Button icon={TrashIcon} aria-label="Edit" onClick={() => handleDelete(user, token)}/>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableContainer>
        </ModalBody>
        <ModalFooter>

      </ModalFooter>
      </Modal>
  )
}

export default AdminControlModal
