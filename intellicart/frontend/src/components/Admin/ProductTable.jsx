import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Link } from "react-router-dom";

import {
  getAdminProducts,
  deleteProduct,
  clearErrors,
} from "../../actions/productAction";

import { DELETE_PRODUCT_RESET } from "../../constants/productConstants";
import Rating from "@mui/material/Rating";
import Actions from "./Actions";
import MetaData from "../Layouts/MetaData";
import BackdropLoader from "../Layouts/BackdropLoader";

const ProductTable = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // ✅ CORRECT slices
  const { products, loading, error } = useSelector(
    (state) => state.adminProducts
  );
  const { isDeleted, error: deleteError } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }

    if (deleteError) {
      enqueueSnackbar(deleteError, { variant: "error" });
      dispatch(clearErrors());
    }

    if (isDeleted) {
      enqueueSnackbar("Product Deleted Successfully", { variant: "success" });
      dispatch({ type: DELETE_PRODUCT_RESET });
    }

    dispatch(getAdminProducts());
  }, [dispatch, error, deleteError, isDeleted, enqueueSnackbar]);

  const rows =
    products?.map((item) => ({
      id: item._id,
      name: item.name,
      image: item.images?.[0]?.url,
      category: item.category,
      stock: item.stock,
      price: item.price,
      cprice: item.cuttedPrice,
      rating: item.ratings,
    })) || [];

  const columns = [
    { field: "id", headerName: "Product ID", flex: 0.5 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <img
            src={params.row.image}
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />
          {params.row.name}
        </div>
      ),
    },
    { field: "category", headerName: "Category", flex: 0.3 },
    { field: "stock", headerName: "Stock", flex: 0.3 },
    {
      field: "price",
      headerName: "Price",
      flex: 0.3,
      renderCell: (p) => `₹${p.row.price}`,
    },
    {
      field: "rating",
      headerName: "Rating",
      flex: 0.3,
      renderCell: (p) => <Rating readOnly value={p.row.rating} />,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.3,
      renderCell: (p) => (
        <Actions
          editRoute="product"
          deleteHandler={(id) => dispatch(deleteProduct(id))}
          id={p.row.id}
        />
      ),
    },
  ];

  return (
    <>
      <MetaData title="Admin Products | IntelliCart" />
      {loading && <BackdropLoader />}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-medium uppercase">Products</h1>
        <Link
          to="/admin/new_product"
          className="px-4 py-2 bg-primary-blue text-white rounded"
        >
          New Product
        </Link>
      </div>

      <div style={{ height: 470 }} className="bg-white shadow">
        <DataGrid rows={rows} columns={columns} pageSize={10} />
      </div>
    </>
  );
};

export default ProductTable;
