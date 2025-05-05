import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      &copy; {new Date().getFullYear()} Ubudasa EMS. All rights reserved.
    </footer>
  );
};

export default Footer;
