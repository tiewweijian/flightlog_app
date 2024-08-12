import React, { useContext, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label } from '@windmill/react-ui';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { GET_FLIGHT_LOG, POST_FLIGHT_LOG } from '../../config/constants';

const CreateFlightLogModal = ({ isModalOpen, setModalStatus }) => {
  const { token, setIsCreateFlightModalOpen, setTableData } = useContext(UserContext);
  const [tailNumber, setTailNumber] = useState('');
  const [flightId, setFlightId] = useState('');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [duration, setDuration] = useState('');

  const calculateDuration = (start, end) => {
    const differenceMillis = end.getTime() - start.getTime();
    const differenceHours = differenceMillis / (1000 * 60 * 60);
    return differenceHours.toFixed(1); // Format to 2 decimal places
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate) {
      const calculatedDuration = calculateDuration(date, endDate);
      setDuration(calculatedDuration);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (startDate) {
      const calculatedDuration = calculateDuration(startDate, date);
      setDuration(calculatedDuration);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      console.log("Not logged in");
      return;
    }

    try {
      const response = await axios.post(POST_FLIGHT_LOG, 
        {
          tailNumber,
          flightID: flightId,
          takeoff: startDate,
          landing: endDate,
          duration,
        },
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Flight log created:', response.data);

      try {
        const res = await axios.get(GET_FLIGHT_LOG, {
          headers: {
            'x-auth-token': token,
          },
        });
        setTableData(res.data);
      } catch (error) {
        console.log(error);
      }

      closeModal();
    } catch (error) {
      console.error('Error creating flight log:', error);
    }
  };

  const closeModal = () => {
    setIsCreateFlightModalOpen(false);
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} style={{ overflow: "visible" }}>
      <ModalHeader>Create Flight Log</ModalHeader>
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div>
            <Label>
              <span>Tail Number</span>
              <Input
                className="mt-1"
                value={tailNumber}
                onChange={(e) => setTailNumber(e.target.value)}
              />
            </Label>
          </div>
          <div>
            <Label>
              <span>Flight ID</span>
              <Input
                className="mt-1"
                value={flightId}
                onChange={(e) => setFlightId(e.target.value)}
              />
            </Label>
          </div>
          <div>
            <Label>
              <span>Takeoff</span>
              <DateTimePicker
                value={startDate}
                onChange={handleStartDateChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Label>
          </div>
          <div>
            <Label>
              <span>Landing</span>
              <DateTimePicker
                value={endDate}
                onChange={handleEndDateChange}
                style={{ width: '200px', height: '40px' }}
                minDate={startDate}  // Disable dates before the startDate
                className="w-full h-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 overflow:vi"
              />
            </Label>
          </div>
          <div>
            <Label>
              <span>Duration (hours)</span>
              <Input
                className="mt-1"
                value={duration}
                readOnly
              />
            </Label>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="submit">Create Flight Log</Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default CreateFlightLogModal;
