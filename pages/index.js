import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageAltText, setImageAltText] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [loading, setLoading] = useState(false);
  const [showLabel, setShowLabel] = useState(true);
  const colors = ["white", "green", "red", "blue"];
  const handleFileInput = (files) => {
    if (files[0].type.startsWith("image/")) {
      setSelectedFile(files[0]);
      setImageUrl(URL.createObjectURL(files[0]));
      setImageAltText("Uploaded");
    } else {
      setSelectedFile(null);
      setImageUrl(null);
      setImageAltText("Error: Not a valid image");
    }
  };

  // camera input
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (showCamera) {
      const startStream = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
          });
          setStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          setError(error);
        }
      };

      startStream();
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    };
  }, [showCamera]);

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        setImageUrl(URL.createObjectURL(blob));
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });
        setSelectedFile(file);
      }, "image/jpeg");
      // console.log("camera");
      setShowCamera(false);
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    // console.log(selectedFile);
    formData.append("image_file", selectedFile);
    const apiKey = "jB7R1HT1vfYVJMwe5jinASxP";
    const apiUrl = "https://api.remove.bg/v1.0/removebg";
    const config = {
      headers: {
        "X-Api-Key": apiKey,
      },
      responseType: "blob",
    };
    try {
      // console.log(formData);
      const response = await axios.post(apiUrl, formData, config);
      const imageBlob = response.data;
      // console.log(imageBlob)
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleDownloadWithNewBackground = () => {
    const imageElement = document.querySelector(".uploaded-image");
    html2canvas(imageElement).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL();
      link.download = "image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="con">
      <h1 className="mb-4  mt-5 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Image Background Remover
      </h1>
      <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
        AI advanced image background remover.
      </p>
      <div className="flex flex-row ">
        <button
          className="mr-20 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setShowCamera(true);
            // setShowLabel(false);
            setImageUrl(null);
            setSelectedFile(null);
          }}
        >
          Open Camera
        </button>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setShowCamera(false);
            setImageUrl(null);
            setSelectedFile(null);
            setShowLabel(true);
          }}
        >
          Upload Image
        </button>
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      </div>
      <div
        className="max-w-2xl mx-auto dropdiv"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileInput(e.dataTransfer.files);
        }}
        onChange={(e) => handleFileInput(e.target.files)}
      >
        <div className="mainDiv flex items-center justify-center w-full">
          {showCamera && (
            <>
              <video
                className="mr-16"
                ref={videoRef}
                width="360"
                autoPlay
              ></video>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={captureImage}
              >
                Capture
              </button>
            </>
          )}
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

          {imageUrl ? (
            <>
              <div className="flex flex-row  imadiv w-full p-1 md:p-2">
                <img
                  className=" uploaded-image block h-full w-full  object-cover object-center"
                  src={imageUrl}
                  alt={imageAltText}
                  style={{ backgroundColor }}
                />
              </div>
            </>
          ) : (
            showLabel &&
            !showCamera && (
              <label
                htmlFor="dropzone-file"
                className="  flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="m-10 flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-10 h-10 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    JPG,JPEG or PNG(MAX. 800x400px)
                  </p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" />
              </label>
            )
          )}
        </div>
      </div>
      {imageUrl && (
        <>
          <div className="flex flex-row ">
            <div className="mr-3 text-lg font-normal mb-3 text-gray-500 dark:text-gray-400">
              Background :
            </div>
            <div className="flex flex-row mt-1">
              {colors.map((color) => (
                <div
                  key={color}
                  onClick={() => setBackgroundColor(color)}
                  className="colorpiece"
                  style={{
                    backgroundColor: color,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-row ">
            <button
              className=" mr-10  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleImageSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span>Removing</span>
                  <svg
                    aria-hidden="true"
                    className="inline w-6 h-5 mr-2     ml-12 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </>
              ) : (
                "Remove Background"
              )}
            </button>
            <button
              onClick={handleDownloadWithNewBackground}
              className=" bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
            >
              <svg
                className="fill-current w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
              </svg>
              <span>Download</span>
            </button>
          </div>
        </>
      )}

      {imageAltText && imageAltText.startsWith("Error") && (
        <>
          <div
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong class="font-bold ">Error : </strong>
            <span class="block sm:inline">Selected file is not an IMAGE</span>
          </div>
        </>
      )}
    </div>
  );
}
