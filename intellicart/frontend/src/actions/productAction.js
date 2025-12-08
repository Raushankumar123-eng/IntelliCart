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
    CLEAR_ERRORS,
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
        if (category) link += `&category=${category}`;

        const { data } = await API.get(link, { withCredentials: true });

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
            payload: error.response?.data?.message || "Something went wrong",
        });
    }
};

// Admin - Get All Products
export const getAdminProducts = () => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_PRODUCTS_REQUEST });

        const { data } = await API.get(`/admin/products`, { withCredentials: true });

        dispatch({
            type: ADMIN_PRODUCTS_SUCCESS,
            payload: data.products,
        });
    } catch (error) {
        dispatch({
            type: ADMIN_PRODUCTS_FAIL,
            payload: error.response?.data?.message || "Something went wrong",
        });
    }
};

// Admin - Create Product
export const createProduct = (productData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_PRODUCT_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        };

        const { data } = await API.post(`/admin/product/new`, productData, config);

        dispatch({
            type: NEW_PRODUCT_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: NEW_PRODUCT_FAIL,
            payload: error.response?.data?.message || "Something went wrong",
        });
    }
};

// Admin - Update Product
export const updateProduct = (id, productData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_PRODUCT_REQUEST });

        const config = {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        };

        const { data } = await API.put(`/admin/product/${id}`, productData, config);

        dispatch({
            type: UPDATE_PRODUCT_SUCCESS,
            payload: data.success,
        });
    } catch (error) {
        dispatch({
            type: UPDATE_PRODUCT_FAIL,
            payload: error.response?.data?.message || "Something went wrong",
        });
    }
};

// Admin - Delete Product
export const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_PRODUCT_REQUEST });

        const { data } = await API.delete(`/admin/product/${id}`, { withCredentials: true });

        dispatch({
            type: DELETE_PRODUCT_SUCCESS,
            payload: data.success,
        });
    } catch (error) {
        dispatch({
            type: DELETE_PRODUCT_FAIL,
            payload: error.response?.data?.message || "Something went wrong",
        });
    }
};



// ================== ADMIN — GET ALL REVIEWS OF A PRODUCT ===================
export const getAllReviews = (id) => async (dispatch) => {
    try {
        dispatch({ type: "ALL_REVIEW_REQUEST" });

        const { data } = await API.get(`/reviews?id=${id}`);

        dispatch({
            type: "ALL_REVIEW_SUCCESS",
            payload: data.reviews,
        });
    } catch (error) {
        dispatch({
            type: "ALL_REVIEW_FAIL",
            payload: error.response?.data?.message || "Something went wrong",
        });
    }
};



// ================== ADMIN — DELETE REVIEW ===================
export const deleteReview = (productId, reviewId) => async (dispatch) => {
    try {
        dispatch({ type: "DELETE_REVIEW_REQUEST" });

        const { data } = await API.delete(
            `/reviews?id=${reviewId}&productId=${productId}`, 
            { withCredentials: true }
        );

        dispatch({
            type: "DELETE_REVIEW_SUCCESS",
            payload: data.success,
        });
    } catch (error) {
        dispatch({
            type: "DELETE_REVIEW_FAIL",
            payload: error.response?.data?.message || "Something went wrong",
        });
    }
};


// Clear Errors
export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};
