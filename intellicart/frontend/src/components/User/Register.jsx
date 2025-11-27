import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, registerUser } from "../../actions/userAction";
import BackdropLoader from "../Layouts/BackdropLoader";
import MetaData from "../Layouts/MetaData";
import FormSidebar from "./FormSidebar";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );

  const [user, setUser] = useState({
    name: "",
    email: "",
    gender: "",
    password: "",
    cpassword: "",
  });

  const { name, email, gender, password, cpassword } = user;

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("preview.png");

  const handleRegister = (e) => {
    e.preventDefault();

    if (password.length < 8) {
      enqueueSnackbar("Password must be at least 8 characters", {
        variant: "warning",
      });
      return;
    }

    if (password !== cpassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return;
    }

    if (!avatar) {
      enqueueSnackbar("Please select an avatar", { variant: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("gender", gender);
    formData.append("password", password);
    formData.append("avatar", avatar); // FILE DIRECT

    dispatch(registerUser(formData));
  };

  const handleDataChange = (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (isAuthenticated) navigate("/");
  }, [dispatch, error, isAuthenticated, navigate, enqueueSnackbar]);

  return (
    <>
      <MetaData title="Register | Intelli-Cart" />
      {loading && <BackdropLoader />}

      <main className="w-full mt-12 sm:pt-20 sm:mt-0">
        <div className="flex sm:w-4/6 sm:mt-4 m-auto mb-7 bg-white shadow-lg">
          <FormSidebar
            title="Looks like you're new here!"
            tag="Sign up with your mobile number to get started"
          />

          <div className="flex-1 overflow-hidden">
            <form
              onSubmit={handleRegister}
              encType="multipart/form-data"
              className="p-5 sm:p-10"
            >
              <div className="flex flex-col gap-4 items-start">

                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={name}
                  onChange={handleDataChange}
                  required
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleDataChange}
                  required
                />

                <div className="flex gap-4 items-center">
                  <h2>Your Gender :</h2>
                  <RadioGroup row>
                    <FormControlLabel
                      name="gender"
                      value="male"
                      onChange={handleDataChange}
                      control={<Radio required />}
                      label="Male"
                    />
                    <FormControlLabel
                      name="gender"
                      value="female"
                      onChange={handleDataChange}
                      control={<Radio required />}
                      label="Female"
                    />
                  </RadioGroup>
                </div>

                <div className="flex gap-3 w-full">
                  <TextField
                    label="Password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleDataChange}
                    required
                  />

                  <TextField
                    label="Confirm Password"
                    type="password"
                    name="cpassword"
                    value={cpassword}
                    onChange={handleDataChange}
                    required
                  />
                </div>

                <div className="flex gap-3 w-full items-center">
                  <Avatar src={avatarPreview} sx={{ width: 56, height: 56 }} />

                  <label className="bg-gray-400 text-white p-2 rounded cursor-pointer w-full text-center">
                    <input
                      type="file"
                      name="avatar"
                      accept="image/*"
                      className="hidden"
                      onChange={handleDataChange}
                    />
                    Choose File
                  </label>
                </div>

                <button className="bg-[#ffb300] text-white p-3 w-full rounded shadow">
                  Signup
                </button>

                <Link
                  to="/login"
                  className="text-primary-blue text-center p-3 w-full border rounded shadow"
                >
                  Existing User? Log in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default Register;
