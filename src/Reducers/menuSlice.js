import { createSlice } from "@reduxjs/toolkit";

const initialState = { menuSidebar:false }
const menuSlice = createSlice({
    name:"menu",
    initialState:initialState,
    reducers:{
      setToggle: (state, action) => {
        state.menuSidebar = action.payload.menuSidebar;
      },
    }
});

export const { setToggle } = menuSlice.actions;
export default menuSlice.reducer;