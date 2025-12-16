import API from "../utils/axios";
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  EMPTY_CART,
  SAVE_SHIPPING_INFO,
  UPDATE_CART_QUANTITY,
} from "../constants/cartConstants";

// =======================
// ADD TO CART (API ONLY HERE)
// =======================
export const addItemsToCart =
  (id, quantity = 1) =>
  async (dispatch, getState) => {

    const { data } = await API.get(`/product/${id}`);

    dispatch({
      type: ADD_TO_CART,
      payload: {
        product: data.product._id,
        name: data.product.name,
        seller: data.product.brand?.name || "Unknown",
        price: data.product.price,
        cuttedPrice: data.product.cuttedPrice,
        image: data.product.images[0].url,
        stock: data.product.stock,
        quantity,
      },
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
};

// =======================
// UPDATE QUANTITY (NO API)
// =======================
export const updateCartQuantity =
  (id, quantity) =>
  (dispatch, getState) => {

    dispatch({
      type: UPDATE_CART_QUANTITY,
      payload: { id, quantity },
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
};

// =======================
export const removeItemsFromCart =
  (id) =>
  (dispatch, getState) => {

    dispatch({ type: REMOVE_FROM_CART, payload: id });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
};

export const emptyCart = () => (dispatch) => {
  dispatch({ type: EMPTY_CART });
  localStorage.removeItem("cartItems");
};

export const saveShippingInfo = (data) => (dispatch) => {
  dispatch({ type: SAVE_SHIPPING_INFO, payload: data });
  localStorage.setItem("shippingInfo", JSON.stringify(data));
};
