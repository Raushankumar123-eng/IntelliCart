import {
    ADMIN_PRODUCTS_FAIL,
    ADMIN_PRODUCTS_REQUEST,
    ADMIN_PRODUCTS_SUCCESS,
    ALL_PRODUCTS_FAIL,
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    CLEAR_ERRORS,
    DELETE_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_RESET,
    DELETE_PRODUCT_SUCCESS,
    NEW_PRODUCT_FAIL,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_RESET,
    NEW_PRODUCT_SUCCESS,
    NEW_REVIEW_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_RESET,
    NEW_REVIEW_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_RESET,
    UPDATE_PRODUCT_SUCCESS,
    REMOVE_PRODUCT_DETAILS,
    ALL_REVIEWS_REQUEST,
    ALL_REVIEWS_SUCCESS,
    ALL_REVIEWS_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_RESET,
    DELETE_REVIEW_FAIL,
    SLIDER_PRODUCTS_FAIL,
    SLIDER_PRODUCTS_REQUEST,
    SLIDER_PRODUCTS_SUCCESS,
    SIMILAR_PRODUCTS_REQUEST,
    SIMILAR_PRODUCTS_SUCCESS,
    SIMILAR_PRODUCTS_FAIL,
} from "../constants/productConstants";

export const productsReducer = (state = { products: [] }, action) => {
    const { type, payload } = action;

    switch (type) {
        case ALL_PRODUCTS_REQUEST:
        case ADMIN_PRODUCTS_REQUEST:
        case SLIDER_PRODUCTS_REQUEST:
        case SIMILAR_PRODUCTS_REQUEST:
            return {
                loading: true,
                products: [],
            };

        case ALL_PRODUCTS_SUCCESS:
            return {
                loading: false,
                products: payload.products,
                productsCount: payload.productsCount,
                resultPerPage: payload.resultPerPage,
                filteredProductsCount: payload.filteredProductsCount,
            };

        // ✅ FIX: Admin products must use payload.products
        case ADMIN_PRODUCTS_SUCCESS:
            return {
                loading: false,
                products: payload.products,
            };

        case SLIDER_PRODUCTS_SUCCESS:
        case SIMILAR_PRODUCTS_SUCCESS:
            return {
                loading: false,
                products: payload,
            };

        // ❌ FIXED wrong "ALL_PRODUCTS_FAIL:a"
        case ALL_PRODUCTS_FAIL:
        case ADMIN_PRODUCTS_FAIL:
        case SLIDER_PRODUCTS_FAIL:
        case SIMILAR_PRODUCTS_FAIL:
            return {
                loading: false,
                error: payload,
            };

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};


export {
    productsReducer,
    productDetailsReducer,
    newReviewReducer,
    newProductReducer,
    productReducer,
    productReviewsReducer,
    reviewReducer
};
