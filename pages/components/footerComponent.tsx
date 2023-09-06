const Footer = () => {
    const currentYear = new Date().getFullYear();
  
    return (
      <footer className="text-center fixed bottom-0 left-0 right-0">
        <small className="block mb-2 text-sm font-light text-gray-900 dark:text-white">© Copyright - Kayque Prado - 2021 - {currentYear}</small>
      </footer>
    );
  };
  
  export default Footer;