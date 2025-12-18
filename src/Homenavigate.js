import { Link } from "react-router-dom";
// icons
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "./Homenavigate.css";
export default function HomeNavigate() {
  return (
    <div id="background">
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
        }}
      >
        <h1 style={{
          letterSpacing:"1px",
          textTransform:"capitalize",
          textShadow:"1px 1px 5px #FFF"
        }}>crypto engine</h1>
        <p>welcome to cryptography app to encode & decode easily</p>
      </div>
      <Link
        to={"/home"}
        style={{
          textDecoration: "none",
          width: "25%",
          height: "9%",
        }}
      >
        <button className="nextBTN">
          continue
          <NavigateNextIcon
            sx={{
              transition: "transform 0.3s ease",
              "#background button:hover &": {
                transform: "translateX(1.2em) scale(1.3)",
              },
            }}
          />
        </button>
      </Link>
    </div>
  );
}
