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

        let link = `/products?keyword=${encodeURIComponent(keyword)}&page=${page}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;
        if (category) link += `&category=${encodeURIComponent(category)}`;

        const { data } = await API.get(link);

        dispatch({ type: ALL_PRODUCTS_SUCCESS, payload: data });

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

        dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data.product });

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

        const { data } = await API.get(`/admin/products`);

        dispatch({ type: ADMIN_PRODUCTS_SUCCESS, payload: data.products });

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

        const { data } = await API.post(`/admin/product/new`, productData);

        dispatch({ type: NEW_PRODUCT_SUCCESS, payload: data });

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

        const { data } = await API.put(`/admin/product/${id}`, productData);

        dispatch({ type: UPDATE_PRODUCT_SUCCESS, payload: data.success });

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

        const { data } = await API.delete(`/admin/product/${id}`);

        dispatch({ type: DELETE_PRODUCT_SUCCESS, payload: data.success });

    } catch (error) {
        dispatch({
            type: DELETE_PRODUCT_FAIL,
            payload: error.response?.data?.message || "Something went wrong",
        });
    }
};

// Get Similar Products
export const getSimilarProducts = (category) => async (dispatch) => {
    try {
        dispatch({ type: SIMILAR_PRODUCTS_REQUEST });

        const { data } = await API.get(`/products?category=${encodeURIComponent(category)}`);

        dispatch({ type: SIMILAR_PRODUCTS_SUCCESS, payload: data.products });

    } catch (error) {
        dispatch({
            type: SIMILAR_PRODUCTS_FAIL,
            payload: error.response?.data?.message || "Something went wrong",
        });
    }
};

// Clear Errors
export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};
