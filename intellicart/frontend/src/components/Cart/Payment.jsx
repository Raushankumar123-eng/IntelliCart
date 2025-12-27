import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PriceSidebar from "./PriceSidebar";
import Stepper from "./Stepper";
import { clearErrors } from "../../actions/orderAction";
import { useSnackbar } from "notistack";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import MetaData from "../Layouts/MetaData";





const Payment = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const [payDisable, setPayDisable] = useState(false);

    const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.user);
    const { error } = useSelector((state) => state.newOrder);

    // total price
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // 🔹 Razorpay Payment Handler
    const submitHandler = async (e) => {
        e.preventDefault();
        setPayDisable(true);

        try {
            // 1️⃣ Create Razorpay Order (Backend)
            const { data } = await axios.post(
                "/payment/razorpay/order",
                { totalPrice },
                { headers: { "Content-Type": "application/json" } }
            );

            const razorpayOrder = data.razorpayOrder;

            // 2️⃣ Razorpay Checkout Options
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: razorpayOrder.amount,
                currency: "INR",
                name: "IntelliCart",
                description: "Order Payment",
                order_id: razorpayOrder.id,

                handler: async function (response) {
                    // 3️⃣ Verify Payment (Backend)
                    await axios.post(
                        "/api/v1/payment/razorpay/verify",
                        {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,

                            orderData: {
                                shippingInfo,
                                orderItems: cartItems,
                                itemsPrice: totalPrice,
                                taxPrice: 0,
                                shippingPrice: 0,
                                totalPrice,
                            },
                        },
                        { headers: { "Content-Type": "application/json" } }
                    );

                    enqueueSnackbar("Payment Successful", {
                        variant: "success",
                    });

                    
                },

                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: shippingInfo.phoneNo,
                },

                theme: {
                    color: "#2874f0",
                },
            };

            // 4️⃣ Open Razorpay Popup
            const razorpay = new window.Razorpay(options);
            razorpay.open();

            setPayDisable(false);
        } catch (err) {
            setPayDisable(false);
            enqueueSnackbar("Payment Failed", { variant: "error" });
        }
    };

    useEffect(() => {
        if (error) {
            dispatch(clearErrors());
            enqueueSnackbar(error, { variant: "error" });
        }
    }, [dispatch, error, enqueueSnackbar]);

    return (
        <>
            <MetaData title="IntelliCart: Secure Payment | Razorpay" />

            <main className="w-full mt-20">
                <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-11/12 m-auto sm:mb-7">
                    {/* Left Section */}
                    <div className="flex-1">
                        <Stepper activeStep={3}>
                            <div className="w-full bg-white">
                                <form
                                    onSubmit={submitHandler}
                                    autoComplete="off"
                                    className="flex flex-col gap-2 w-full mx-8 my-4"
                                >
                                    <FormControl>
                                        <RadioGroup
                                            aria-labelledby="payment-radio-group"
                                            defaultValue="razorpay"
                                            name="payment-radio-button"
                                        >
                                            <FormControlLabel
                                                value="razorpay"
                                                control={<Radio />}
                                                label={
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            draggable="false"
                                                            className="h-6 w-6 object-contain"
                                                            src="https://razorpay.com/assets/razorpay-logo.svg"
                                                            alt="Razorpay Logo"
                                                        />
                                                        <span>Razorpay</span>
                                                    </div>
                                                }
                                            />
                                        </RadioGroup>
                                    </FormControl>

                                    <input
                                        type="submit"
                                        value={`Pay ₹${totalPrice.toLocaleString()}`}
                                        disabled={payDisable}
                                        className={`${
                                            payDisable
                                                ? "bg-primary-grey cursor-not-allowed"
                                                : "bg-primary-orange cursor-pointer"
                                        } w-1/2 sm:w-1/4 my-2 py-3 font-medium text-white shadow hover:shadow-lg rounded-sm uppercase outline-none`}
                                    />
                                </form>
                            </div>
                        </Stepper>
                    </div>

                    {/* Right Section */}
                    <PriceSidebar cartItems={cartItems} />
                </div>
            </main>
        </>
    );
};

export default Payment;
