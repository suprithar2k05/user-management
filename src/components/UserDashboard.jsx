import { useUserData } from "./custom-hooks/useUserData";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import { createTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import Snackbar from '@mui/material/Snackbar';
import { useState } from "react";
import Button from '@mui/material/Button';
import { UserModal } from "./UserModal";
import CloseIcon from '@mui/icons-material/Close';

const defaultTheme = createTheme();
const INITIAL_USER_DATA =  {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
}
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

function postUserDetails(newId, id, setShowToast) {
  fetch(`https://jsonplaceholder.typicode.com/users`, {
    method: 'POST',
    body: JSON.stringify({
      userId: newId||id,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then(res => {
    if(res.status == '201') {
      setShowToast({showToast:true, message: `User ${newId|| id} ${newId? 'created': 'updated'}`});
    } else {
      setShowToast({showToast:true, message: `User ${newId|| id} ${newId? 'creation': 'updation'} failed`});
    }
  })
}

function RowMenuCell({props, setShowToast, userData, setUserData, open, setOpen, isNew, setIsNew, error, setError}) {
  const { api, id, row } = props;
  const classes = useStyles();
  const changeHandler = e => {
    setUserData({...userData, [e.target.name]: e.target.value});
    setError({
      ...error,
      [e.target.name]: '',
    })
  }

  const handleEditClick = (event) => {
    setUserData({
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      department: row.department,
    });
    event.stopPropagation();
    setOpen(true);
    setIsNew(false);
  };

  const handleSaveClick = (event) => {
    event.stopPropagation();
    let isError = false;
    const errorLabels = INITIAL_USER_DATA;
    const {firstName, lastName, email, department} = userData;
    if(!firstName) {
      errorLabels.firstName = 'firstname is required'
      isError = true;
    }
    if(!lastName) {
      errorLabels.lastName = 'lastname is required'
      isError = true;
    }
    if(!department) {
      errorLabels.department= 'department is required'
      isError = true;
    }
    setError(errorLabels);
    if(!email) { 
      errorLabels.email = 'email is required'
      isError = true;
    }

    if(!isError) {
      if(isNew) {
        const newId = api.getAllRowIds().length + 1;
        api.updateRows([{ id: newId, ...userData }]);
        
        postUserDetails(newId, id, setShowToast)
        setOpen(false);
        return;
      }
      api.updateRows([{ id, _action: 'update', ...userData }]);
      setOpen(false);
      postUserDetails('', id, setShowToast);
    }
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
    }).then(res => {
      setShowToast({showToast:true, message: `User ${id} deleted`});
    })
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
      <UserModal error={error} setError={setError} isNew={isNew} userData={userData} changeHandler={changeHandler} handleClose={handleClose} open={open} row={row} handleSaveClick={handleSaveClick} handleCancelClick={handleCancelClick}/>
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
  
  const [isNew, setIsNew] = useState(false);
  const [userData, setUserData] = useState(INITIAL_USER_DATA);

  const [error, setError] = useState(INITIAL_USER_DATA)

  const [open, setOpen] = useState(false);

  const [toast, setShowToast] = useState({
    showToast: false,
    message: ''
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
      renderCell: (props) => {
        const options = {
          props, setShowToast, userData, setUserData, open, setOpen, isNew,setIsNew, setUsers, users, error, setError
        }
        return RowMenuCell(options)
      },
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

  const addUserHandler = () => {
    setOpen(true);
    setUserData({
      firstName: '',
      lastName: '',
      email: '',
      department: '',
    });
    setIsNew(true);
    setError({
      firstName: '', 
      lastName: '', 
      department: '', 
      email: '', 
    })
  }

  const saveUserHandler = () => {
    setUsers([userData, ...users]);
  }

  return (
    <>
    <h1>User Dashboard</h1>
    <Button onClick={addUserHandler} variant="outlined" startIcon={<AddIcon />}>
      Add User
    </Button>
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
