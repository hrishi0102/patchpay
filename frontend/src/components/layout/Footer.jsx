// src/components/layout/Footer.jsx
const Footer = () => {
    return (
      <footer className="bg-gray-800 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-700 pt-6">
            <p className="text-center text-gray-400">
              © {new Date().getFullYear()} PatchPay Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;