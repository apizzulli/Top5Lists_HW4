import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AuthContext, { AuthContextProvider } from '../auth'
import { useContext } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  fontWeight: "10000px",
  p: 4,
};

export default function ErrorModal() {
  let error;
  let show=false;

  const { auth } = useContext(AuthContext);
  if(auth.errorToDisplay){
    show = true;
    error = auth.errorToDisplay;
  }else{
    show=false;
  }

  const handleClose=function(){
    auth.hideError();
  }
  return (
     <div >
       <Modal
         open={show}
         id={"error-modal"}
         aria-labelledby="modal-modal-title"
         aria-describedby="modal-modal-description"
       >
         <Box sx={style} >
           <Typography id="modal-modal-title" variant="h6" component="h2" fontWeight="500px">
             Error
           </Typography>
           <Typography id="modal-modal-description" sx={{ mt: 2 }}>
             {error}<br></br><br></br>
             <Button class="close-button-modal" variant="contained" onClick={handleClose}>Close</Button>
           </Typography>
         </Box>
       </Modal>
     </div>
   );
}
