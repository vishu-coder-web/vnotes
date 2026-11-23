import "./styles/footer.css";

const Footer = ({ status }) => {
  return (
    <footer className="footer">
      <p className="footer-text">
        Made with <span className="red">❤</span> In India.
      </p>
      <span className="status">{status.value}</span>
    </footer>
  );
};

export default Footer;
