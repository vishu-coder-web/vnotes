import "./styles/footer.css";

import { appVersion } from "../store/notes.store.js";

const Footer = ({ status }) => {
  return (
    <footer className="footer">
      <span className="version">{appVersion}</span>
      <p className="footer-text">
        Made with <span className="red">❤</span> In India.
      </p>
      <span className="status">{status.value}</span>
    </footer>
  );
};

export default Footer;
