import Cookies from "js-cookie";

// import mui components
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "./style.css";

export const Header = ({
  handleOpenModal,
  isLogged,
  setIsLogged,
  handleToastNotif,
}) => {
  const handleLogout = () => {
    Cookies.remove("token");
    setIsLogged(false);
    handleToastNotif("success", "You are now logged out");
  };
  return (
    <header>
      <Typography variant="h5">KANTA</Typography>
      {isLogged ? (
        <Button
          variant="contained"
          color="primary"
          style={{ color: "white" }}
          onClick={handleLogout}
        >
          Déconnexion
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          style={{ color: "white" }}
          onClick={handleOpenModal}
        >
          Connexion
        </Button>
      )}
    </header>
  );
};
