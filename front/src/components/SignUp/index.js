// import dependencies
import { useState } from "react";
import axios from "axios";
import { styled } from "@mui/system";
import { ToastContainer } from "react-toastify";
import Cookies from "js-cookie";

// imoprt MUI components
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import { Typography } from "@mui/material";

// Styled components
const Title = styled(DialogTitle)`
  text-align: center;
  font-size: 1.5rem;
`;

const DialogInfo = styled(DialogContentText)`
  text-align: center;
`;

const FormContainer = styled("form")`
  width: 70%;
  margin: 16px auto 0 auto;
`;

const PasswordIcon = styled(LockIcon)`
  color: rgba(0, 0, 0, 0.54);
`;

const UserIcon = styled(PersonIcon)`
  color: rgba(0, 0, 0, 0.54);
`;

const SignInLink = styled(Typography)`
  text-decoration: underline;
  cursor: pointer;
`;

const SignUpBtn = styled(Button)`
  margin-top: 16px;
  color: white;
`;

const DialogBottom = styled(DialogContent)`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const SignUp = ({
  handleCloseSignUp,
  handleOpenSignIn,
  handleToastNotif,
  isModalOpen,
  setIsLogged,
}) => {
  // Set default state for form
  const defaultForm = { username: "", password: "", confirmPassword: "" };
  const [data, setData] = useState(defaultForm);
  const { username, password, confirmPassword } = data;

  // Send POST request to server when user clicks sign up button to register
  const handleSubmit = (e) => {
    // Check if passwords match
    if (data.password !== data.confirmPassword) return;
    e.preventDefault();

    // Send POST request to server to register user
    axios
      .post("http://localhost:5000/user/add", {
        username,
        password,
      })
      .then((res) => {
        // Set token to cookie, isLogged to true and display success toast notification
        Cookies.set("token", res.data.token);
        setIsLogged(true);
        handleToastNotif("success", res.data.message);
        handleCloseSignUp();
      })
      .catch((err) => {
        console.error(err);
        handleToastNotif("error", err.response.data.message);
      });
  };

  // Update state when user types in form
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Check if passwords match
  const isSamePasswords = password === confirmPassword;
  // Check if username is valid
  const isUsernameValid =
    username.length >= 4 && username.length <= 20 && !username.includes(" ");

  // JSX
  return (
    <Dialog open={isModalOpen} onClose={handleCloseSignUp}>
      <Title>Sign Up</Title>
      <DialogContent>
        <DialogInfo>Please enter your information to sign up.</DialogInfo>
        <FormContainer onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            autoFocus
            margin="dense"
            id="username"
            name="username"
            label="Username"
            type="text"
            value={data.username}
            onChange={handleChange}
            fullWidth
            InputProps={{
              startAdornment: <UserIcon />,
            }}
            inputProps={{
              minLength: 4,
              maxLength: 20,
            }}
          />
          <TextField
            variant="outlined"
            margin="dense"
            id="password"
            name="password"
            label="Password"
            type="password"
            value={data.password}
            onChange={handleChange}
            fullWidth
            InputProps={{
              startAdornment: <PasswordIcon />,
            }}
            inputProps={{
              minLength: 8,
            }}
          />
          <TextField
            variant="outlined"
            margin="dense"
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            value={data.confirmPassword}
            onChange={handleChange}
            fullWidth
            InputProps={{
              startAdornment: <PasswordIcon />,
            }}
            inputProps={{
              minLength: 8,
            }}
          />
          <SignUpBtn
            onClick={handleSubmit}
            disabled={!isSamePasswords || !isUsernameValid}
            variant="contained"
            color="primary"
            fullWidth
          >
            Sign Up
          </SignUpBtn>
        </FormContainer>
      </DialogContent>
      <DialogBottom>
        <DialogContentText>Already have an account? </DialogContentText>
        <SignInLink color="primary" onClick={handleOpenSignIn}>
          Sign in!
        </SignInLink>
      </DialogBottom>
      <ToastContainer />
    </Dialog>
  );
};
