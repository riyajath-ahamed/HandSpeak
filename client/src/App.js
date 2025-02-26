import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Home, Login, Progress, SignUp, Support } from "./components";
import { app } from "./config/firebase.config";

import { getAuth } from "firebase/auth";

import { AnimatePresence } from "framer-motion";
import { validateUser } from "./api";
import { useStateValue } from "./context/StateProvider";
import { actionType } from "./context/reducer";

const App = () => {
  const firebaseAuth = getAuth(app);
  const navigate = useNavigate();

  const [{ user }, dispatch] = useStateValue();

  const [auth, setAuth] = useState(
    false || window.localStorage.getItem("auth") === "true"
  );

  useEffect(() => {
    firebaseAuth.onAuthStateChanged((userCred) => {
      if (userCred) {
        //if we have the user credentials
        userCred.getIdToken().then((token) => {
          // console.log(token);
          validateUser(token).then((data) => {
            dispatch({
              type: actionType.SET_USER,
              user: data,
            });
          });
        });
      } else {
        setAuth(false);
        window.localStorage.setItem("auth", "false");
        dispatch({
          type: actionType.SET_USER,
          user: null,
        });
        navigate("/login");
      }
    });
  }, []);

  // useEffect(() => {
  //   firebaseAuth.onAuthStateChanged((userCred) => {
  //     if (userCred) {
  //       //if we have the user credentials
  //       userCred.getIdToken().then((token) => {
  //         // console.log(token);
  //         validateUser(token).then((data) => {
  //           dispatch({
  //             type: actionType.SET_USER,
  //             user: data,
  //           });
  //         });
  //       });
  //     } else {
  //       setAuth(false);
  //       window.localStorage.setItem("auth", "false");
  //       dispatch({
  //         type: actionType.SET_USER,
  //         user: null,
  //       });
  //       navigate("/signup");
  //     }
  //   });
  // }, []);
  return (
    <AnimatePresence>
      <div className="h-auto min-w-[680px] bg-primary flex justify-center items-center">
        <Routes>
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/*" element={<Home />} />
          <Route path='/Progress' element={<Progress/>} />
          <Route path='/Support' element={<Support/>} />
        </Routes>
      </div>
    </AnimatePresence>
  );
};

export default App;
