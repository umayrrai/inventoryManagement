"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { fireStore } from "../firebase";
import {
  Box,
  Modal,
  Stack,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc} from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [item, setItemName] = useState("");
  const [searchTerm, setSearch] = useState("");

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateInventory = async () => {
    const snapshot = query(collection(fireStore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  // ADD Item
  const addItem = async (item) => {
    const docRef = doc(collection(fireStore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  // REMOVE Item
  const removeItem = async (item) => {
    const docRef = doc(collection(fireStore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity == 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  // new function
  const removeWholeStack = async (item) => {
    const docRef = doc(collection(fireStore, "inventory"), item);
    await deleteDoc(docRef);
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width="400px"
          bgcolor="background.paper"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={2}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={item}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(item);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button
        variant="contained"
        onClick={() => {
          handleOpen();
        }}
      >
        Add New Item
      </Button>

      <TextField
        variant="outlined"
        placeholder="Search Item: "
        value={searchTerm}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{
          marginBottom: 2,
          backgroundColor: "#fff", // set background to white
          borderRadius: 1,
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#fff", // set border color to white
            },
            "&:hover fieldset": {
              borderColor: "#fff", // set border color to white on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "#fff", // set border color to white when focused
            },
          },
          input: {
            color: "#000", // set text color to black
          },
        }}
      />

      <Box border="1px solid #333">
        <Box
          width="800px"
          height="100px"
          bgcolor="#f0f0f0"
          display="flex"
          justifyContent="center"
          alignItems="center"
          padding={2}
          gap={2}
        >
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
          {/* search bar here */}
          
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%" 
              minHeight="150px"
              bgcolor="#f0f0f0"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              padding={5}
            >
              <Typography variant="h3" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>

              <Typography variant="h3" color="#333" textAlign="center">
                {quantity}
              </Typography>

              <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={() => addItem(name)}>
                Add 1
              </Button>

              <Button variant="contained" onClick={() => removeItem(name)}>
                Remove 1
              </Button>

              {/* ADD this new button */}
              <Button 
                variant="contained" 
                color="error" 
                onClick={() => removeWholeStack(name)}
              >
                Remove All
              </Button>

              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}