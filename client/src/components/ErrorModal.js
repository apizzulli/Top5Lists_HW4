import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AuthContext, { AuthContextProvider } from '../auth'
import { GlobalStoreContext } from '../store'
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
  let error="";
  let title="";
  let content="";
  let buttons;
  let show=false;

  const { auth } = useContext(AuthContext);
  const {store} = useContext(GlobalStoreContext);

  if(auth.errorToDisplay){
    show = true;
    content = auth.errorToDisplay;
    title="Error";
  }else{
    show=false;
  }
  if(store.listMarkedForDeletion){
    show=true;
    title="Delete List";
    content="Are you sure you want to delete the " + store.listMarkedForDeletion.name + " Top 5 List?";
  }

  const handleClose=function(){
    auth.hideError();
  }
  const handleCloseDelete=function(){
    store.unmarkListForDeletion();
  }
  const handleDelete=function(){
    store.deleteList(store.listMarkedForDeletion);
  }
  
  if(store.listMarkedForDeletion){
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
              {title}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {content}<br></br><br></br>
              <Button class="close-button-modal" variant="contained" onClick={handleCloseDelete}>Cancel</Button>
              <Button class="close-button-modal" variant="contained" onClick={handleDelete}>Delete</Button>
            </Typography>
          </Box>
        </Modal>
      </div>
    );
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
            {title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {content}<br></br><br></br>
            <Button class="close-button-modal" variant="contained" onClick={handleClose}>Close</Button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
  
}
