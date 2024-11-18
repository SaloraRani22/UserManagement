import React,{useState} from 'react'
import logout from '../assets/logout.png'
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Logout from '../auth/Logout'

export default function Appbar() {
  const [logoutbtn,setlogoutbtn]=useState(false);
  return (
    <Box sx={{ flexGrow: 1 }}>
    <AppBar sx={{backgroundColor:`var(--primary-appbar-color)`}}>
      <Toolbar >
      <Box
        sx={{
            flexGrow: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: {  xs: 'flex-end', sm: 'flex-end', md: 'flex-end', lg: 'flex-end' }, // Adjust alignment
          width: '100%',
          gap:5
        }}
      >
      <Box sx={{color:'white',fontSize:22}}>Elon Musk</Box>
      <IconButton onClick={()=>setlogoutbtn(true)}>
      <img src={logout} alt="Logout"   style={{ width: 50, height: 50,backgroundColor:'white',borderRadius:20 }} />
      </IconButton>
      </Box>
      </Toolbar>
    </AppBar>
    {logoutbtn?<Logout/>:null}
  </Box>
  )
}
