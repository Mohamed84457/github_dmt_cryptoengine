import TextField from "@mui/material/TextField";

export default function DynamicInput({ label, name, value, changevalueevent ,inputtype}) {
  return (
    <div style={{ margin: "10px" }}>
      <TextField
      type={inputtype}
        style={{ width: "100%" }}
        id="outlined-basic"
        label={label}
        variant="outlined"
        value={value.name}
        onChange={(e) => {
          changevalueevent(name, e.target.value);
        }}
        InputProps={{
          style: { fontSize: 24 }, // input text size
        }}
        InputLabelProps={{
          style: { fontSize: 22 }, // label text size
        }}
      />
    </div>
  );
}
