import React, { useState } from "react";
import axios from "axios";
import { styled } from "@mui/system";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";

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

const SignUpBtn = styled(Button)`
  margin-top: 16px;
`;

const DialogBottom = styled(DialogContent)`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const SignUp = ({
  handleCloseSignUp,
  handleOpenSignIn,
  isModalOpen,
  setIsLogged,
}) => {
  // Set default state for form
  const defaultForm = { username: "", password: "", confirmPassword: "" };
  const [data, setData] = useState(defaultForm);

  // Send POST request to server when user clicks sign up button to register
  const handleSubmit = (e) => {
    if (data.password !== data.confirmPassword) return;
    e.preventDefault();
    axios
      .post("http://localhost:5000/user/add", {
        username: data.username,
        password: data.password,
      })
      .then((res) => {
        setIsLogged(true);
        handleCloseSignUp();
      })
      .catch((err) => console.error(err));
  };

  // Update state when user types in form
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Check if passwords match
  const isSamePasswords = data.password === data.confirmPassword;
  // Check if username is valid
  const isUsernameValid =
    data.username.length >= 4 && data.username.length <= 20;

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
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={handleOpenSignIn}
        >
          Sign in!
        </span>
      </DialogBottom>
    </Dialog>
  );
};
