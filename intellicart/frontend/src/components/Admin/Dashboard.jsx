import { useEffect, useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import MenuIcon from '@mui/icons-material/Menu';

const Dashboard = ({ activeTab, children }) => {

    const [onMobile, setOnMobile] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);

    useEffect(() => {
        if (window.innerWidth < 768) {
            setOnMobile(true);
        }
    }, []);

    return (
        <main className="flex min-h-screen mt-14 w-full bg-gray-100 overflow-x-hidden">

            {/* Sidebar */}
            {!onMobile && (
                <div className="hidden md:block w-72 shrink-0">
                    <Sidebar activeTab={activeTab} />
                </div>
            )}

            {/* Mobile Sidebar */}
            {onMobile && toggleSidebar && (
                <div className="fixed inset-0 z-40 bg-black/40 md:hidden">
                    <div className="w-72 h-full bg-white">
                        <Sidebar
                            activeTab={activeTab}
                            setToggleSidebar={setToggleSidebar}
                        />
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="flex-1 w-full">
                <div className="flex flex-col gap-6 p-3 sm:p-6 md:p-8">

                    {/* Mobile menu button */}
                    {onMobile && (
                        <button
                            onClick={() => setToggleSidebar(true)}
                            className="md:hidden bg-gray-700 w-10 h-10 rounded-full shadow text-white flex items-center justify-center"
                        >
                            <MenuIcon />
                        </button>
                    )}

                    {/* Page content */}
                    <div className="w-full">
                        {children}
                    </div>

                </div>
            </div>

        </main>
    );
};

export default Dashboard;
