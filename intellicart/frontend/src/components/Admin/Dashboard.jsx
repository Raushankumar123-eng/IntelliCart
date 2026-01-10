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
        <>
            {/* WRAPPER */}
            <main className="min-h-screen w-full bg-gray-100">

                {/* SIDEBAR – DESKTOP */}
                {!onMobile && (
                    <aside className="fixed left-0 top-14 w-72 h-[calc(100vh-56px)] z-20 bg-white border-r">
                        <Sidebar activeTab={activeTab} />
                    </aside>
                )}

                {/* SIDEBAR – MOBILE */}
                {onMobile && toggleSidebar && (
                    <div className="fixed inset-0 z-40 bg-black/40">
                        <div className="w-72 h-full bg-white">
                            <Sidebar
                                activeTab={activeTab}
                                setToggleSidebar={setToggleSidebar}
                            />
                        </div>
                    </div>
                )}

                {/* CONTENT */}
                <section className="pt-14 md:pl-72">
                    <div className="p-3 sm:p-6 md:p-8 flex flex-col gap-6">

                        {/* MOBILE MENU BUTTON */}
                        {onMobile && (
                            <button
                                onClick={() => setToggleSidebar(true)}
                                className="md:hidden bg-gray-700 w-10 h-10 rounded-full shadow text-white flex items-center justify-center"
                            >
                                <MenuIcon />
                            </button>
                        )}

                        {/* PAGE CONTENT */}
                        <div className="w-full">
                            {children}
                        </div>

                    </div>
                </section>

            </main>
        </>
    );
};

export default Dashboard;
