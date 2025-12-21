// icons
import AutoDeleteIcon from "@mui/icons-material/AutoDelete";
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";
// mui
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

// context
import { useSnackbar } from "./snackbarcontext";

import { useState, useEffect, useRef, forwardRef } from "react";
import { Activity } from "react";
import { Link } from "react-router-dom";
import "./cipher.css";

// component
import Historyrow from "./historyrow";
function History() {
  // sounds
  const successsound = useRef(new Audio("/success.mp3"));
  const errorsound = useRef(new Audio("/error.mp3"));
  // snackbar state and function
  const { snackbardata, opensnackbar, closesnackbar } = useSnackbar();
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    closesnackbar();
  };
  // dialog

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };
  // ===dialog===
  const [cryptohistory, setcryptohistory] = useState([]);
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("history")) || [];
    setcryptohistory(history);
  }, []);
  // clear history
  function clearhistory() {
    if (localStorage.length > 0) {
      localStorage.removeItem("history");
      setTimeout(() => {
        setcryptohistory([]);
      }, 500);
      opensnackbar("success", "success clearing", "5000");
      successsound.current.play();
    } else {
      opensnackbar("error", "history empety", "5000");
      errorsound.current.play();
    }
  }
  
  return (
    <div className="pageRoot">
      <div className="cardRoot">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <h1
            style={{
              display: "flex",
              gap: "5px",
              alignContent: "center",
              letterSpacing: "2px",
            }}
          >
            <HistoryIcon style={{ fontSize: "30px", marginTop: "4px" }} />
            History
          </h1>
          <Tooltip title="Home page">
            <Link style={{ textDecoration: "none" }} to={"/home"}>
              <button className="toggleBtn">
                <HomeIcon />
                HOME
              </button>
            </Link>
          </Tooltip>
        </div>
        <Activity mode={cryptohistory.length === 0 ? "visible" : "hidden"}>
          <p>is this no history</p>
        </Activity>
        <table className="historytable">
          <thead>
            <tr>
              <th>plain text</th>
              <th> crypro type</th>
              <th> key</th>
              <th> encode or decode</th>
              <th> cipher text </th>
              <th> Date</th>
              <th> time</th>
            </tr>
          </thead>
          <tbody>
            {cryptohistory.map((item) => (
              
              <Historyrow
                key={item.id}
                plaintext={item.plaintext}
                crypto_type={item.crypto_type}
                k={item.key}
                encodeordecode={item.encode_or_decode}
                ciphertext={item.ciphertext}
                time={item.created_at.split("T")[1].split(".")[0]}
                date={item.created_at.split("T")[0]}
              />
            ))}
          </tbody>
        </table>
        <div
          style={{
            padding: "5px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Tooltip title="clear all history">
            <button
              className="clearbtn"
              onClick={() => {
                handleClickOpen();
              }}
            >
              <AutoDeleteIcon />
              CLEAR
            </button>
          </Tooltip>
        </div>
      </div>
      <Snackbar
        open={snackbardata.open}
        autoHideDuration={snackbardata.time}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // center top
        TransitionProps={{ timeout: 500 }}
        sx={{ zIndex: 20000 }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbardata.type}
          variant="filled"
          elevation={6}
          sx={{
            width: "100%",
            borderRadius: "10px",
            fontSize: "18px",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.3)",
          }}
        >
          {snackbardata.content}
        </Alert>
      </Snackbar>
      {/* dialog */}
      <Dialog
        open={open}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"clear confirmation?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            are you sure ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>cancel</Button>
          <Button
            onClick={() => {
              clearhistory();
              handleCloseDialog();
            }}
          >
            confirm
          </Button>
        </DialogActions>
      </Dialog>
      {/* ===dialog=== */}
    </div>
  );
}

export default History;
