import NotificationsIcon from '@mui/icons-material/Notifications';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DownloadIcon from '@mui/icons-material/Download';
import { useSelector } from 'react-redux';


const SecondaryDropDownMenu = () => {

    const { user } = useSelector(state => state.user);

    if (!user) return null;


    const navs = [
        {
            title: "Notification Preferences",
            icon: <NotificationsIcon sx={{ fontSize: "18px" }} />,
            redirect: "/notifications",
        },
        {
            title: "Sell on IntelliCart",
            icon: <BusinessCenterIcon sx={{ fontSize: "18px" }} />,
            redirect: "/sell",
        },
        {
            title: "Help & Support",
            icon: <LiveHelpIcon sx={{ fontSize: "18px" }} />,
            redirect: "/support",
        },
        {
            title: "Advertise on IntelliCart",
            icon: <TrendingUpIcon sx={{ fontSize: "18px" }} />,
            redirect: "/advertise",
        },
        {
            title: "Download IntelliCart App",
            icon: <DownloadIcon sx={{ fontSize: "18px" }} />,
            redirect: "/app",
        },
    ];

    return (
        <div className="absolute w-60 -right-2 top-9 bg-white shadow-2xl rounded flex-col text-sm">

            {navs.map((item, i) => {
                const { title, icon, redirect } = item;

                return (
                    <a
                        className="pl-3 py-3.5 border-b flex gap-3 items-center hover:bg-gray-50 rounded-t cursor-pointer"
                        href={redirect}
                        key={i}
                    >
                        <span className="text-primary-blue">{icon}</span>
                        {title}
                    </a>
                );
            })}

            {/* Dropdown Arrow */}
            <div className="absolute right-1/2 -top-2.5">
                <div className="arrow_down"></div>
            </div>
        </div>
    );
};

export default SecondaryDropDownMenu;
