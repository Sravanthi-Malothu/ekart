
import{createSlice} from '@reduxjs/toolkit'
const {createSlice}=require("@reduxjs/toolkit")

const userSlice({
    name:"User",
    initialState:{
        user:null
    },
    reducers:{
        setUser:{state,action}=>{
            state.user=action.payload
        }
    }
})
export const{setUser}=userSlice.actions
export default userSlice.reducer