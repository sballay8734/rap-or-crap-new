import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface User {
  _id: string
  email: string
  displayName: string
  activeGameId: string
}

interface UserState {
  user: null | User
}

// INITIAL STATE
const initialState: UserState = {
  user: null
}

// TODO: TEST THIS BEFORE MOVING ON
const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    clearUser: (state) => {
      state.user = null
    }
  }
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
