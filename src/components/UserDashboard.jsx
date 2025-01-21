import { useUserData } from "./custom-hooks/useUserData";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Close';
import { createTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import Snackbar from '@mui/material/Snackbar';
import { useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { UserModal } from "./UserModal";
import CloseIcon from '@mui/icons-material/Close';

const defaultTheme = createTheme();

const useStyles = makeStyles(
  (theme) => ({
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme.spacing(1),
      color: theme.palette.text.secondary,
    },
    textPrimary: {
      color: theme.palette.text.primary,
    },
  }),
  { defaultTheme },
);


function RowMenuCell(props, setShowToast) {
  const [open, setOpen] = useState(false);
  const { api, id, row } = props;
  const classes = useStyles();
  const [userData, setUserData] = useState({
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    department: row.department,
  });

  const changeHandler = e => {
    setUserData({...userData, [e.target.name]: e.target.value})
  }

  const handleEditClick = (event) => {
    event.stopPropagation();
    setOpen(true);
  };

  const handleSaveClick = (event) => {
    event.stopPropagation();
    setOpen(false);
    api.updateRows([{ id, _action: 'update', ...userData }]);
    setShowToast({showToast:true, message: `User ${id} updated`});
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    api.updateRows([{ id, _action: 'delete' }]);
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({
        userId: id,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
    setShowToast({showToast:true, message: `User ${id} deleted`});
  };

  const handleCancelClick = (event) => {
    event.stopPropagation();
    api.setRowMode(id, 'view');

    const row = api.getRow(id);
    if (row.isNew) {
      api.updateRows([{ id, _action: 'delete' }]);
    }
  };

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <div className={classes.root}>
      <IconButton
        color="inherit"
        className={classes.textPrimary}
        size="small"
        aria-label="edit"
        onClick={handleEditClick}
      >
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton
        color="inherit"
        size="small"
        aria-label="delete"
        onClick={handleDeleteClick}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
      <UserModal userData={userData} changeHandler={changeHandler} handleClose={handleClose} open={open} row={row} handleSaveClick={handleSaveClick} handleCancelClick={handleCancelClick}/>
    </div>
  );
}

RowMenuCell.propTypes = {
  api: PropTypes.object.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};



const paginationModel = { page: 0, pageSize: 5 };

export  const UserDashboard = () => {
  const [users, setUsers] = useUserData(`https://jsonplaceholder.typicode.com/users`);
  
  const [toast, setShowToast] = useState({
    showToast: false,
    message: 'Item Deleted'
  });
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    { field: 'email', headerName: 'Email', width: 230 },
    {
      field: 'fullName',
      headerName: 'Full name',
      sortable: true,
      width: 160,
      valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
    { field: 'department', headerName: 'Department', width: 230 },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (props) => RowMenuCell(props, setShowToast),
      sortable: false,
      width: 100,
      headerAlign: 'center',
      filterable: false,
      align: 'center',
      disableColumnMenu: true,
      disableReorder: true,
    },
  
  ];

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowToast({showToast:false});
  };

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <>
    <h1>User Dashboard</h1>
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={users}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal:'center' }}
        open={toast.showToast}
        autoHideDuration={2000}
        onClose={handleClose}
        message={toast.message}
        action={action}
      />
    </>
  );
}
