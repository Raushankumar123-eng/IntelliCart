import { useEffect, useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import MenuIcon from '@mui/icons-material/Menu';

const Dashboard = ({ activeTab, children }) => {

    const [onMobile, setOnMobile] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);

    useEffect(() => {
        if (window.innerWidth < 600) {
            setOnMobile(true);
        }
    }, []);

    return (
        <>
            <main className="flex min-h-screen mt-14 w-full overflow-x-hidden bg-gray-100">

                {/* Sidebar */}
                {!onMobile && (
                    <aside className="hidden sm:block fixed left-0 top-14 h-[calc(100vh-56px)] w-72">
                        <Sidebar activeTab={activeTab} />
                    </aside>
                )}

                {toggleSidebar && (
                    <aside className="fixed inset-0 z-50 sm:hidden bg-black/40">
                        <div className="w-72 h-full bg-white">
                            <Sidebar
                                activeTab={activeTab}
                                setToggleSidebar={setToggleSidebar}
                            />
                        </div>
                    </aside>
                )}

                {/* Main Content */}
                <div className="flex-1 w-full sm:ml-72">
                    <div className="flex flex-col gap-6 p-3 sm:p-8 pb-6">

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setToggleSidebar(true)}
                            className="sm:hidden bg-gray-700 w-10 h-10 rounded-full shadow text-white flex items-center justify-center"
                        >
                            <MenuIcon />
                        </button>

                        {/* Page Content */}
                        <div className="w-full overflow-x-auto">
                            {children}
                        </div>

                    </div>
                </div>

            </main>
        </>
    );
};

export default Dashboard;
