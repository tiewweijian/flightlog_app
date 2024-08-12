import React, { useState, useEffect, useContext } from 'react'
import AdminControl from '../components/AdminControl'
import PageTitle from '../components/Typography/PageTitle'
import { HeartIcon, EditIcon, TrashIcon } from '../icons'
import Swal from 'sweetalert2';

import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
  Button,
} from '@windmill/react-ui'
import Modals from '../components/Popouts/LoginModal'
import { UserContext } from '../context/UserContext'
import { Card, CardBody } from '@windmill/react-ui'
import axios from 'axios'
import EditFlightLogModal from '../components/Popouts/EditFlightLogModal'
import CreateAccountModal from '../components/Popouts/CreateAccountModal';
import AdminControlModal from '../components/Popouts/AdminControlModal';
import { DELETE_FLIGHT_LOG, GET_FLIGHT_LOG } from '../config/constants';

function Dashboard() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  const { isLoginModalOpen, setIsLoginModalOpen, token, tableData, setEditData, setIsEditLogOpen, setTableData, searchText, isAdmin, setIsAdmin} = useContext(UserContext)

  // pagination setup
  const resultsPerPage = 10
  const totalResults = tableData.length

  // pagination change control
  function onPageChange(p) {
    setPage(p)
  }

  const formatDateToSingaporeTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-SG', {
      timeZone: 'Asia/Singapore',
      dateStyle: 'short', // or 'full', 'medium', 'long'
      timeStyle: 'short'  // or 'full', 'medium', 'short'
    }).format(date);
  };
  
  useEffect(() => {
    if (searchText.trim() == "") {
      setData(tableData.slice((page - 1) * resultsPerPage, page * resultsPerPage))
    } else {
      const filteredData = tableData.filter(item => 
        item.tailNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        item.flightID.toLowerCase().includes(searchText.toLowerCase())
      );
      setData(filteredData.slice((page - 1) * resultsPerPage, page * resultsPerPage))
    }


  }, [page, tableData, searchText])

  useEffect(() => {
    if (!token) {
      setIsLoginModalOpen(true); 
    } 
  }, [token])

  const handleClick = () => {
    console.log('Button clicked. Current state of isModalOpen:', isLoginModalOpen);

    if (!token) {
      setIsLoginModalOpen(true)
    } else {
      setIsLoginModalOpen(false )
    }
  };

  const handleEdit = (row) => {
    console.log(row)
    setEditData(row)
    setIsEditLogOpen(true)
  };


  const asyncAlert = async () => {
    const result = await Swal.fire({
      title: 'You are deleting this flight log, and cannot be recovered. Proceed?',
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
        await axios.delete(DELETE_FLIGHT_LOG + row._id, {
          headers: {
            'x-auth-token': token // Include the token in the headers if needed
          }
        });
  
        try {
          const res = await axios.get(GET_FLIGHT_LOG, {
            headers: {
              'x-auth-token': token
            }
          });
          console.log(res.data)
          setTableData(res.data); 
        } catch (error) {
          console.log(error)
        }
      } catch (error) {
        console.error('Error deleting the flight log:', error);
      }
    }
  } 
    


  

  return (
    <>
      <PageTitle>Summary</PageTitle>
      
      {isAdmin ? <AdminControl/> : ""}

      <Modals/> 

      <EditFlightLogModal/>

      <AdminControlModal/>

      <CreateAccountModal/>

      {token ? 
        <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Tail Number</TableCell>
              <TableCell>Flight ID</TableCell>
              <TableCell>Take Off</TableCell>
              <TableCell>Landing</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>


            </tr>
          </TableHeader>
          <TableBody>
            {data.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <p className="font-semibold">{user.tailNumber}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.flightID}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{formatDateToSingaporeTime(user.takeoff)}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{formatDateToSingaporeTime(user.landing)}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{user.duration}</span>
                </TableCell>
                <TableCell>
                  <Button icon={EditIcon} aria-label="Edit" onClick={() => handleEdit(user, token)}/>
                </TableCell>
                <TableCell>
                  <Button icon={TrashIcon} aria-label="Edit" onClick={() => handleDelete(user, token)}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          />
        </TableFooter>
        </TableContainer>
      
      : 
        <Card>
          <CardBody>
            <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Log in to view data</p>
            <p className="text-gray-600 dark:text-gray-400">
              Restricted access to flight log data
            </p>
          </CardBody>
        </Card>
      }
      
    </>
  )
}

export default Dashboard
