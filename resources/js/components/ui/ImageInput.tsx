import React, { useState, useRef } from "react";
import { ButtonBase } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

type FormDataType = Record<string, any>;

type ImageInputProps = {
  name: string;
  setValue: React.Dispatch<React.SetStateAction<FormDataType>>;
  initialImagePath?: string;
};

function ImageInput({
  name,
  setValue,
  initialImagePath,
}: ImageInputProps) {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    initialImagePath
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // ✅ FIX: safe access

    if (!file) return;

    // Preview
    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(previewUrl);

    // Update form state
    setValue((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click(); // ✅ cleaner
  };

  return (
    <ButtonBase
      onClick={handleButtonClick}
      sx={{
        width: "70px",
        aspectRatio: "1 / 1",
        cursor: "pointer",
        backgroundImage: selectedImage
          ? `url(${selectedImage})`
          : "none",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid green",
        borderRadius: "3px",
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
        ref={fileInputRef}
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