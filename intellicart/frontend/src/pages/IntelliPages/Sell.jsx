import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import logo from "../../assets/images/logo.png";

const Sell = () => {
  return (
    <div className="w-full mt-28 flex justify-center">
      <div className="w-11/12 sm:w-3/4 bg-white shadow-md rounded-lg p-8">

        <div className="flex items-center gap-4 mb-6">
          <img src={logo} alt="logo" className="h-14" />
          <h1 className="text-3xl font-semibold text-gray-800">Sell on IntelliCart</h1>
        </div>

        <p className="text-gray-500 mb-6">
          Start your digital store with IntelliCart. Reach lakhs of customers instantly.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-5 rounded-lg">
            <h2 className="text-xl font-medium text-gray-700">Why sell with us?</h2>
            <ul className="list-disc ml-5 mt-2 text-gray-500">
              <li>Zero setup cost</li>
              <li>Fast payouts</li>
              <li>Seller support 24/7</li>
              <li>Grow your business online</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg flex flex-col items-center">
            <BusinessCenterIcon sx={{ fontSize: "50px" }} className="text-primary-blue" />
            <button className="mt-5 bg-primary-blue text-white px-6 py-3 rounded-md shadow hover:bg-blue-700 transition">
              Become a Seller
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Sell;
