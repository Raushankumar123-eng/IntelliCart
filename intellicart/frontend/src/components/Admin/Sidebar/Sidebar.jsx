import { Link, useNavigate } from 'react-router-dom';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import InventoryIcon from '@mui/icons-material/Inventory';
import GroupIcon from '@mui/icons-material/Group';
import ReviewsIcon from '@mui/icons-material/Reviews';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import './Sidebar.css';
import { useSnackbar } from 'notistack';
import { logoutUser } from '../../../actions/userAction';

const navMenu = [
    { icon: <EqualizerIcon />, label: "Dashboard", ref: "/admin/dashboard" },
    { icon: <ShoppingBagIcon />, label: "Orders", ref: "/admin/orders" },
    { icon: <InventoryIcon />, label: "Products", ref: "/admin/products" },
    { icon: <AddBoxIcon />, label: "Add Product", ref: "/admin/new_product" },
    { icon: <GroupIcon />, label: "Users", ref: "/admin/users" },
    { icon: <ReviewsIcon />, label: "Reviews", ref: "/admin/reviews" },
    { icon: <AccountBoxIcon />, label: "My Profile", ref: "/account" },
    { icon: <LogoutIcon />, label: "Logout" },
];

const Sidebar = ({ activeTab, setToggleSidebar }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const { user } = useSelector((state) => state.user);

    const handleLogout = () => {
        dispatch(logoutUser());
        enqueueSnackbar("Logout Successfully", { variant: "success" });
        navigate("/login");
    };

    return (
        <>
            {/* BACKDROP FOR MOBILE */}
            <div 
                className={`sidebar-backdrop ${setToggleSidebar ? "active" : ""}`}
                onClick={() => setToggleSidebar(false)}
            ></div>

            {/* MAIN SIDEBAR */}
            <aside className={`sidebar-container ${setToggleSidebar ? "open" : ""}`}>
                
                {/* USER CARD */}
                <div className="sidebar-user">
                    <Avatar src={user.avatar.url} alt="Avatar" />
                    <div>
                        <h4>{user.name}</h4>
                        <p>{user.email}</p>
                    </div>
                    {/* CLOSE BUTTON ON MOBILE */}
                    <button 
                        className="mobile-close-btn"
                        onClick={() => setToggleSidebar(false)}
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* MENU LIST */}
                <div className="sidebar-menu">
                    {navMenu.map((item, index) => {
                        const { icon, label, ref } = item;

                        return label === "Logout" ? (
                            <button key={index} className="sidebar-item" onClick={handleLogout}>
                                {icon}
                                <span>{label}</span>
                            </button>
                        ) : (
                            <Link 
                                key={index} 
                                to={ref} 
                                className={`sidebar-item ${activeTab === index ? "active" : ""}`}
                            >
                                {icon}
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* FOOTER */}
                <div className="sidebar-footer">
                    <p>Developed with ❤️</p>
                    <a href="https://www.linkedin.com/in/raushankumar123/" target="_blank"></a>
                    <small>tiwariraushan60@gmail.com</small>
                </div>

            </aside>
        </>
    );
};

export default Sidebar;
