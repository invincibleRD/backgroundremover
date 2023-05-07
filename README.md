# Image Background Remover

This is a web application for removing background from images using AI. Users can either upload an image or take a picture using their device camera and have the background removed. The application uses the remove.bg API to remove the background from the image.

## Technologies Used

- React
- axios
- html2canvas

## Installation and Setup

1. Clone the repository
2. Install dependencies by running `npm install`
3. Start the application by running `npm run dev`
4. Open your browser and go to `http://localhost:3000/`

## Usage

1. Click on the "Upload Image" button to upload an image from your device
2. Click on the "Open Camera" button to take a picture using your device camera
3. Click on the "Remove Background" button to remove the background from the image
4. Once the background has been removed, click on the "Download with new Background" button to download the image with a new background color
5. The color of the new background can be changed by selecting from the list of available colors
6. Users can also drag and drop an image onto the drop area to upload it

## Limitations

- The application requires an internet connection to use the remove.bg API

## Contributing

Contributions to the project are welcome. Please fork the repository, create a new branch, make your changes, and submit a pull request.
