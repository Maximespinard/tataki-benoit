import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

// imoprt MUI components
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

const SignInBtn = styled(Button)`
  margin-top: 16px;
`;

export const SignIn = ({
  handleCloseSignIn,
  handleOpenSignUp,
  isModalOpen,
  setIsLogged,
}) => {
  // Set default state for form
  const defaultForm = { username: "", password: "" };
  const [data, setData] = useState(defaultForm);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = data;
    axios
      .post("http://localhost:5000/user/login", {
        username,
        password,
      })
      .then((res) => {
        Cookies.set("token", res.data.token);
        handleCloseSignIn();
        setIsLogged(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Update state when user types in input fields
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Disable sign in button if username and password are not 4 characters long
  const isSignInDisabled =
    data.username.length <= 4 && data.password.length <= 4;

  // JSX
  return (
    <Dialog open={isModalOpen} onClose={handleCloseSignIn}>
      <Title>Sign In</Title>
      <DialogContent>
        <DialogInfo>Please enter your credentials to sign in.</DialogInfo>
        <FormContainer onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
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
          />
          <SignInBtn
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={isSignInDisabled}
          >
            Sign In
          </SignInBtn>
        </FormContainer>
      </DialogContent>
      <DialogContent>
        <DialogContentText>
          Don't have an account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={handleOpenSignUp}
          >
            Sign up!
          </span>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
