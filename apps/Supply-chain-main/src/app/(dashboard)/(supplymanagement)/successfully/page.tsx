import React from "react";
import "./styles.css"; // Make sure this file includes your provided CSS

const Page: React.FC = () => {
  return (
    <div className="card">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        width="120"
        className="App-logo"
      >
        <g strokeWidth="0" id="SVGRepo_bgCarrier"></g>
        <g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            strokeWidth="1.5"
            stroke="#cbe6ff"
            d="M5 12V18C5 18 5 21 12 21C19 21 19 18 19 18V12"
          ></path>
          <path
            strokeWidth="1.5"
            stroke="#cbe6ff"
            d="M5 6V12C5 12 5 15 12 15C19 15 19 12 19 12V6"
          ></path>
          <path
            strokeWidth="1.5"
            stroke="#cbe6ff"
            d="M12 3C19 3 19 6 19 6C19 6 19 9 12 9C5 9 5 6 5 6C5 6 5 3 12 3Z"
          ></path>
        </g>
      </svg>
      <div className="header">successfull</div>
      {/* <button className="App-button">Start learning now</button> */}
      {/* Additional successfully message */}
      {/* <div style={{ marginTop: "20px", fontSize: "20px", color: "#cbe6ff" }}>
        successfully
      </div> */}
    </div>
  );
};

export default Page;
