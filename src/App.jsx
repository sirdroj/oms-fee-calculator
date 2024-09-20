import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Calculator_form from "./components/Calculator_form";
import Test from "./components/Test";

function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const parallaxStyle = {
    backgroundPositionY: -scrollY * 0.4 - 100 + "px", // Adjust the multiplier for speed
  };

  return (
    <div className="lexend-200 text-2xl w-full">
      <nav className="border-b-[1px] fixed z-10 bg-white w-screen top-0">
        <img className="h-7 m-4" src="./images/mtlogo.png" />
      </nav>
      <div className="parallax hidden lg:block" style={parallaxStyle}></div>
      <div className="w-max lg:w-full  z-20 p-2 flex justify-center  ">
       
        {/* <Test /> */}
        <Calculator_form />
      </div>
    </div>
  );
}

export default App;
