import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, clearErrors } from "../../actions/userAction";
import { useSnackbar } from "notistack";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [email, setEmail] = useState("");

  const { error, message, loading } = useSelector(
    (state) => state.forgotPassword
  );

  const submitHandler = (e) => {
    e.preventDefault();

    // ✅ STRONG validation (IMPORTANT)
    if (!email || !email.includes("@")) {
      enqueueSnackbar("Please enter a valid email", { variant: "error" });
      return;
    }

    dispatch(forgotPassword(email.trim()));
  };

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (message) {
      enqueueSnackbar(message, { variant: "success" });
    }
  }, [dispatch, error, message, enqueueSnackbar]);

  return (
    <form onSubmit={submitHandler}>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}                 // ✅ MUST
        onChange={(e) => setEmail(e.target.value)} // ✅ MUST
        required
      />

      <button type="submit">Send Reset Link</button>
    </form>
  );
};

export default ForgotPassword;
