import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Searchbar from './Searchbar';
import logo from '../../../assets/images/logo.png';
import PrimaryDropDownMenu from './PrimaryDropDownMenu';
import SecondaryDropDownMenu from './SecondaryDropDownMenu';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CategoryNavbar from "../CategoryNavbar";

const Header = () => {

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems } = useSelector(state => state.cart);

  const [togglePrimaryDropDown, setTogglePrimaryDropDown] = useState(false);
  const [toggleSecondaryDropDown, setToggleSecondaryDropDown] = useState(false);

 return (
  <>
    {/* MAIN HEADER */}
    <header className="fixed top-0 w-full h-24 bg-white z-50 shadow-sm border-b border-gray-200 flex items-center">
      <div className="w-full sm:w-10/12 px-3 m-auto flex justify-between items-center">

        {/* Logo + Search */}
        <div className="flex items-center flex-1 gap-4">
          <Link className="mr-3" to="/">
            <img
              src={logo}
              alt="IntelliCart Logo"
              style={{ height: "90px", objectFit: "contain" }}
              draggable="false"
            />
          </Link>

          <Searchbar />
        </div>

        {/* Right */}
        <div className="flex items-center gap-6 relative">
          {isAuthenticated === false ? (
            <Link
              to="/login"
              className="px-6 py-1 text-white bg-blue-600 hover:bg-blue-700 transition font-medium rounded-lg cursor-pointer">
              Login
            </Link>
          ) : (
            <span
              className="flex items-center text-gray-700 font-medium gap-1 cursor-pointer hover:text-blue-600 transition"
              onClick={() => setTogglePrimaryDropDown(!togglePrimaryDropDown)}
            >
              {user.name && user.name.split(" ", 1)}
              <span>{togglePrimaryDropDown ? <ExpandLessIcon /> : <ExpandMoreIcon />}</span>
            </span>
          )}

          {togglePrimaryDropDown && <PrimaryDropDownMenu user={user} />}

          <span
            className="hidden sm:flex items-center text-gray-700 font-medium gap-1 cursor-pointer hover:text-blue-600 transition"
            onClick={() => setToggleSecondaryDropDown(!toggleSecondaryDropDown)}
          >
            More
            <span>{toggleSecondaryDropDown ? <ExpandLessIcon /> : <ExpandMoreIcon />}</span>
          </span>

          {toggleSecondaryDropDown && <SecondaryDropDownMenu />}

          <Link to="/cart" className="flex items-center text-gray-700 font-medium gap-2 relative hover:text-blue-600 transition">
            <ShoppingCartIcon />
            {cartItems.length > 0 && (
              <div className="w-5 h-5 bg-red-600 text-xs rounded-full absolute -top-2 left-3 flex justify-center items-center text-white shadow">
                {cartItems.length}
              </div>
            )}
            Cart
          </Link>
        </div>
      </div>
    </header>

    {/* CATEGORY NAVBAR BELOW HEADER */}
    {/* <div className="fixed top-24 w-full z-40">
      <CategoryNavbar />
    </div> */}

  </>
);

};

export default Header;
