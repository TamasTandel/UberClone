import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConfirmRidePopUp = ({ setConfirmRidePopUpPanel, rideData }) => {
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [rideDetails, setRideDetails] = useState(null);

  useEffect(() => {
    const rideDataFromStorage = localStorage.getItem('selectedRide');
    if (rideDataFromStorage) {
      const parsedRide = JSON.parse(rideDataFromStorage);
      setRideDetails(parsedRide);
      setPhone(parsedRide.phone);
      console.log('Ride data from localStorage:', parsedRide); // Log the data\
    } else if (rideData) {
      setRideDetails(rideData);
      setPhone(rideData.phone);
      localStorage.setItem('selectedRide', JSON.stringify(rideData));
      console.log('Ride data from parent:', rideData); // Log the data
    } 
  }, [rideData]);

  const maskPhoneNumber = (phone) => {
    return phone.replace(/.(?=.{4})/g, 'X');
  };

  const sendOtpHandler = async () => {
    try {
      await axios.post('https://uber-clone-roan-xi.vercel.app/api/send-otp', { phone });
      alert('OTP sent successfully');
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const updateUserStatus = async () => {
    console.log("Updating status for username:", rideDetails.username); // Log username
    try {
      await axios.put('https://uber-clone-roan-xi.vercel.app/api/users/update-status', {
        username: rideDetails.username,
        status: 'Riding',
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert('User status updated to riding');
    } catch (error) {
      console.error('Error updating user status:', error.response?.data?.message || error.message);
      alert('Error updating user status');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // First, verify the OTP
      await axios.post('https://uber-clone-roan-xi.vercel.app/api/verify-otp', { phone, otp });
      alert('OTP verified successfully');

      // Then, update captain status to "riding"
      await axios.put('https://uber-clone-roan-xi.vercel.app/api/captains/status', 
        { status: 'riding' }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert('Captain status updated to riding');

      // Update user status to "riding"
      await updateUserStatus(rideDetails.username);

      window.location.reload();
      // Proceed with ride confirmation logic here
    } catch (error) {
      console.error('Error verifying OTP or updating status:', error.response?.data?.message || error.message);
      alert('Invalid OTP or error updating status');
    }
  };

  return (
    <div className="z-50">
      <h5
        className="p-1 text-center top-0 absolute text-gray-300 w-[90%] text-4xl"
        onClick={() => setConfirmRidePopUpPanel(false)}
      >
        <i className="ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-bold p-5">Confirm this ride to start</h3>
      {rideDetails && (
        <>
          <div className="flex w-full items-center justify-between bg-yellow-300 rounded-full p-2">
            <div className="flex items-center gap-4">
              <img
                className="h-10 w-10 object-cover rounded-full"
                src={`https://uber-clone-roan-xi.vercel.app/${rideDetails.profileImage}` || "https://images.unsplash.com/photo-1595152772835-219674b2a8a6"}
                alt=""
              />
              <h4 className="text-lg font-bold">{rideDetails.username || "Unknown User"}</h4>
            </div>
            <h5 className="text-lg font-bold mr-3">{rideDetails.distance || "N/A"} km</h5>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-5 p-2 border-b-2">
              <i className="ri-map-pin-user-fill text-xl"></i>
              <div>
                <h3 className="text-lg font-medium">{rideDetails.pickup?.name || "Not Provided"}</h3>
                <div className="text-sm text-gray-500">{rideDetails.pickup?.address || "Pickup location"}</div>
              </div>
            </div>
            <div className="flex items-center gap-5 p-2 border-b-2">
              <i className="ri-map-pin-2-fill text-xl"></i>
              <div>
                <h3 className="text-lg font-medium">{rideDetails.destination?.name || "Not Provided"}</h3>
                <div className="text-sm text-gray-500">{rideDetails.destination?.address || "Destination location"}</div>
              </div>
            </div>
            <div className="flex items-center gap-5 p-2">
              <i className="ri-currency-line text-xl"></i>
              <div>
                <h3 className="text-lg font-medium">${rideDetails.vehicle?.fee || "0.00"}</h3>
                <div className="text-sm text-gray-500">Cash</div>
              </div>
            </div>
          </div>
        </>
      )}

      {phone && (
        <div className="mt-4 p-4 text-xl ">
          <p>Sending OTP to: {maskPhoneNumber(phone)}</p>
        </div>
      )}
      <form className="w-full p-4" onSubmit={submitHandler}>
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="bg-gray-200 text-lg w-full px-6 rounded-lg py-2 mt-2"
          type="number"
          placeholder="Enter OTP"
        />
        <button
          type="button"
          onClick={sendOtpHandler}
          className="w-full bg-blue-600 text-white font-semibold rounded-lg p-2 text-lg mt-2"
        >
          Send OTP
        </button>
        <div className="flex w-full gap-2 mt-5">
          <button
            onClick={() => setConfirmRidePopUpPanel(false)}
            className="w-full bg-red-600 text-white font-semibold rounded-lg p-2 text-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full bg-green-700 text-white font-semibold rounded-lg p-2 text-lg"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfirmRidePopUp;
