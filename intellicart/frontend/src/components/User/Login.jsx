import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, loginUser } from '../../actions/userAction';
import { useSnackbar } from 'notistack';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';

import illustration from "../../assets/images/login-illustration.png";

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();

    const { loading, isAuthenticated, error, user } = useSelector((state) => state.user);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(loginUser(email, password));
    };

    // redirect logic
    const redirect = location.search ? location.search.split("=")[1] : "account";

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }

        // 🔥 MAIN FIX — Admin redirect
        if (isAuthenticated && user) {
            if (user.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate(`/${redirect}`);
            }
        }

    }, [dispatch, error, isAuthenticated, user, redirect, navigate, enqueueSnackbar]);

    return (
        <>
            <MetaData title="Login | Intelli-Cart" />

            {loading && <BackdropLoader />}

            <main className="w-full mt-12 sm:pt-20 sm:mt-0">

                <div className="flex sm:w-4/6 sm:mt-4 m-auto mb-7 bg-white shadow-lg">

                    <div className="hidden sm:flex flex-col justify-center items-center w-2/5 bg-[#2874f0] text-white px-10 py-12">
                        <h1 className="text-3xl font-semibold mb-3">Login</h1>
                        <p className="text-blue-100 text-lg text-center mb-10">
                            Access your Orders, Wishlist & Recommendations
                        </p>
                        <img src={illustration} alt="Login Illustration" className="w-64 drop-shadow-lg" />
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <div className="text-center py-10 px-4 sm:px-14">

                            <form onSubmit={handleLogin}>
                                <div className="flex flex-col w-full gap-4">

                                    <TextField
                                        fullWidth
                                        id="email"
                                        label="Email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />

                                    <TextField
                                        fullWidth
                                        id="password"
                                        label="Password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />

                                    <div className="flex flex-col gap-2.5 mt-2 mb-32">
                                        <p className="text-xs text-primary-grey text-left">
                                            By continuing, you agree to Intelli-Cart's
                                            <a href="#" className="text-primary-blue"> Terms of Use</a> and
                                            <a href="#" className="text-primary-blue"> Privacy Policy.</a>
                                        </p>

                                        <button
                                            type="submit"
                                            className="text-white py-3 w-full bg-[#ffb300] shadow hover:shadow-lg rounded-sm font-medium"
                                        >
                                            Login
                                        </button>

                                        <Link
                                            to="/password/forgot"
                                            className="hover:bg-gray-50 text-primary-blue text-center py-3 w-full shadow border rounded-sm font-medium"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>

                                </div>
                            </form>

                            <Link to="/register" className="font-medium text-sm text-primary-blue">
                                New to Intelli-Cart? Create an account
                            </Link>

                        </div>
                    </div>

                </div>

            </main>
        </>
    );
};

export default Login;
