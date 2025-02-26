import React, { useEffect, useState } from "react";
import { Logo, Reg } from "../assets/img/index";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { app,auth } from "../config/firebase.config";

import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import { validateUser } from "../api";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";

const SignUp = (setAuth) => {
  
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  async function handleSignup() {
    if (email !== null && password !== null) {
      signInWithEmailAndPassword(firebaseAuth, email, password)
        .then(() => {
          setAuth(true);
          window.localStorage.setItem("auth", "true");

          firebaseAuth.onAuthStateChanged((userCred) => {
            if (userCred) {
              userCred.getIdToken().then((token) => {
                validateUser(token).then((data) => {
                  dispatch({
                    type: actionType.SET_USER,
                    user: data,
                  });
                });
              });

              navigate("/", { replace: true });
            } else {
              setAuth(false);
              dispatch({
                type: actionType.SET_USER,
                user: null,
              });
              navigate("/signup");
            }
          });
        })
        .catch((err) => alert(err));
    }
  }

  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const navigate = useNavigate();

  const [{ user }, dispatch] = useStateValue();

  const signUpWithGoogle = async () => {
    await signInWithPopup(firebaseAuth, provider).then((userCred) => {
      if (userCred) {
        setAuth(true);
        window.localStorage.setItem("auth", "true");

        firebaseAuth.onAuthStateChanged((userCred) => {
          if (userCred) {
            userCred.getIdToken().then((token) => {
              validateUser(token).then((data) => {
                dispatch({
                  type: actionType.SET_USER,
                  user: data,
                });
              });
            });

            navigate("/", { replace: true });
          } else {
            setAuth(false);
            dispatch({
              type: actionType.SET_USER,
              user: null,
            });
            navigate("/signup");
          }
        });
      }
    });
  };

  function handleClick() {
    window.location.href = "/Login";
  }
  useEffect(() => {
    if (window.localStorage.getItem("auth" === "true")) {
      navigate("/", { replace: true });
    }
  });

  return (
    <div className="relative w-screen h-screen ">
      <header className="flex items-center justify-center w-full h-16 bg-white ">
        <img src={Logo} alt="Logo" className=" absolute left-0 top-0 w-16 " />
        <label
          for="text"
          className="block mb-1 font-arial text-2xl font-large text-black font-medium tracking-wide"
        >
          Sinhala Learning Platform for Hearing-Impaired Children
        </label>
      </header>
      <img src={Reg} className="w-full h-full object-cover"></img>

      <div className="absolute inset-0 bg-opacity-70 flex items-center justify-center p-4">
        <div className="w-full md:w-375 p-4 gap-4 shadow-xl rounded-md backdrop-blur-md flex flex-col items-center justify-center">
          <div className="rounded-lg bg-slate-100/50 ... overflow-hidden shadow-2xl px-8 p-5">
            <label
              for="create account"
              className="block mb-1 text-center text-2xl font-semibold text-rose-500"
            >
              Register
            </label>
           
            <div className="mb-4">
              <label
                for="email"
                className="block mb-1 text-sm font-medium text-sky-700"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="youremail@gmail.com"
                className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                for="password"
                className="block mb-1 text-sm font-medium text-sky-700"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="********"
                className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
              />
            </div>
             <div className="mb-4">
              <label
                for="confirmPassword"
                className="block mb-1 text-sm font-medium text-sky-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none"
                value={confirmPassword}
                onChange={(e) => setconfirmPassword(e.target.value)}
              />
            </div>

            <button
              className="w-full p-3 mt-1 bg-rose-300 text-white rounded shadow  hover:bg-rose-500 hover:shadow-md"
              onClick={handleSignup}
            >
              Submit
            </button>
            <div className="mb-4">
              <label
                for="or"
                className="block mb-1 text-center text-sm font-medium text-sky-700"
              >
                <br />
                OR
              </label>
            </div>

            <div
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-cardOverlay cursor-pointer hover:bg-card hover:shadow-md duration-100 ease-in-out transition-all"
              onClick={signUpWithGoogle}
            >
              <FcGoogle className="text-xl" />
              Sign Up with Google
            </div>
            <br />
            <Link
              onClick={handleClick}
              className="mb-1 underline text-center text-sky-700 hover:text-black"
            >
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
