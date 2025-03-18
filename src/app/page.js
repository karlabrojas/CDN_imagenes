"use client";
import React, { useState, useEffect } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Toolbar from "@mui/material/Toolbar";
import Slide from "@mui/material/Slide";
import Alert from '@mui/material/Alert';

export default function Home() {
  const [postImg, setPostImg] = useState([]);
  const [imgSeleccionada, setImgSeleccionada] = useState("");
  const [imgTamaño, setImgTamaño] = useState("medium");
  const [carga, setCarga] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    verImage();
  }, []);

  const verImage = async () => {
    try {
      const result = await axios.get("http://localhost:3080/images/get");
      setPostImg(result.data.result.images || []);
    } catch (error) {
      console.error("Error obteniendo imágenes:", error);
    } finally {
      setCarga(false);
    }
  };

  const seleccionar = (event) => {
    setImgTamaño(event.target.value);
  };

  const uploadImage = async (files) => {

    const formData = new FormData();
    formData.append("file", files[0]);

    await axios.post("http://localhost:3080/images/upload", formData);
    verImage();
  };

  const handleOpen = (imgsrc) => {
    setImgSeleccionada(imgsrc);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setImgSeleccionada("");
  };

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const getImageSize = (size) => {
    switch (size) {
      case "public":
        return { width: "750px", height: "750px" };
      case "medium":
        return { width: "500px", height: "500px" };
      default:
        return { width: "500px", height: "500px" };
    }
  };

  return (
    <div>
      <div className="mt-5 bg-teal-400 h-20 content-center">
        <h1 className="text-white text-center text-4xl font-semibold font-mono">
          Galería de imágenes - KBRR
        </h1>
      </div>

      <div className="w-full flex justify-center content-center h-15 mt-10">
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
          Subir imagen
          <VisuallyHiddenInput type="file" onChange={(event) => uploadImage(event.target.files)} multiple />
        </Button>
      </div>

      {carga ? (
        <Alert severity="info">Cargando imágenes</Alert>
      ) : (
        <div className="mt-20 flex justify-center content-center">
          {postImg.length > 0 ? (
            <ImageList sx={{ width: "80%", height: 850 }} cols={4} gap={10}>
              {postImg.map((item) => (
                <ImageListItem key={item.id}>
                  <img
                    src={item.variants.find((variant) => variant.includes("small"))}
                    alt={item.id}
                    style={{ width: "250px", height: "250px", cursor: "pointer" }}
                    onClick={() => handleOpen(item.variants.find((variant) => variant.includes(imgTamaño)))}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          ) : (
            <p className="text-center">No hay imágenes disponibles</p>
          )}
        </div>
      )}

      <Dialog fullScreen open={open} onClose={handleClose}>
        <AppBar>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <FormControl required sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="select-label">Tamaño</InputLabel>
              <Select labelId="select-label" id="select" value={imgTamaño} label="Tamaño" onChange={seleccionar}>
                <MenuItem value={"public"}>750x750</MenuItem>
                <MenuItem value={"medium"}>500x500</MenuItem>
              </Select>
            </FormControl>
          </Toolbar>
        </AppBar>

        <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <img
            src={imgSeleccionada || null}
            alt="Vista seleccionada"
            style={getImageSize(imgTamaño)} // Aquí aplicamos el tamaño dinámico
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}