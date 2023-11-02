import React from "react";
import './styles.css';

function Notice() {
  return (
    <div className="notice">
      &copy; {new Date().getFullYear()} iamjayandhan. All rights reserved.
    </div>
  );
}

export default Notice;
