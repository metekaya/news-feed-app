import { Button } from "@nextui-org/react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Home() {
  const handleButton = () => {
    axios
      .get("http://localhost:4000/users", {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        if (error.request.status === 400) {
          toast.error("Username already exists.", { theme: "dark" });
        }
      });
  };
  return (
    <div className="h-screen bg-slate-300 flex flex-col font-spartan justify-center items-center text-center">
      <h1 className="text-5xl font-bold text-white border bg-black p-5 m-10 rounded-lg">
        Home Page
      </h1>
      <Button className="text-xl" color="primary" onClick={handleButton}>
        get users
      </Button>
    </div>
  );
}
