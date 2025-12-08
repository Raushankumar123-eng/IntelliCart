import API from "../utils/axios";
import {
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    ALL_PRODUCTS_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_FAIL,
    CLEAR_ERRORS,
    SIMILAR_PRODUCTS_REQUEST,
    SIMILAR_PRODUCTS_SUCCESS,
    SIMILAR_PRODUCTS_FAIL,
} from "../constants/productConstants";

// Get All Products
export const getProducts = (
    keyword = "",
    category = "",
    price = [0, 200000],
    ratings = 0,
    page = 1
) => async (dispatch) => {
    try {
        dispatch({ type: ALL_PRODUCTS_REQUEST });

        let link = `/products?keyword=${keyword}&page=${page}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;
        if (category) link += `&category=${encodeURIComponent(category)}`;

        const { data } = await API.get(link);

        dispatch({
            type: ALL_PRODUCTS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ALL_PRODUCTS_FAIL,
            payload: error.response?.data?.message || "Something went wrong",
        });
    }
};

// Product Details
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
            payload: error.response?.data?.message,
        });
    }
};

// ========== NEW REVIEW ==========
export const newReview = (reviewData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_REVIEW_REQUEST });

        const { data } = await API.put("/review", reviewData, {
            headers: { "Content-Type": "application/json" }
        });

        dispatch({
            type: NEW_REVIEW_SUCCESS,
            payload: data.success,
        });
    } catch (error) {
        dispatch({
            type: NEW_REVIEW_FAIL,
            payload: error.response?.data?.message,
        });
    }
};

// ========== SIMILAR PRODUCTS ==========
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
            payload: error.response?.data?.message,
        });
    }
};

// Clear Errors
export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};
