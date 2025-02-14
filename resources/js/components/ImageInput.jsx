import React, { useState, useRef } from "react";
import { ButtonBase } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

function ImageInput({ name,setValue,initialImagePath}) {
  const [selectedImage, setSelectedImage] = useState(initialImagePath);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file)); // Generate preview URL
      setValue((prevData) => ({
        ...prevData,
        [name]: file, // Update the corresponding field in `data`
    })); // Set the file in the form state
    }
  };
  console.log(selectedImage)

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <ButtonBase
      onClick={handleButtonClick}
      sx={{
        width: "70px",
        aspectRatio: "1 / 1",
        cursor: "pointer",
        backgroundImage: `url(${selectedImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid green",
        borderRadius:"3px",
        position: "relative",
      }}
    >
      <CloudUpload
        sx={{
          color: "white",
          ":hover": { transform: "scale(1.1)" },
        }}
      />
      <input
        ref={(e) => (fileInputRef.current = e)}
        name={name}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
    </ButtonBase>
  );
}

export default ImageInput;
