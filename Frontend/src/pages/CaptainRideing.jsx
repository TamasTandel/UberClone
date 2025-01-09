import React, { useRef, useState } from 'react'; // Combined import
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import FinishRide from '../Components/FinishRide';
// import Map from '../Components/Map';
import CaptainDetails from '../Components/CaptainDetails';
import gsap from 'gsap';
import MapComponent from '../Components/MapComponent';

const CaptainRideing = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);

  // GSAP animation for finishRidePanel
  useGSAP(() => {
    if (finishRidePanel) {
      gsap.to(finishRidePanelRef.current, {
        transform: 'translateY(0)',
      });
    } else {
      gsap.to(finishRidePanelRef.current, {
        transform: 'translateY(100%)',
      });
    }
  }, [finishRidePanel]);

  return (
    <div className="h-screen relative"> {/* Make parent div relative */}
      {/* Header */}
      <div className="fixed flex justify-between w-full z-10">
        <img
          className="w-28"
          src="https://cdn-assets-us.frontify.com/s3/frontify-enterprise-files-us/eyJwYXRoIjoicG9zdG1hdGVzXC9hY2NvdW50c1wvODRcLzQwMDA1MTRcL3Byb2plY3RzXC8yN1wvYXNzZXRzXC9lZFwvNTUwOVwvNmNmOGVmM2YzMjFkMTA3YThmZGVjNjY1NjJlMmVmMzctMTYyMDM3Nzc0OC5haSJ9:postmates:9KZWqmYNXpeGs6pQy4UCsx5EL3qq29lhFS6e4ZVfQrs?width=2400"
          alt=""
        />
        <Link
          className="flex h-10 w-10 m-4 items-center justify-center rounded-full text-2xl font-semibold"
          to="/home"
        >
          <i className="ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* Map with adjusted height */}
      <div
        className="relative z-0"
        style={{ height: 'calc(100vh - 150px)' }} // Adjust map height to fill space between header and footer
      >
        <MapComponent />
      </div>

      {/* Details Panel */}
      <h5
        className="p-2 text-center absolute text-gray-100 w-full text-4xl"
        onClick={() => {
          setFinishRidePanel(true);
        }}
      >
        <i className="ri-arrow-up-wide-line"></i>
      </h5>

      {/* Bottom Panel */}
      <div className="h-[150px] px-6 bg-yellow-400 flex items-center justify-between">
        <h4 className="text-xl w-full p-2 font-bold">4 KM away</h4>
        <button
          className="w-full flex text-xl bg-green-700 text-white items-center justify-center p-2 rounded-lg font-semibold"
          onClick={() => {
            setFinishRidePanel(true);
          }}
        >
          Complete Ride
        </button>
      </div>

      {/* Finish Ride Panel */}
      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full px-3 py-10 pt-12 bg-white"
      >
        <FinishRide setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRideing;