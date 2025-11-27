import { getDiscount } from "../../../utils/functions";
import StarIcon from "@mui/icons-material/Star";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../actions/wishlistAction";
import { useSnackbar } from "notistack";

const Product = (props) => {
  const { _id, name, images, ratings, numOfReviews, price, cuttedPrice } = props;

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const inWishlist = wishlistItems.some((i) => i.product === _id);

  const handleWishlist = () => {
    if (inWishlist) {
      dispatch(removeFromWishlist(_id));
      enqueueSnackbar("Removed from wishlist", { variant: "success" });
    } else {
      dispatch(addToWishlist(_id));
      enqueueSnackbar("Added to wishlist", { variant: "success" });
    }
  };

  return (
    <div
      className="
        bg-white rounded-xl shadow-sm hover:shadow-md 
        border border-gray-100 
        transition-all p-4 mx-2 
        cursor-pointer relative 
        group hover:-translate-y-1
      "
    >
      {/* Wishlist Icon */}
      <span
        onClick={handleWishlist}
        className={`
          absolute top-3 right-3 text-lg 
          transition 
          ${inWishlist ? "text-red-500" : "text-gray-300 group-hover:text-red-400"}
        `}
      >
        <FavoriteIcon sx={{ fontSize: "20px" }} />
      </span>

      {/* Product Image */}
      <Link to={`/product/${_id}`}>
        <div className="w-full h-40 flex items-center justify-center">
          <img
            src={images[0].url}
            alt={name}
            draggable="false"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Product Title */}
        <h2 className="text-sm font-medium text-gray-800 mt-3 text-center group-hover:text-blue-600">
          {name.length > 45 ? `${name.substring(0, 45)}...` : name}
        </h2>
      </Link>

      {/* Rating */}
      <div className="flex justify-center items-center gap-2 mt-2">
        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
          {ratings.toFixed(1)} <StarIcon sx={{ fontSize: 12 }} />
        </span>
        <span className="text-xs text-gray-500">
          ({numOfReviews.toLocaleString()})
        </span>
      </div>

      {/* Price */}
      <div className="text-center mt-3">
        <span className="text-lg font-semibold text-gray-900">
          ₹{price.toLocaleString()}
        </span>

        <div className="flex justify-center items-center gap-2">
          <span className="line-through text-gray-400 text-sm">
            ₹{cuttedPrice.toLocaleString()}
          </span>

          <span className="text-green-600 text-sm font-medium">
            {getDiscount(price, cuttedPrice)}% off
          </span>
        </div>
      </div>
    </div>
  );
};

export default Product;
