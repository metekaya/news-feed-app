import axios from "axios";
import { useState } from "react";

import { Button, Image, Input } from "@nextui-org/react";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", password: "" });
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:4000/login", {
        username: user.username,
        password: user.password,
      });

      console.log(response);
      window.localStorage.setItem("token", response.data.token);

      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", { theme: "light" });
    }
  };

  return (
    <div className="h-screen bg-slate-300 flex font-spartan justify-center text-center">
      <div className="w-3/5 bg-blue-50 h-screen flex justify-center items-center">
        <Image
          isBlurred
          isZoomed
          className="w-[600px]"
          alt="newspaper-svg"
          src="newspaper-bro.svg"
        />
      </div>
      <div className="w-2/5 p-12 bg-white h-screen flex flex-col justify-center text-start">
        <Image width={250} alt="app-logo" src="logo.png" />
        <div className="text-xl font-light pt-7">Welcome to spotlight 🔦</div>
        <div className="text-lg text-gray-500 font-light pt-2">
          Please sign-in to your account and start the future of personalized
          newspaper app.
        </div>
        <div className="flex flex-col flex-wrap md:flex-nowrap gap-4 pt-7">
          <Input
            id="username"
            isClearable
            type="text"
            label="Username"
            variant="flat"
            placeholder="Enter your username"
            onValueChange={(value) =>
              setUser((user) => ({ ...user, username: value }))
            }
          />
          <Input
            id="password"
            label="Password"
            variant="flat"
            placeholder="Enter your password"
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
          <Button className="text-xl" color="primary" onClick={handleLogin}>
            Login
          </Button>
          <div className="flex flex-row justify-center">
            <p className="pr-2">New on our platform?</p>
            <Link className="text-blue-600" to={"/signup"}>
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
