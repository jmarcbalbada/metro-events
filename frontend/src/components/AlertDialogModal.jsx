import React, { useState } from "react";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import Typography from "@mui/material/Typography";

const AlertDialogModal = ({ onCancel }) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    console.log(reason);
    if (onCancel) {
      onCancel(reason);
    }
    setOpen(false);
    setReason("");
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        color="danger"
        endDecorator={<DeleteForeverIcon />}
        onClick={handleClickOpen}
      >
        Cancel
      </Button>
      <Modal open={open} onClose={handleClose}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon />
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>
            <DialogContentText>
              Please provide a reason for canceling the event:
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="reason"
              label="Reason"
              type="text"
              fullWidth
              value={reason}
              onChange={handleReasonChange}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="solid"
              color="danger"
              onClick={handleConfirm}
              style={{ color: "white" }}
            >
              Confirm
            </Button>
            <Button variant="plain" color="neutral" onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
};

export default AlertDialogModal;
