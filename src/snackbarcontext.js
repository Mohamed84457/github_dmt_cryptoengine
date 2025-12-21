import { createContext, useContext, useState } from "react";

const Snackbarcontext = createContext();

export default function Snackbarprovider({ children }) {
  // snackbar data
  const [snackbardata, setsnackbardata] = useState({
    open: false,
    content: "",
    type: "success",
    time: "5000",
  });
  // handel open snackbar
  function opensnackbar(type, content, time) {
    setsnackbardata({
      open: true,
      content: content,
      type: type,
      time: time,
    });
  }
  //   handel close snackbar
  function closesnackbar() {
    setsnackbardata({ ...snackbardata, open: false });
  }
  return (
    <Snackbarcontext.Provider value={{ snackbardata, opensnackbar ,closesnackbar}}>
      {children}
    </Snackbarcontext.Provider>
  );
}
export const useSnackbar = () => {
  return useContext(Snackbarcontext);
};
