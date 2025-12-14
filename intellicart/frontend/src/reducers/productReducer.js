import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,

  ADMIN_PRODUCTS_REQUEST,
  ADMIN_PRODUCTS_SUCCESS,
  ADMIN_PRODUCTS_FAIL,

  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,

  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_PRODUCT_FAIL,
  NEW_PRODUCT_RESET,

  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  UPDATE_PRODUCT_RESET,

  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  DELETE_PRODUCT_RESET,

  CLEAR_ERRORS,
} from "../constants/productConstants";


// =======================
// USER PRODUCTS (paginated)
// =======================
export const productsReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case ALL_PRODUCTS_REQUEST:
      return { loading: true, products: [] };

    case ALL_PRODUCTS_SUCCESS:
      return {
        loading: false,
        products: action.payload.products,
        productsCount: action.payload.productsCount,
        resultPerPage: action.payload.resultPerPage,
        filteredProductsCount: action.payload.filteredProductsCount,
      };

    case ALL_PRODUCTS_FAIL:
      return { loading: false, error: action.payload };

    case CLEAR_ERRORS:
      return { ...state, error: null };

    default:
      return state;
  }
};


// =======================
// ADMIN PRODUCTS (NO LIMIT)
// =======================
export const adminProductsReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case ADMIN_PRODUCTS_REQUEST:
      return { loading: true, products: [] };

    case ADMIN_PRODUCTS_SUCCESS:
      return { loading: false, products: action.payload };

    case ADMIN_PRODUCTS_FAIL:
      return { loading: false, error: action.payload };

    case CLEAR_ERRORS:
      return { ...state, error: null };

    default:
      return state;
  }
};


// =======================
// PRODUCT DETAILS
// =======================
export const productDetailsReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { ...state, loading: true };

    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload };

    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload };

    case CLEAR_ERRORS:
      return { ...state, error: null };

    default:
      return state;
  }
};


// =======================
// CREATE / UPDATE / DELETE
// =======================
export const productReducer = (state = {}, action) => {
  switch (action.type) {
    case NEW_PRODUCT_REQUEST:
    case UPDATE_PRODUCT_REQUEST:
    case DELETE_PRODUCT_REQUEST:
      return { loading: true };

    case NEW_PRODUCT_SUCCESS:
      return { loading: false, success: true };

    case UPDATE_PRODUCT_SUCCESS:
      return { loading: false, isUpdated: true };

    case DELETE_PRODUCT_SUCCESS:
      return { loading: false, isDeleted: true };

    case NEW_PRODUCT_FAIL:
    case UPDATE_PRODUCT_FAIL:
    case DELETE_PRODUCT_FAIL:
      return { loading: false, error: action.payload };

    case NEW_PRODUCT_RESET:
      return { success: false };

    case UPDATE_PRODUCT_RESET:
      return { isUpdated: false };

    case DELETE_PRODUCT_RESET:
      return { isDeleted: false };

    case CLEAR_ERRORS:
      return { ...state, error: null };

    default:
      return state;
  }
};
