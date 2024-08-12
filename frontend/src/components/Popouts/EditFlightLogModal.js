import React, { useContext, useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@windmill/react-ui';
import { Input, Label } from '@windmill/react-ui';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import { GET_FLIGHT_LOG, PUT_FLIGHT_LOG } from '../../config/constants';

const EditFlightLogModal = () => {
  const { token, editData, setIsEditLogOpen, setTableData, isEditLogOpen } = useContext(UserContext);
  const [tailNumber, setTailNumber] = useState("");
  const [flightId, setFlightId] = useState("");
  const [takeoff, setTakeoff] = useState(new Date()); // Initialize with current date
  const [landing, setLanding] = useState(new Date()); // Initialize with current date
  const [duration, setDuration] = useState("");

  useEffect(() => {
    if (editData) {
      const parsedTakeoff = new Date(editData.takeoff);
      const parsedLanding = new Date(editData.landing);

      // Validate dates
      if (!isNaN(parsedTakeoff.getTime())) {
        setTakeoff(parsedTakeoff);
      }
      if (!isNaN(parsedLanding.getTime())) {
        setLanding(parsedLanding);
      }
      
      setTailNumber(editData.tailNumber || "");
      setFlightId(editData.flightID || "");
      setDuration(editData.duration || "");
    }
  }, [editData]);

  const calculateDuration = (start, end) => {
    const differenceMillis = end.getTime() - start.getTime();
    const differenceHours = differenceMillis / (1000 * 60 * 60);
    return differenceHours.toFixed(1); // Format to 1 decimal place
  };

  const handleStartDateChange = (date) => {
    if (date) {
      setTakeoff(date);
      if (landing) {
        const calculatedDuration = calculateDuration(date, landing);
        setDuration(calculatedDuration);
      }
    }
  };

  const handleEndDateChange = (date) => {
    if (date) {
      setLanding(date);
      if (takeoff) {
        const calculatedDuration = calculateDuration(takeoff, date);
        setDuration(calculatedDuration);
      }
    }
  };

  const closeModal = () => {
    setIsEditLogOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    closeModal();

    const updatedData = {
      tailNumber: tailNumber, 
      flightID: flightId, 
      takeoff: takeoff.toISOString(), 
      landing: landing.toISOString(), 
      duration: duration
    };

    try {
      await axios.put(PUT_FLIGHT_LOG + editData._id, updatedData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });

      const res = await axios.get(GET_FLIGHT_LOG, {
        headers: {
          'x-auth-token': token
        }
      });
      setTableData(res.data); 
    } catch (error) {
      console.error('Error updating flight log:', error);
    }
  };

  return (
    <Modal isOpen={isEditLogOpen} onClose={closeModal} style={{ overflow: "visible" }}>
      <ModalHeader>Edit Flight Log</ModalHeader>
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="hidden sm:block">
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
              <span>Takeoff</span>
              <DateTimePicker
                value={takeoff}
                onChange={handleStartDateChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Label>
          </div>
          <div>
            <Label>
              <span>Landing</span>
              <DateTimePicker
                value={landing}
                onChange={handleEndDateChange}
                minDate={takeoff} // Disable dates before the takeoff date
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Label>
          </div>
          <div className="hidden sm:block">
            <Label>
              <span>Duration</span>
              <Input
                className="mt-1"
                value={duration}
                readOnly
              />
            </Label>
          </div>
        </ModalBody>
        <ModalFooter>
          <div>
            <Button type="submit">Confirm Changes</Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default EditFlightLogModal;
