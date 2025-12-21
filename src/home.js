// mui
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
// icons
import KeyIcon from "@mui/icons-material/Key";
import KeyOffIcon from "@mui/icons-material/KeyOff";
import HistoryIcon from "@mui/icons-material/History";
//
// usecontext
import { useSnackbar } from "./snackbarcontext";

import DynamicInput from "./dynamicInput";
import "./cipher.css";
// hooks
import { useState, useRef, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
export default function Home() {
  // sounds
  const successsound = useRef(new Audio("/success.mp3"));
  const errorsound = useRef(new Audio("/error.mp3"));

  // data cipher
  const [cipherInputs, setCipherInputs] = useState({
    text: "",
    cryptography_type: "1",
    encryption_decryption: "0",
    a: "",
    b: "",
  });
  // result
  const [result, setResult] = useState("");
  // type of result
  const [resulttype, setresulttype] = useState("success");

  // change any state
  function setanystate(name, value) {
    setCipherInputs({ ...cipherInputs, [name]: value });
  }

  // all input
  const inputs = [
    { key: "1", label: "text", name: "text", inputtype: "text" },
    { key: "2", label: "a", name: "a", inputtype: "number" },
    { key: "3", label: "b", name: "b", inputtype: "number" },
    { key: "4", label: "key", name: "key", inputtype: "text" },
  ];

  const mappingInputs = inputs.map((i) => {
    const type = cipherInputs.cryptography_type;

    // Affine: show text, a, b
    if (type === "3" && ["text", "a", "b"].includes(i.label)) {
      return (
        <DynamicInput
          key={i.key}
          label={i.label}
          name={i.name}
          inputtype={i.inputtype}
          value={cipherInputs}
          changevalueevent={setanystate}
        />
      );
    }

    // Caesar + Vigenere: show text + key
    if ((type === "1" || type === "2") && ["text", "key"].includes(i.label)) {
      return (
        <DynamicInput
          key={i.key}
          label={i.label}
          name={i.name}
          inputtype={i.inputtype}
          value={cipherInputs}
          changevalueevent={setanystate}
        />
      );
    }

    return null; // 🔥 FIXED: return something always
  });

  // snackbar state and function
  const { snackbardata, opensnackbar, closesnackbar } = useSnackbar();
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    closesnackbar();
  };

  // handel affine cipher

  // ensure the GCD
  function isValidKey(a) {
    function gcd(x, y) {
      if (y === 0) return x;
      return gcd(y, x % y);
    }

    return gcd(a, 26) === 1;
  }
  // ===ensure the GCD===
  // get modular mulltiplication inverse of a
  function getmodularinversemultiplucation(a, m) {
    a = a % m;
    for (let n = 1; n < m; n++) {
      if ((n * a) % 26 === 1) return n;
    }
    return null;
  }
  // ===get modular mulltiplication inverse of a===
  function affineEncription() {
    if (!isValidKey(cipherInputs.a)) {
      opensnackbar(
        "error",
        `"a" not achive "GCD" test please change it `,
        "7000"
      );
      errorsound.current.play();
      setResult("");
      setresulttype("warning");
      return;
    }
    const plaintext = cipherInputs.text;
    let c = "";
    let result = "";
    for (let n = 0; n < plaintext.length; n++) {
      if (
        plaintext[n].charCodeAt(0) >= 65 &&
        plaintext[n].charCodeAt(0) <= 90
      ) {
        c =
          ((plaintext[n].charCodeAt(0) - 65) * Number(cipherInputs.a) +
            Number(cipherInputs.b)) %
          26;
        if (c < 0) c += 26;
        result += String.fromCharCode(c + 65);
      } else if (
        plaintext[n].charCodeAt(0) >= 97 &&
        plaintext[n].charCodeAt(0) <= 122
      ) {
        c =
          ((plaintext[n].charCodeAt(0) - 97) * Number(cipherInputs.a) +
            Number(cipherInputs.b)) %
          26;
        if (c < 0) c += 26;
        result += String.fromCharCode(c + 97);
      } else {
        result += plaintext[n];
      }
    }
    const historydata = JSON.parse(localStorage.getItem("history")) || [];

    const newone = {
      id: Date.now(),
      plaintext: cipherInputs.text,
      key: { a: cipherInputs.a, b: cipherInputs.b },
      crypto_type: "affine cipher",
      encode_or_decode:
        cipherInputs.encryption_decryption === "0" ? "encode" : "decode",
      ciphertext: result,
      created_at: new Date().toISOString(),
    };
    historydata.push(newone);
    localStorage.setItem("history", JSON.stringify(historydata));
    setresulttype("success");
    setResult(result);
    opensnackbar("success", "successfull encoding", "5000");
    successsound.current.play();
  }

  function affineDecription() {
    if (!isValidKey(cipherInputs.a)) {
      setResult("");
      setresulttype("warning");
      opensnackbar(
        "error",
        `"a" not achive "GCD" test please change it `,
        "7000"
      );
      errorsound.current.play();
      return;
    }

    // the code
    // p=(a_inverse*(c-b))%26
    let plaintext_result = "";
    const ciphertext = cipherInputs.text;
    const a = cipherInputs.a;
    const b = cipherInputs.b;

    const a_modular_inverse = getmodularinversemultiplucation(a, 26);

    for (let n = 0; n < ciphertext.length; n++) {
      let c = ciphertext[n].charCodeAt(0);
      if (c >= 65 && c <= 90) {
        c -= 65;
        let res = ((a_modular_inverse * (c - b + 26)) % 26) % 26;
        if (res < 0) res += 26;
        res += 65;
        let final = String.fromCharCode(res);
        plaintext_result += final;
      } else if (c >= 97 && c <= 122) {
        c -= 97;
        let res = ((a_modular_inverse * (c - b + 26)) % 26) % 26;
        if (res < 0) res += 26;
        res += 97;
        let final = String.fromCharCode(res);
        plaintext_result += final;
      }
    }
    const historydata = JSON.parse(localStorage.getItem("history")) || [];

    const newone = {
      id: Date.now(),
      plaintext: plaintext_result,
      key: { a: cipherInputs.a, b: cipherInputs.b },
      crypto_type: "affine cipher",
      encode_or_decode:
        cipherInputs.encryption_decryption === "0" ? "encode" : "decode",
      ciphertext: cipherInputs.text,
      created_at: new Date().toISOString(),
    };
    historydata.push(newone);
    localStorage.setItem("history", JSON.stringify(historydata));
    setresulttype("success");
    setResult(plaintext_result);
    opensnackbar("success", "successfull decoding", "5000");
    successsound.current.play();
  }

  function handelaffinecipher() {
    if (!cipherInputs.text) {
      setresulttype("warning");
      setResult("");
    } else if (!cipherInputs.a || !cipherInputs.b) {
      opensnackbar("error", "a & b must be not empety", "5000");
      errorsound.current.play();
      setresulttype("warning");
      setResult("");
    } else {
      if (cipherInputs.encryption_decryption === "0") {
        affineEncription();
      } else {
        affineDecription();
      }
    }
  }

  // handel caesarcipher

  // encryption
  function caesaercipherencryption() {
    const caesar_plaintext = cipherInputs.text;
    const key = cipherInputs.key;
    let caesar_result = "";
    for (let n = 0; n < caesar_plaintext.length; n++) {
      if (
        caesar_plaintext[n].charCodeAt(0) >= 65 &&
        caesar_plaintext[n].charCodeAt(0) <= 90
      ) {
        let c = caesar_plaintext[n].charCodeAt(0) - 65;
        let cal = (c + Number(key)) % 26;
        cal += 65;
        caesar_result += String.fromCharCode(cal);
      } else if (
        caesar_plaintext[n].charCodeAt(0) >= 97 &&
        caesar_plaintext[n].charCodeAt(0) <= 122
      ) {
        let c = caesar_plaintext[n].charCodeAt(0) - 97;
        let cal = (c + Number(key)) % 26;
        cal += 97;
        caesar_result += String.fromCharCode(cal);
      } else {
        caesar_result += caesar_plaintext[n];
      }
    }

    const historydata = JSON.parse(localStorage.getItem("history")) || [];

    const newone = {
      id: Date.now(),
      plaintext: cipherInputs.text,
      key: { key: cipherInputs.key },
      crypto_type: "caesar cipher",
      encode_or_decode:
        cipherInputs.encryption_decryption === "0" ? "encode" : "decode",
      ciphertext: caesar_result,
      created_at: new Date().toISOString(),
    };
    historydata.push(newone);
    localStorage.setItem("history", JSON.stringify(historydata));
    setresulttype("success");
    setResult(caesar_result);

    opensnackbar("success", "successfull encoding", "5000");
    successsound.current.play();
  }

  // decryption
  function caesaercipherdecryption() {
    const caesar_ciphertext = cipherInputs.text;
    const key = cipherInputs.key;
    let caesar_result = "";

    for (let n = 0; n < caesar_ciphertext.length; n++) {
      if (
        caesar_ciphertext[n].charCodeAt(0) >= 65 &&
        caesar_ciphertext[n].charCodeAt(0) <= 90
      ) {
        let p = caesar_ciphertext[n].charCodeAt(0) - 65;
        let cal = (p - Number(key) + 26) % 26;

        cal += 65;
        caesar_result += String.fromCharCode(cal);
      } else if (
        caesar_ciphertext[n].charCodeAt(0) >= 97 &&
        caesar_ciphertext[n].charCodeAt(0) <= 122
      ) {
        let p = caesar_ciphertext[n].charCodeAt(0) - 97;
        let cal = (p - Number(key) + 26) % 26;

        cal += 97;
        caesar_result += String.fromCharCode(cal);
      } else {
        caesar_result += caesar_ciphertext[n];
      }
    }

    const historydata = JSON.parse(localStorage.getItem("history")) || [];

    const newone = {
      id: Date.now(),
      plaintext: caesar_result,
      key: { key: cipherInputs.key },
      crypto_type: "caesar cipher",
      encode_or_decode:
        cipherInputs.encryption_decryption === "0" ? "encode" : "decode",
      ciphertext: cipherInputs.text,
      created_at: new Date().toISOString(),
    };
    historydata.push(newone);
    localStorage.setItem("history", JSON.stringify(historydata));
    setresulttype("success");
    setResult(caesar_result);

    opensnackbar("success", "successfull decoding", "5000");
    successsound.current.play();
  }

  function handelcaesarcipher() {
    if (!cipherInputs.text) {
      setresulttype("warning");
      setResult("");
    } else if (!cipherInputs.key) {
      opensnackbar("error", "key is empety", "5000");
      errorsound.current.play();
    } else if (isNaN(Number(cipherInputs.key))) {
      opensnackbar("error", "key must be number", "5000");
      errorsound.current.play();
    } else {
      if (cipherInputs.encryption_decryption === "0") {
        caesaercipherencryption();
      } else {
        caesaercipherdecryption();
      }
    }
  }
  // ===handel caesarcipher===

  // handel vigenere cipher

  // vigenere encryption
  function vigenerecipherencryption() {
    const plaintext = cipherInputs.text;
    const key = cipherInputs.key.toUpperCase(); // convert key to uppercase
    let vigenereresult = "";
    let keyIndex = 0; // only increment for letters

    for (let n = 0; n < plaintext.length; n++) {
      const char = plaintext[n];
      if (char >= "A" && char <= "Z") {
        let p = char.charCodeAt(0) - 65;
        let k = key[keyIndex % key.length].charCodeAt(0) - 65;
        let r = (p + k) % 26;
        vigenereresult += String.fromCharCode(r + 65);
        keyIndex++;
      } else if (char >= "a" && char <= "z") {
        let p = char.charCodeAt(0) - 97;
        let k = key[keyIndex % key.length].charCodeAt(0) - 65;
        let r = (p + k) % 26;
        vigenereresult += String.fromCharCode(r + 97);
        keyIndex++;
      } else {
        vigenereresult += char; // non-letter characters remain unchanged
      }
    }
    const historydata = JSON.parse(localStorage.getItem("history")) || [];

    const newone = {
      id: Date.now(),
      plaintext: cipherInputs.text,
      key: { key: cipherInputs.key },
      crypto_type: "vigener cipher",
      encode_or_decode:
        cipherInputs.encryption_decryption === "0" ? "encode" : "decode",
      ciphertext: vigenereresult,
      created_at: new Date().toISOString(),
    };
    historydata.push(newone);
    localStorage.setItem("history", JSON.stringify(historydata));
    opensnackbar("success", "successful encoding", "5000");
    successsound.current.play();
    setresulttype("success");
    setResult(vigenereresult);
  }

  // vigenere decryption
  function vigenerecipherdecryption() {
    const ciphertext = cipherInputs.text;
    const key = cipherInputs.key.toUpperCase(); // convert key to uppercase
    let vigenereresult = "";
    let keyIndex = 0; // only increment for letters

    for (let n = 0; n < ciphertext.length; n++) {
      const char = ciphertext[n];
      if (char >= "A" && char <= "Z") {
        let p = char.charCodeAt(0) - 65;
        let k = key[keyIndex % key.length].charCodeAt(0) - 65;
        let r = (p - k) % 26;
        if (r < 0) r += 26;
        vigenereresult += String.fromCharCode(r + 65);
        keyIndex++;
      } else if (char >= "a" && char <= "z") {
        let p = char.charCodeAt(0) - 97;
        let k = key[keyIndex % key.length].charCodeAt(0) - 65;
        let r = (p - k) % 26;
        if (r < 0) r += 26;
        vigenereresult += String.fromCharCode(r + 97);
        keyIndex++;
      } else {
        vigenereresult += char; // non-letter characters remain unchanged
      }
    }

    const historydata = JSON.parse(localStorage.getItem("history")) || [];

    const newone = {
      id: Date.now(),
      plaintext: vigenereresult,
      key: { key: cipherInputs.key },
      crypto_type: "vigenere cipher",
      encode_or_decode:
        cipherInputs.encryption_decryption === "0" ? "encode" : "decode",
      ciphertext: cipherInputs.text,
      created_at: new Date().toISOString(),
    };
    historydata.push(newone);
    localStorage.setItem("history", JSON.stringify(historydata));
    opensnackbar("success", "successful decoding", "5000");
    successsound.current.play();
    setresulttype("success");
    setResult(vigenereresult);
  }
  function handelvigenerecipher() {
    if (!cipherInputs.text) {
      setresulttype("warning");
      setResult("");
    } else if (!cipherInputs.key) {
      opensnackbar("error", "key is empety", "5000");
      errorsound.current.play();
    } else if (!isNaN(Number(cipherInputs.key))) {
      opensnackbar("error", "key must be text", "5000");
      errorsound.current.play();
    } else {
      if (cipherInputs.encryption_decryption === "0") {
        vigenerecipherencryption();
      } else {
        vigenerecipherdecryption();
      }
    }
  }
  // ===handel vigenere cipher===

  // routing to selected cryptography
  function routing_cryptography() {
    if (cipherInputs.cryptography_type === "3") {
      handelaffinecipher();
    } else if (cipherInputs.cryptography_type === "1") {
      handelcaesarcipher();
    } else if (cipherInputs.cryptography_type === "2") {
      handelvigenerecipher();
    }
  }
  // ===routing to selected cryptography===

  return (
    <div className="pageRoot">
      <div className="cardRoot">
        <header className="cardHeader">
          <div>
            <h1 style={{ letterSpacing: "1px" }}>DMT Crypto Engine</h1>
            <p className="subtitle">
              Easy demos for Caesar &amp; Affine ciphers &amp; VIGENERE CIPHER
            </p>
          </div>
          <div>
            <Tooltip title="history page">
              <Link
                to={"/home/history"}
                style={{
                  textDecoration: "none",
                }}
              >
                <button className="toggleBtn">
                  History <HistoryIcon style={{marginTop:"3px"}} />
                </button>
              </Link>
            </Tooltip>
          </div>
        </header>

        <main className="cardBody">
          <div className="inputsColumn">{mappingInputs}</div>

          <div className="section">
            <h2 className="sectionTitle">Select Cryptography Type</h2>
            <div className="formRow">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  value={cipherInputs.cryptography_type}
                  label="Type"
                  onChange={(e) => {
                    setCipherInputs((pre) => {
                      return {
                        ...pre,
                        cryptography_type: e.target.value,
                      };
                    });
                  }}
                >
                  <MenuItem value={"1"}>Caesar Cipher</MenuItem>
                  <MenuItem value={"2"}>vigenere cipher</MenuItem>
                  <MenuItem value={"3"}>Affine Cipher</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="toggleRow">
            <button
              variant="contained"
              className={`toggleBtn ${
                cipherInputs.encryption_decryption === "0" ? "active" : ""
              }`}
              onClick={() =>
                setCipherInputs((prev) => ({
                  ...prev,
                  encryption_decryption: "0",
                }))
              }
            >
              Encoding <KeyIcon />
            </button>
            <button
              variant="contained"
              className={`toggleBtn ${
                cipherInputs.encryption_decryption === "1" ? "active" : ""
              }`}
              onClick={() =>
                setCipherInputs((prev) => ({
                  ...prev,
                  encryption_decryption: "1",
                }))
              }
            >
              Decoding <KeyOffIcon />
            </button>
          </div>

          <div className="section">
            <h2 className="sectionTitle">Result</h2>
            <div className="resultRow">
              <Tooltip title="The result (read-only)">
                <TextField
                  className="resultField"
                  label="result"
                  variant="filled"
                  focused
                  color={resulttype}
                  value={result}
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                  InputProps={{
                    style: { fontSize: 20 },
                  }}
                  InputLabelProps={{
                    style: { fontSize: 16 },
                  }}
                />
              </Tooltip>
            </div>
          </div>

          <div className="section actions">
            <Button
              className="confirmBtn"
              variant="contained"
              disabled={!cipherInputs.text}
              onClick={routing_cryptography}
            >
              Confirm
            </Button>
          </div>
        </main>
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
      {/* <button onClick={()=>{
        successsound.current.play()
      }}>test</button> */}
      
    </div>
  );
}
