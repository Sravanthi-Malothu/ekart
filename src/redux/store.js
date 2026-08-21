import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice"
import cartSlice from "./cartSlice"
import wishlistSlice from "./wishlistSlice"

const store=configureStore({
    reducer:{
        user:userSlice,
        cart:cartSlice,
        wishlist:wishlistSlice
    }
})
export default store