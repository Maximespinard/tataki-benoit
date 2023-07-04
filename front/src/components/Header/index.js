import Cookies from "js-cookie";

// import mui components
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "./style.css";

export const Header = ({ handleOpenModal, isLogged, setIsLogged }) => {
  const handleLogout = () => {
    Cookies.remove("token");
    setIsLogged(false);
  };
  return (
    <header>
      <Typography variant="h5">KANTA</Typography>
      {isLogged ? (
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Déconnexion
        </Button>
      ) : (
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Connexion
        </Button>
      )}
    </header>
  );
};