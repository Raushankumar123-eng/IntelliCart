import DownloadIcon from "@mui/icons-material/Download";
import logo from "../../assets/images/logo.png";

const AppDownload = () => {
  return (
    <div className="w-full mt-28 flex justify-center">
      <div className="w-11/12 sm:w-3/4 bg-white shadow-md rounded-lg p-8">

        <div className="flex items-center gap-4 mb-6">
          <img src={logo} alt="logo" className="h-14" />
          <h1 className="text-3xl font-semibold text-gray-800">Download IntelliCart App</h1>
        </div>

        <p className="text-gray-500 mb-6">
          Shop smarter and faster with the IntelliCart mobile app.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <DownloadIcon sx={{ fontSize: "60px" }} className="text-primary-blue" />
          <p className="mt-3 text-gray-600">
            Coming soon on Android & iOS.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AppDownload;
