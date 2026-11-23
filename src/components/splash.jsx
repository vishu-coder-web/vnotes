import { useEffect } from "preact/hooks";

import "./styles/splash.css";
import appLogo from "../assets/logo.svg";
import { isLoaded, splashScreenAnimation } from "../store/notes.store.js";
import { showToolips } from "../store/notes.helper.js";

const Splash = () => {
  useEffect(() => {
    // Slash Screen Animation
    setTimeout(() => {
      isLoaded.value = true;
      showToolips("Welcome to VNotes 🥰");
    }, splashScreenAnimation);
  }, []);

  return (
    <div className="splash">
      <img src={appLogo} alt="App Logo" />
      <div className="loader">
        <div class="wrapper">
          <div class="circle"></div>
          <div class="circle"></div>
          <div class="circle"></div>
          <div class="shadow"></div>
          <div class="shadow"></div>
          <div class="shadow"></div>
        </div>
      </div>
    </div>
  );
};

export default Splash;
