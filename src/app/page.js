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
  const [selectedVariants, setSelectedVariants] = useState([]);

  useEffect(() => {
    verImage();
  }, []);

  useEffect(() => {
    if (selectedVariants.length > 0) {
      const newVariant = selectedVariants.find((variant) => variant.includes(imgTamaño)) || selectedVariants[0];
      setImgSeleccionada(newVariant);
    }
  }, [imgTamaño]); 

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
    if (!files) return;

    const formData = new FormData();
    formData.append("file", files[0]);

    await axios.post("http://localhost:3080/images/upload", formData);
    verImage();
  };

  const handleOpen = (variants) => {
    if (!variants || variants.length === 0) return;
    setSelectedVariants(variants);
    const selectedVariant = variants.find((variant) => variant.includes(imgTamaño)) || variants[0];
    setImgSeleccionada(selectedVariant);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setImgSeleccionada("");
    setSelectedVariants([]);
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
        <Alert severity="info">Cargando imágenes...</Alert>
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
                    onClick={() => handleOpen(item.variants)}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          ) : (
            <p className="text-center">No hay imágenes disponibles</p>
          )}
        </div>
      )}

      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
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
                <MenuItem value={"small"}>250x250</MenuItem>
              </Select>
            </FormControl>
          </Toolbar>
        </AppBar>

        <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          {imgSeleccionada ? (
            <img src={imgSeleccionada} alt="Vista seleccionada" style={{ maxWidth: "100%", height: "auto" }} />
          ) : (
            <p className="text-center">No hay imagen seleccionada</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
