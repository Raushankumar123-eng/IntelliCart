import API from "../utils/axios";
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  EMPTY_CART,
  SAVE_SHIPPING_INFO,
} from "../constants/cartConstants";

export const addItemsToCart =
  (id, quantity = 1) =>
  async (dispatch, getState) => {

    const { data } = await API.get(`/product/${id}`); // ✅ FIX

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


  export const updateCartQuantity = (id, qty) => async (dispatch, getState) => {
  dispatch(addItemsToCart(id, qty));
};

export const removeItemsFromCart = (id) => (dispatch, getState) => {
  dispatch({ type: REMOVE_FROM_CART, payload: id });

  localStorage.setItem(
    "cartItems",
    JSON.stringify(getState().cart.cartItems)
  );
};

export const emptyCart = () => (dispatch) => {
  dispatch({ type: EMPTY_CART });
};

export const saveShippingInfo = (data) => (dispatch) => {
  dispatch({ type: SAVE_SHIPPING_INFO, payload: data });
  localStorage.setItem("shippingInfo", JSON.stringify(data));
};
