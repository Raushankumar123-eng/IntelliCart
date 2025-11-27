import NotificationsIcon from "@mui/icons-material/Notifications";
import logo from "../../assets/images/logo.png";

const Notifications = () => {
  return (
    <div className="w-full mt-28 flex justify-center">
      <div className="w-11/12 sm:w-3/4 bg-white shadow-md rounded-lg p-8">

        <div className="flex items-center gap-4 mb-6">
          <img src={logo} alt="logo" className="h-14" />
          <h1 className="text-3xl font-semibold text-gray-800">Notification Preferences</h1>
        </div>

        <p className="text-gray-500 mb-6">
          Manage how IntelliCart sends you alerts about offers, orders, and updates.
        </p>

        <div className="space-y-4">
          {[
            "Order updates",
            "New deals & discounts",
            "Wishlist price drops",
            "Delivery reminders",
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <span className="text-lg text-gray-700">{item}</span>
              <NotificationsIcon className="text-primary-blue" />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Notifications;
