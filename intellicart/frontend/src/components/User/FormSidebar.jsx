import logo from "../../assets/images/logo.png";
import illustration from "../../assets/images/login-illustration.png";

const FormSidebar = ({ title, tag }) => {
    return (
        <div className="hidden sm:flex flex-col justify-center items-center w-2/5 bg-[#2874f0] text-white px-10 py-12">

            {/* IntelliCart Logo */}
            {/* <img
                src={logo}
                alt="IntelliCart Logo"
                className="h-20 w-auto mb-6 drop-shadow-lg"
            /> */}

            {/* Title */}
            <h1 className="text-3xl font-semibold mb-2 text-center">{title}</h1>

            {/* Tagline */}
            <p className="text-blue-100 text-lg text-center mb-8">{tag}</p>

            {/* Illustration */}
            <img
                src={illustration}
                alt="Illustration"
                className="w-64 drop-shadow-md"
            />
        </div>
    );
};

export default FormSidebar;
