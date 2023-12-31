import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import { createAccount } from "../api/user";

import SignUpSVG from "../assets/sign-up.svg";
import AppLogo from "../assets/logo.png";

import { Button, Image, Input } from "@nextui-org/react";
import { HiEye, HiEyeSlash } from "react-icons/hi2";

export default function SignUp() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    confirm_password: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const navigateTo = useNavigate();

  const handleSignUp = () => {
    if (!user.username || !user.password || !user.confirm_password) {
      setIsFormValid(false);
      return;
    }
    const isPasswordValid = user.password === user.confirm_password;
    if (!isPasswordValid) {
      setIsFormValid(false);
      return;
    }
    createAccount(user)
      .then((response) => {
        console.log(response);
        navigateTo("/login");
      })
      .catch((error) => {
        console.log(error);
        if (error.request.status === 400) {
          toast.error("Username already exists.");
          return;
        }
        toast.error("Something went wrong when creating a new user.");
      });
  };

  return (
    <div className="h-screen bg-slate-300 flex font-spartan justify-center text-center">
      <div className="w-3/5 bg-blue-50 h-screen md:flex hidden justify-center items-center">
        <Image
          isBlurred
          isZoomed
          className="w-[600px]"
          alt="create-account-svg"
          src={SignUpSVG}
        />
      </div>
      <div className="md:w-2/5 w-full p-12 bg-white h-screen flex flex-col justify-center text-start">
        <Image width={250} alt="app-logo" src={AppLogo} />
        <div className="text-xl font-light pt-7">Need an account?</div>
        <div className="text-lg text-gray-500 font-light pt-2">
          Please enter your information and dive deep into bright future of
          spotlight.
        </div>
        <div className="flex flex-col flex-wrap md:flex-nowrap gap-4 pt-7">
          <Input
            id="username"
            isClearable
            type="text"
            label="Username"
            variant="flat"
            placeholder="Enter your username"
            isInvalid={!isFormValid}
            onValueChange={(value) =>
              setUser((user) => ({ ...user, username: value }))
            }
          />
          <Input
            id="password"
            label="Password"
            variant="flat"
            placeholder="Enter your password"
            isInvalid={!isFormValid}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <HiEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <HiEye className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            onValueChange={(value) =>
              setUser((user) => ({ ...user, password: value }))
            }
          />
          <Input
            id="confirm_password"
            label="Confirm Password"
            variant="flat"
            placeholder="Confirm your password"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <HiEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <HiEye className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            isInvalid={!isFormValid}
            type={isVisible ? "text" : "password"}
            onValueChange={(value) =>
              setUser((user) => ({ ...user, confirm_password: value }))
            }
          />
          <Button className="text-xl" color="primary" onClick={handleSignUp}>
            Sign Up
          </Button>
          <div className="flex flex-row justify-center">
            <p className="pr-2">Already have an account?</p>
            <Link className="text-blue-600" to={"/login"}>
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
