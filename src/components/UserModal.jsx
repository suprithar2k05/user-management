import { useState } from "react";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

export const UserModal = ({open, userData, changeHandler, handleClose, row = {}, handleSaveClick}) => {
  
  const {firstName, lastName, email, department} = userData;

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit User Details
          </Typography>
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="first-name">First Name</InputLabel>
            <OutlinedInput
              id="first-name"
              label="firstName"
              value={firstName}
              name="firstName"
              onChange={changeHandler}
            />
        </FormControl>
        <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="last-name">Last Name</InputLabel>
            <OutlinedInput
              id="first-name"
              label="lastName"
              value={lastName}
              name="lastName"
              onChange={changeHandler}
            />
        </FormControl>
        <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput
              id="email" 
              value={email}
              name="email"
              label="email"
              onChange={changeHandler}
            />
        </FormControl>
        <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="department">Department</InputLabel>
            <OutlinedInput
              id="department"
              label="department"
              value={department}
              name="department"
              onChange={changeHandler}
            />
        </FormControl>
          <Button variant="contained" color="success" onClick={handleSaveClick}>Save</Button>
        </Box>
      </Modal>
  )
}