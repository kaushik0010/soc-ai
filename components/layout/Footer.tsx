// components/Footer.tsx

const Footer = () => {
  return (
    <footer className="py-8 bg-gray-900 text-white">
      <div className="container mx-auto px-4 text-center text-sm">
        &copy; {new Date().getFullYear()} SOC-AI Platform. Built for the Hackathon.
      </div>
    </footer>
  );
};

export default Footer;