import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import {
  updateCartQuantity,
  removeItemsFromCart,
} from "../../actions/cartAction";
import { Link } from "react-router-dom";

const CartItem = ({
  product,
  name,
  seller,
  price,
  image,
  stock,
  quantity,
  inCart,
}) => {

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const increaseQuantity = () => {
    if (quantity >= stock) {
      enqueueSnackbar("Maximum Order Quantity", { variant: "warning" });
      return;
    }
    dispatch(updateCartQuantity(product, quantity + 1));
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) return;
    dispatch(updateCartQuantity(product, quantity - 1));
  };

  const removeItem = () => {
    dispatch(removeItemsFromCart(product));
    enqueueSnackbar("Product Removed From Cart", { variant: "success" });
  };

  return (
    <div className="border-b py-4">
      <Link to={`/product/${product}`} className="flex gap-4">
        <img src={image} alt={name} className="w-28 h-28 object-contain" />
        <div>
          <p>{name}</p>
          <p className="text-sm text-gray-500">Seller: {seller}</p>
          <p>₹{price * quantity}</p>
        </div>
      </Link>

      <div className="flex gap-2 mt-2">
        <button onClick={decreaseQuantity}>-</button>
        <span>{quantity}</span>
        <button onClick={increaseQuantity}>+</button>

        {inCart && (
          <button onClick={removeItem} className="ml-4 text-red-500">
            REMOVE
          </button>
        )}
      </div>
    </div>
  );
};

export default CartItem;
