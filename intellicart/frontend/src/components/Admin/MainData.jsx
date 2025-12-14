// src/components/Admin/MainData.jsx
import { useEffect } from "react";
import { Line, Pie, Doughnut, Bar } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import Chart from "chart.js/auto";

import { getAdminProducts } from "../../actions/productAction";
import { getAllOrders } from "../../actions/orderAction";
import { getAllUsers } from "../../actions/userAction";
import { categories } from "../../utils/constants";
import MetaData from "../Layouts/MetaData";

const MainData = () => {
  const dispatch = useDispatch();

  // ✅ ADMIN PRODUCTS (NO LIMIT)
  const { products = [] } = useSelector(
    (state) => state.adminProducts
  );

  const { orders = [] } = useSelector(
    (state) => state.allOrders
  );

  const { users = [] } = useSelector(
    (state) => state.users
  );

  // 🔥 IMPORTANT: Dispatch ONLY admin APIs
  useEffect(() => {
    dispatch(getAdminProducts()); // NO pagination
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  // =====================
  // CALCULATIONS
  // =====================
  let outOfStock = 0;
  products.forEach((item) => {
    if (item.stock === 0) outOfStock += 1;
  });

  const totalAmount = orders.reduce(
    (total, order) => total + order.totalPrice,
    0
  );

  // =====================
  // CHART DATA
  // =====================
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const date = new Date();

  const lineState = {
    labels: months,
    datasets: [
      {
        label: `Sales ${date.getFullYear() - 2}`,
        data: months.map((_, i) =>
          orders
            .filter(
              (o) =>
                new Date(o.createdAt).getFullYear() === date.getFullYear() - 2 &&
                new Date(o.createdAt).getMonth() === i
            )
            .reduce((sum, o) => sum + o.totalPrice, 0)
        ),
        borderColor: "#8A39E1",
        backgroundColor: "#8A39E1",
      },
      {
        label: `Sales ${date.getFullYear() - 1}`,
        data: months.map((_, i) =>
          orders
            .filter(
              (o) =>
                new Date(o.createdAt).getFullYear() === date.getFullYear() - 1 &&
                new Date(o.createdAt).getMonth() === i
            )
            .reduce((sum, o) => sum + o.totalPrice, 0)
        ),
        borderColor: "orange",
        backgroundColor: "orange",
      },
      {
        label: `Sales ${date.getFullYear()}`,
        data: months.map((_, i) =>
          orders
            .filter(
              (o) =>
                new Date(o.createdAt).getFullYear() === date.getFullYear() &&
                new Date(o.createdAt).getMonth() === i
            )
            .reduce((sum, o) => sum + o.totalPrice, 0)
        ),
        borderColor: "#4ade80",
        backgroundColor: "#4ade80",
      },
    ],
  };

  const pieState = {
    labels: ["Processing", "Shipped", "Delivered"],
    datasets: [
      {
        data: [
          orders.filter((o) => o.orderStatus === "Processing").length,
          orders.filter((o) => o.orderStatus === "Shipped").length,
          orders.filter((o) => o.orderStatus === "Delivered").length,
        ],
        backgroundColor: ["#9333ea", "#facc15", "#4ade80"],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "In Stock"],
    datasets: [
      {
        data: [outOfStock, products.length - outOfStock],
        backgroundColor: ["#ef4444", "#22c55e"],
      },
    ],
  };

  const barState = {
    labels: categories,
    datasets: [
      {
        label: "Products",
        data: categories.map(
          (cat) => products.filter((p) => p.category === cat).length
        ),
        backgroundColor: "#9333ea",
      },
    ],
  };

  // =====================
  // RENDER
  // =====================
  return (
    <>
      <MetaData title="Admin Dashboard | IntelliCart" />

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-600 text-white p-6 rounded-xl">
          <h4>Total Sales</h4>
          <h2 className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</h2>
        </div>

        <div className="bg-red-500 text-white p-6 rounded-xl">
          <h4>Total Orders</h4>
          <h2 className="text-2xl font-bold">{orders.length}</h2>
        </div>

        <div className="bg-yellow-500 text-white p-6 rounded-xl">
          <h4>Total Products</h4>
          <h2 className="text-2xl font-bold">{products.length}</h2>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-xl">
          <h4>Total Users</h4>
          <h2 className="text-2xl font-bold">{users.length}</h2>
        </div>
      </div>

      {/* CHARTS */}
      <div className="flex flex-col sm:flex-row gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl shadow w-full">
          <Line data={lineState} />
        </div>

        <div className="bg-white p-4 rounded-xl shadow w-full">
          <Pie data={pieState} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="bg-white p-4 rounded-xl shadow w-full">
          <Bar data={barState} />
        </div>

        <div className="bg-white p-4 rounded-xl shadow w-full">
          <Doughnut data={doughnutState} />
        </div>
      </div>
    </>
  );
};

export default MainData;
