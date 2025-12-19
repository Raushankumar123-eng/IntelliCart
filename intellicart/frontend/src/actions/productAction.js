// src/actions/productAction.js
import API from "../utils/axios";
import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  ADMIN_PRODUCTS_REQUEST,
  ADMIN_PRODUCTS_SUCCESS,
  ADMIN_PRODUCTS_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_FAIL,
  CLEAR_ERRORS,
  SIMILAR_PRODUCTS_REQUEST,
  SIMILAR_PRODUCTS_SUCCESS,
  SIMILAR_PRODUCTS_FAIL,
  ALL_REVIEWS_REQUEST,
  ALL_REVIEWS_SUCCESS,
  ALL_REVIEWS_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
  SLIDER_PRODUCTS_REQUEST,
  SLIDER_PRODUCTS_SUCCESS,
  SLIDER_PRODUCTS_FAIL,
} from "../constants/productConstants";

/* =============================
   GET ALL PRODUCTS (USER)
   ============================= */
export const getProducts = (
  keyword = "",
  category = "",
  price = [0, 200000],
  ratings = 0,
  page = 1
) => async (dispatch) => {
  try {
    dispatch({ type: ALL_PRODUCTS_REQUEST });

    let link = `/products?`;

    if (keyword.trim()) {
      link += `keyword=${keyword}&`;
    }

    if (category.trim()) {
      // ✅ SEND RAW CATEGORY STRING
      link += `category=${category}&`;
    }

    link += `price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}&page=${page}`;

    const { data } = await API.get(link);

    dispatch({
      type: ALL_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_PRODUCTS_FAIL,
      payload: error.response?.data?.message || "Failed to load products",
    });
  }
};




/* =============================
   PRODUCT DETAILS
   ============================= */
export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const { data } = await API.get(`/product/${id}`);

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response?.data?.message || "Failed to load product",
    });
  }
};

/* =============================
   ADMIN — ALL PRODUCTS
   ============================= */
export const getAdminProducts = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_PRODUCTS_REQUEST });

    const { data } = await API.get("/admin/products");

    dispatch({
      type: ADMIN_PRODUCTS_SUCCESS,
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_PRODUCTS_FAIL,
      payload:
        error.response?.data?.message || "Failed to load admin products",
    });
  }
};

/* =============================
   ADMIN — CREATE PRODUCT
   ============================= */
export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_PRODUCT_REQUEST });

    const { data } = await API.post(
      "/admin/product/new",
      productData
    );

    dispatch({
      type: NEW_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_PRODUCT_FAIL,
      payload:
        error.response?.data?.message || "Failed to create product",
    });
  }
};

/* =============================
   ADMIN — UPDATE PRODUCT
   ============================= */
export const updateProduct = (id, productData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });

    const { data } = await API.put(
      `/admin/product/${id}`,
      productData
    );

    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload:
        error.response?.data?.message || "Failed to update product",
    });
  }
};

/* =============================
   ADMIN — DELETE PRODUCT
   ============================= */
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });

    const { data } = await API.delete(
      `/admin/product/${id}`
    );

    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_FAIL,
      payload:
        error.response?.data?.message || "Failed to delete product",
    });
  }
};

/* =============================
   SIMILAR PRODUCTS
   ============================= */
export const getSimilarProducts = (category) => async (dispatch) => {
  try {
    dispatch({ type: SIMILAR_PRODUCTS_REQUEST });

    const { data } = await API.get(
      `/products?category=${encodeURIComponent(category)}`
    );

    dispatch({
      type: SIMILAR_PRODUCTS_SUCCESS,
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: SIMILAR_PRODUCTS_FAIL,
      payload:
        error.response?.data?.message ||
        "Failed to load similar products",
    });
  }
};

/* =============================
   GET ALL REVIEWS
   ============================= */
export const getAllReviews = (productId) => async (dispatch) => {
  try {
    dispatch({ type: ALL_REVIEWS_REQUEST });

    const { data } = await API.get(
      `/reviews?id=${productId}`
    );

    dispatch({
      type: ALL_REVIEWS_SUCCESS,
      payload: data.reviews,
    });
  } catch (error) {
    dispatch({
      type: ALL_REVIEWS_FAIL,
      payload:
        error.response?.data?.message || "Failed to load reviews",
    });
  }
};

/* =============================
   DELETE REVIEW
   ============================= */
export const deleteReview = (reviewId, productId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_REVIEW_REQUEST });

    const { data } = await API.delete(
      `/reviews?id=${reviewId}&productId=${productId}`
    );

    dispatch({
      type: DELETE_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_REVIEW_FAIL,
      payload:
        error.response?.data?.message || "Failed to delete review",
    });
  }
};

/* =============================
   SLIDER PRODUCTS
   ============================= */
export const getSliderProducts = () => async (dispatch) => {
  try {
    dispatch({ type: SLIDER_PRODUCTS_REQUEST });

    const { data } = await API.get("/products/slider");

    dispatch({
      type: SLIDER_PRODUCTS_SUCCESS,
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: SLIDER_PRODUCTS_FAIL,
      payload:
        error.response?.data?.message ||
        "Failed to load slider products",
    });
  }
};

/* =============================
   NEW REVIEW
   ============================= */
export const newReview = (reviewData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_REVIEW_REQUEST });

    const { data } = await API.put(
      "/review",
      reviewData
    );

    dispatch({
      type: NEW_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload:
        error.response?.data?.message ||
        "Failed to post review",
    });
  }
};

/* =============================
   CLEAR ERRORS
   ============================= */
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
