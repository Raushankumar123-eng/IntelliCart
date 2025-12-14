import API from "../utils/axios";
import {
  ADD_TO_CART,
  EMPTY_CART,
  REMOVE_FROM_CART,
  SAVE_SHIPPING_INFO,
} from "../constants/cartConstants";

// =============================
// ADD TO CART
// =============================
export const addItemsToCart =
  (id, quantity = 1) =>
  async (dispatch, getState) => {
    try {
      const { data } = await API.get(`/product/${id}`);

      dispatch({
        type: ADD_TO_CART,
        payload: {
          product: data.product._id,
          name: data.product.name,
          seller: data.product.brand?.name || "Unknown",
          price: data.product.price,
          cuttedPrice: data.product.cuttedPrice,
          image: data.product.images?.[0]?.url,
          stock: data.product.stock,
          quantity,
        },
      });

      localStorage.setItem(
        "cartItems",
        JSON.stringify(getState().cart.cartItems)
      );
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

// =============================
// REMOVE FROM CART
// =============================
export const removeItemsFromCart =
  (id) =>
  async (dispatch, getState) => {
    dispatch({
      type: REMOVE_FROM_CART,
      payload: id,
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  };

// =============================
// EMPTY CART
// =============================
export const emptyCart = () => async (dispatch, getState) => {
  dispatch({ type: EMPTY_CART });

  localStorage.setItem(
    "cartItems",
    JSON.stringify(getState().cart.cartItems)
  );
};

// =============================
// SAVE SHIPPING INFO
// =============================
export const saveShippingInfo = (data) => async (dispatch) => {
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: data,
  });

  localStorage.setItem("shippingInfo", JSON.stringify(data));
};
