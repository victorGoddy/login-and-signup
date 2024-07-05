import React, { useRef, useEffect, useState } from 'react';
import { MobileMenuIconLight } from './icons';
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const MobileMenu = () => {
  const modalRef = useRef();
  const [pageState, setPageState] = useState("Sign In");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Add state for menu open/close

  const location = useLocation();
  const navigate = useNavigate();

  const pathMachRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeHamburger();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleHamburger = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openHamburger = () => {
    setIsMenuOpen(true);
  };

  const closeHamburger = () => {
    setIsMenuOpen(false);
  };

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState("Profile");
      } else {
        setPageState("Sign In");
      }
    });
  }, [auth]);

  return (
    <div className='flex md:hidden cursor-pointer' onClick={toggleHamburger}>
      <MobileMenuIconLight />
      <div 
        ref={modalRef} 
        className={`fixed inset-0 h-[100%] w-[50%] mt-[55px] flex items-center justify-center bg-black z-custom-index ${isMenuOpen ? 'block' : 'hidden'}`}
        id="hamburger"
        style={{ right: 0, left: 'auto' }}
      >
        <div className="justify-center flex flex-col w-[100%] mx-[auto] h-[auto] items-center">
          <div className='gap-8 items-center flex flex-col'>
            <li className={`text-white text-base font-ClashRegular hover:text-link-hover hover:font-ClashSemiBold hover:text-link-hover ${pathMachRoute("/") && "text-black !border-b-[#F6D200]"}`} onClick={() => { navigate("/"); closeHamburger(); }}>Home</li>
            <li className={`text-white text-base font-ClashRegular hover:text-link-hover hover:font-ClashSemiBold hover:text-link-hover ${pathMachRoute("/hire") && "text-black !border-b-[#F6D200]"}`} onClick={() => { navigate("/hire"); closeHamburger(); }}>Hire a Pro</li>
            <li className={`text-white text-base font-ClashRegular hover:text-link-hover hover:font-ClashSemiBold hover:text-link-hover ${pathMachRoute("/blogs") && "text-black !border-b-[#F6D200]"}`} onClick={() => { navigate("/blogs"); closeHamburger(); }}>Our Blogs</li>
            {/* <li className={`text-white text-base font-ClashRegular hover:text-link-hover hover:font-ClashSemiBold hover:text-link-hover ${pathMachRoute("/offers") && "text-black !border-b-[#F6D200]"}`} onClick={() => { navigate("/offers"); closeHamburger(); }}>Offers</li> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MobileMenu;
