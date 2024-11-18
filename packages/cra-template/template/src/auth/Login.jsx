import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { Checkbox, FormControl, FormControlLabel } from "@mui/material";
import AlertMessage from "../common/AlertMessage"
import api from "../api/http-common";
import Button from '@mui/material/Button';
import {Paper} from "@mui/material";
import CryptoJS from "crypto-js";
import {useNavigate } from "react-router-dom";

export default function Login() {
    const [showPassword, setShowPassword] = React.useState(false);
    const Navigate = useNavigate();
    const [formValue, setFormValue] = useState({
        username: "",   
        password: "",
        checked: false,
      });

      const handleCheckboxChange = (event) => {
        const { checked } = event.target;
        setFormValue((prev) => ({ ...prev, checked }));
      };
      const handleAuthChange = (event, field) => {
        const { value } = event.target;
        setFormValue((prev) => ({
          ...prev,
          [field]: value, 
        }));
      };

console.log(formValue)
      useEffect(() => {
        
        
        const storedUsername = localStorage.getItem("username"); // get user name from the local storage
        const storedPassword = localStorage.getItem("password"); // get password from the local storage
        const username =storedUsername? CryptoJS.AES.decrypt(storedUsername, "usermanagement").toString(
          CryptoJS.enc.Utf8
        ):''
        const password = storedPassword?CryptoJS.AES.decrypt(storedPassword, "usermanagement").toString(
          CryptoJS.enc.Utf8
        ):''
        if (storedUsername && storedPassword) {
          //this condition check to username and password is present set the form value
          setFormValue({
            username: username,
            password: password,
            checked: true,
          });
        }
      }, []);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
  
    const handleMouseUpPassword = (event) => {
      event.preventDefault();
    };

    const handleFormSubmit = async (e) => {
      e.preventDefault();
      try {
        const userdata = {
          email: formValue.username,
          password: formValue.password,
        };
        console.log(userdata)
    
        const response = await api.post("login", userdata, {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        });
        console.log(response)
    
        const accessToken = response.data?.access;
    
        // Encrypt and store the access token
        const encAccess = CryptoJS.AES.encrypt(accessToken, "usermanagement").toString();
        sessionStorage.setItem("access", encAccess);
    
        // Store username and password in localStorage if "Remember Me" is checked
        if (formValue.checked) {
          const encLogin = CryptoJS.AES.encrypt(formValue.username, "usermanagement").toString();
          const encPassword = CryptoJS.AES.encrypt(formValue.password, "usermanagement").toString();
          localStorage.setItem("username", encLogin);
          localStorage.setItem("password", encPassword);
        }
    
        // Navigate to the user-management page
        Navigate("/user-management");
      } catch (error) {
        console.log(error)
        const errorMessage = error?.response?.data?.error || "An error occurred. Please try again.";
        AlertMessage(errorMessage, "error");
      }
    };
    
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '90vh',
        padding: 2,
      }}
    >
    <Paper 
        component={"form"}
        onSubmit={handleFormSubmit}
        sx={{
            backgroundColor:'white',
            width: { xs: '100%', sm: '80%', md: '60%', lg: '40%', xl: 550 },
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
        }}>
         <OutlinedInput 
         placeholder="UserName"
         sx={{ backgroundColor: 'white'}}
         value={formValue.username}
         startAdornment={
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          }
          onChange={(event) =>handleAuthChange(event,'username')}
          />
          <OutlinedInput placeholder="password"  
          id="outlined-adornment-Password"
          type={showPassword ? 'text' : 'password'}
          value={formValue.password}
          onChange={(event) =>handleAuthChange(event,'password')}
          startAdornment={
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
            <IconButton
              aria-label={
                showPassword ? 'hide the password' : 'display the password'
              }
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              onMouseUp={handleMouseUpPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
          }
          />
           <FormControl >
      <FormControlLabel
        checked={formValue?.checked}
        control={
          <Checkbox
          onChange={handleCheckboxChange}
          />
        }
        label={"Remember Me"}
        labelPlacement={"end"}
      />
    </FormControl>
    <Button variant="contained" type={"submit"}>Log in </Button>
    </Paper>
    </Box>
  )
}
