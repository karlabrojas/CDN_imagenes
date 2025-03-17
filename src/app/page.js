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

  const verImage = async () => {
    try {
      const result = await axios.get("http://localhost:3080/images/get");
      console.log("Respuesta del backend:", result.data);
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
    if (!files) {
      alert("Selecciona una imagen");
      return;
    }

    const formData = new FormData();
    formData.append("file", files[0]);

    await axios.post("http://localhost:3080/images/upload", formData);
    verImage();
  };

  const handleOpen = (variants) => {
    if (!variants || variants.length === 0) return;
    setSelectedVariants(variants);
    const selectedVariant = variants.find((variant) => variant.includes(imgTamaño));
    setImgSeleccionada(selectedVariant || variants[0]); // Si no encuentra la variante, usa la primera
    setOpen(true);
  };

  useEffect(() => {
    if (open && selectedVariants.length > 0) {
      const selectedVariant = selectedVariants.find((variant) => variant.includes(imgTamaño));
      setImgSeleccionada(selectedVariant || selectedVariants[0]);
    }
  }, [imgTamaño]);

  const handleClose = () => {
    setOpen(false);
    setImgSeleccionada(""); // Aseguramos que la imagen seleccionada se reinicie
    setSelectedVariants([]); // También vaciamos la lista de variantes seleccionadas
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
        <p className="text-center mt-10">Cargando imágenes...</p>
      ) : (
        <div className="mt-20">
          {postImg.length > 0 ? (
            <ImageList sx={{ width: "100%", height: 850 }} cols={4} gap={10}>
              {postImg.map((item) => (
                <ImageListItem key={item.id}>
                  <img
                    src={item.variants.find((variant) => variant.includes(imgTamaño))}
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
        <AppBar >
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="select-label">Tamaño</InputLabel>
          <Select labelId="select-label" id="select" value={imgTamaño} label="Tamaño" onChange={seleccionar}>
            <MenuItem value="public">750x750</MenuItem>
            <MenuItem value="medium">500x500</MenuItem>
          </Select>
        </FormControl>
          </Toolbar>
        </AppBar>

        <DialogContent>
          {imgSeleccionada ? (
            <img src={imgSeleccionada} alt="Vista seleccionada" style={{ width: "500px", height: "500px" }} />
          ) : (
            <p className="text-center">No hay imagen seleccionada</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}






// const itemData = [
//   {
//     img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
//     title: 'Breakfast',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
//     title: 'Burger',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
//     title: 'Camera',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
//     title: 'Coffee',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
//     title: 'Hats',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
//     title: 'Honey',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
//     title: 'Basketball',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
//     title: 'Fern',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
//     title: 'Mushrooms',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
//     title: 'Tomato basil',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
//     title: 'Sea star',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
//     title: 'Bike',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
//     title: 'Tomato basil',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
//     title: 'Sea star',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
//     title: 'Bike',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
//     title: 'Tomato basil',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
//     title: 'Sea star',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
//     title: 'Bike',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
//     title: 'Tomato basil',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
//     title: 'Sea star',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
//     title: 'Bike',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
//     title: 'Tomato basil',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
//     title: 'Sea star',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
//     title: 'Bike',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
//     title: 'Tomato basil',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
//     title: 'Sea star',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
//     title: 'Bike',
//   }, {
//     img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
//     title: 'Tomato basil',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
//     title: 'Sea star',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
//     title: 'Bike',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
//     title: 'Tomato basil',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
//     title: 'Sea star',
//   },
//   {
//     img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
//     title: 'Bike',
//   },
// ];