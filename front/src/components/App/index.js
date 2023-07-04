import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

import { Header } from "../Header";
import { Map } from "../Map";
import { SignIn } from "../SignIn";
import { SignUp } from "../SignUp";

const MODAL_TYPES = {
  SIGN_IN: "SIGN_IN",
  SIGN_UP: "SIGN_UP",
};

function App() {
  const [modalType, setModalType] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isLogged, setIsLogged] = useState(false);

  // useEffect to check if user is already logged in
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      axios
        .get("http://localhost:5000/user/me", {
          headers: {
            Authorization: `${token}`,
          },
        })
        .then((res) => {
          setIsLogged(true);
          setIsFetching(false);
        })
        .catch((err) => {
          console.error(err, "ERROR IN GET USER");
        })
        .finally(() => {
          setIsFetching(false);
        });
    } else {
      setIsFetching(false);
    }
  }, []);

  const handleOpenModal = (type) => {
    setModalType(type);
  };

  const handleCloseModal = () => {
    setModalType(null);
  };

  if (isFetching) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header
        handleOpenModal={() => handleOpenModal(MODAL_TYPES.SIGN_IN)}
        isLogged={isLogged}
        setIsLogged={setIsLogged}
      />
      <Map isLogged={isLogged} />
      {modalType === MODAL_TYPES.SIGN_IN && (
        <SignIn
          isModalOpen={modalType === MODAL_TYPES.SIGN_IN}
          handleOpenSignUp={() => handleOpenModal(MODAL_TYPES.SIGN_UP)}
          handleCloseSignIn={handleCloseModal}
          setIsLogged={setIsLogged}
        />
      )}
      {modalType === MODAL_TYPES.SIGN_UP && (
        <SignUp
          isModalOpen={modalType === MODAL_TYPES.SIGN_UP}
          handleCloseSignUp={handleCloseModal}
          handleOpenSignIn={() => handleOpenModal(MODAL_TYPES.SIGN_IN)}
          setIsLogged={setIsLogged}
        />
      )}
    </>
  );
}

export default App;
