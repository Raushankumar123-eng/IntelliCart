import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import logo from "../../assets/images/logo.png";

const Support = () => {
  return (
    <div className="w-full mt-28 flex justify-center">
      <div className="w-11/12 sm:w-3/4 bg-white shadow-md rounded-lg p-8">

        <div className="flex items-center gap-4 mb-6">
          <img src={logo} alt="logo" className="h-14" />
          <h1 className="text-3xl font-semibold text-gray-800">Help & Support</h1>
        </div>

        <p className="text-gray-500 mb-6">We are here to assist you 24/7.</p>

        <div className="space-y-4">
          {[
            "Order not delivered?",
            "Issue with payment?",
            "Need refund status?",
            "Report a product issue",
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <span className="text-lg text-gray-700">{item}</span>
              <LiveHelpIcon className="text-primary-blue" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Support;
