import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import { 
    forgotPasswordReducer, 
    profileReducer, 
    userReducer, 
    allUsersReducer, 
    userDetailsReducer 
} from './reducers/userReducer';

import { 
    newProductReducer, 
    newReviewReducer, 
    productDetailsReducer, 
    productReducer, 
    productsReducer, 
    productReviewsReducer, 
    reviewReducer,
    adminProductsReducer   // ⭐ ADD THIS
} from './reducers/productReducer';

import { cartReducer } from './reducers/cartReducer';
import { saveForLaterReducer } from './reducers/saveForLaterReducer';

import { 
    allOrdersReducer, 
    myOrdersReducer, 
    newOrderReducer, 
    orderDetailsReducer, 
    orderReducer, 
    paymentStatusReducer 
} from './reducers/orderReducer';

import { wishlistReducer } from './reducers/wishlistReducer';

const reducer = combineReducers({

    // USER
    user: userReducer,
    profile: profileReducer,
    forgotPassword: forgotPasswordReducer,

    // PRODUCTS (customer)
    products: productsReducer,
    productDetails: productDetailsReducer,

    // ⭐ ADMIN PRODUCTS → FIX FOR 46 PRODUCTS
    adminProducts: adminProductsReducer,

    // REVIEWS
    newReview: newReviewReducer,
    reviews: productReviewsReducer,
    review: reviewReducer,

    // CART / SAVE / WISHLIST
    cart: cartReducer,
    saveForLater: saveForLaterReducer,
    wishlist: wishlistReducer,

    // ORDERS
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    paymentStatus: paymentStatusReducer,
    orderDetails: orderDetailsReducer,
    allOrders: allOrdersReducer,
    order: orderReducer,

    // ADMIN USERS
    users: allUsersReducer,
    userDetails: userDetailsReducer,

    // PRODUCTS (create/update)
    newProduct: newProductReducer,
    product: productReducer,
});


// INITIAL STATE
let initialState = {
    cart: {
        cartItems: localStorage.getItem('cartItems')
            ? JSON.parse(localStorage.getItem('cartItems'))
            : [],
        shippingInfo: localStorage.getItem("shippingInfo")
            ? JSON.parse(localStorage.getItem("shippingInfo"))
            : {},
    },
    saveForLater: {
        saveForLaterItems: localStorage.getItem('saveForLaterItems')
            ? JSON.parse(localStorage.getItem('saveForLaterItems'))
            : [],
    },
    wishlist: {
        wishlistItems: localStorage.getItem('wishlistItems')
            ? JSON.parse(localStorage.getItem('wishlistItems'))
            : [],
    },
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
