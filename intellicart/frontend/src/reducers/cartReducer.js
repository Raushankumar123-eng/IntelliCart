import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  EMPTY_CART,
  SAVE_SHIPPING_INFO,
  UPDATE_CART_QUANTITY,
} from "../constants/cartConstants";

export const cartReducer = (
  state = { cartItems: [], shippingInfo: {} },
  { type, payload }
) => {
  switch (type) {

    case ADD_TO_CART:
      const item = payload;
      const exist = state.cartItems.find(
        (el) => el.product === item.product
      );

      if (exist) {
        return {
          ...state,
          cartItems: state.cartItems.map((el) =>
            el.product === exist.product ? item : el
          ),
        };
      }

      return {
        ...state,
        cartItems: [...state.cartItems, item],
      };

    // ✅ NEW (NO API)
    case UPDATE_CART_QUANTITY:
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.product === payload.id
            ? { ...item, quantity: payload.quantity }
            : item
        ),
      };

    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (el) => el.product !== payload
        ),
      };

    case EMPTY_CART:
      return {
        ...state,
        cartItems: [],
      };

    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: payload,
      };

    default:
      return state;
  }
};
