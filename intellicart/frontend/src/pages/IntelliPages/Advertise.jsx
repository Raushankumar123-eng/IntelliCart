import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import logo from "../../assets/images/logo.png";

const Advertise = () => {
  return (
    <div className="w-full mt-28 flex justify-center">
      <div className="w-11/12 sm:w-3/4 bg-white shadow-md rounded-lg p-8">

        <div className="flex items-center gap-4 mb-6">
          <img src={logo} alt="logo" className="h-14" />
          <h1 className="text-3xl font-semibold text-gray-800">Advertise on IntelliCart</h1>
        </div>

        <p className="text-gray-500 mb-6">
          Promote your products to millions of active shoppers.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <TrendingUpIcon sx={{ fontSize: "60px" }} className="text-primary-blue" />
          <p className="mt-4 text-gray-600">
            Reach more customers and grow your business with targeted ads.
          </p>

          <button className="mt-5 bg-primary-blue text-white px-6 py-3 rounded-md shadow hover:bg-blue-700 transition">
            Start Advertising
          </button>
        </div>

      </div>
    </div>
  );
};

export default Advertise;
