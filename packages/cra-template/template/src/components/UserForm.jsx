import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Box} from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import { UserFields } from '../common/ArrayHelper';
import { updateUser,addUser } from '../api/common-api';
import { useDispatch, useSelector } from 'react-redux';
import AlertMessage from '../common/AlertMessage'

export default function UserForm({ action,data,setOpen}) {
    const InitialValue={
        first_name: '',
        last_name: '',
        email: '',
        avatar: '',
      }
  const [formValue, setFormValue] = useState(action=='create'?InitialValue:data);
  const { user: { data: error} } = useSelector(state => state);
  const dispatch = useDispatch();
  const [formErrors, setFormErrors] = useState({});
  const handleCancel = () =>{
    setFormValue(InitialValue);
    setFormErrors({});
  }
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let error = "";
    if(name =='first_name'|| name=='last_name'){
        if (/[^a-zA-Z]/.test(value)) {
            error = "Only Alphabets Are Allowed, No Underscores.";
          } else if (value.length < 1) {
            error = " At Least 1 Characters needed.";
          } else if (value.length > 30) {
            error = "Cannot Exceed 30 Characters.";
          }
    }
        else if(name =='email'){
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                error = "Please Enter A Valid Email Address.";
            }
        }
        else if(name =='avatar'){
            const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w.-]*)*\/?$/;
            if (value && !urlPattern.test(value)) {
             error = "Please Enter A Valid Website URL.";
            }
        }

    setFormValue((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({...prev,[name]: error}));
  };

  const isFormValid = () => {
    const hasErrors = Object.values(formErrors).some((error) => error !== '');
    const hasEmptyFields = Object.values(formValue).some((value) => value === '');
    return !hasErrors && !hasEmptyFields;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpen(false);
    console.log(formValue)
    if (action === 'create') {
        await dispatch(addUser(formValue));
    } else {
      const data = {
        id: formValue.id,
        userData: {
          first_name: formValue.first_name,
          last_name: formValue.last_name,
          email: formValue.email,
          avatar: formValue.avatar,
        },
      };
      await dispatch(updateUser(data))  
      .then((action) => {
        if (action.type.endsWith('/fulfilled')) {
          console.log('Update successful:', action.payload);
        } else if (action.type.endsWith('/rejected')) {
          console.error('Update failed:', action.error.message);
        }
      });
    }
    // Ensure the error is in JSON format or a defined boolean
    if (typeof error === 'boolean' && error) {
        AlertMessage(
            action === 'create' ? "User creation failed" : "User update failed",
            "error",
            "Kindly contact admin."
        );
    } else {
        AlertMessage(
            action === 'create' ? "User created successfully" : "User updated successfully",
            "success",
            "Operation completed."
        );
    }

    // Reset form and close the modal
};

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {UserFields.map((field, index) => (
          <Grid item xs={12} key={index}>
            <InputLabel sx={{display:'flex',gap:1}}>{field.required?<Box sx={{color:'red'}}>*</Box>:<Box> </Box>}{field.label}</InputLabel>
            <TextField
              fullWidth
              type={field.type}
              required={field.required}
              name={field.name}
              value={formValue[field.name]}
              onChange={handleInputChange}
              placeholder={`Please enter ${field.label.toLowerCase()}`}
              variant="outlined"
            />
            {formErrors[field.name] && (
                <span style={{ color: "red" }} className="error-message">
                  {formErrors[field.name]}
                </span>
              )}
          </Grid>
        ))}
        <Grid item xs={12} sx={{display: 'flex',
           alignItems: 'center',
           gap:2,
           justifyContent: {  xs: 'flex-end', sm: 'flex-end', md: 'flex-end', lg: 'flex-end' },}}>
            <Button type="submit" variant="contained" sx={{backgroundColor:'white',color:'#1976d2'}} onClick={handleCancel} >
            cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={!isFormValid()} >
            submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
