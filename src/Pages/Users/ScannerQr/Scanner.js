import React, { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Link } from "react-router-dom";

const Scanner = ({ openModal }) => {
  const [scanResult, setScanResult] = useState(null);
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(success, error);

    function success(result) {
      scanner.clear();
      setScanResult(result);
      openModal(result);
    }
    function error(err) {
      console.warn(err);
    }
  }, []);

  return (
    <>
      <div>
        <h3 style={{ fontSize: "21px" }} className="fw-bold">
          QR Code Scanner
        </h3>
        {scanResult ? (
          <div className="mt-2">
            success: <Link href={scanResult}>{scanResult}</Link>
          </div>
        ) : (
          <div id="reader" className="mt-4" heigh="100"></div>
        )}
      </div>
    </>
  );
};

export default Scanner;
