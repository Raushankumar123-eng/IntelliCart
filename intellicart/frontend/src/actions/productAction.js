import API from "../utils/axios";
import {
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    ALL_PRODUCTS_FAIL
} from "../constants/productConstants";

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

        if (category) {
            link += `&category=${category}`;
        }

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
