import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  register as registerAPI,
  login as loginAPI,
  logout as logoutAPI,
  fetchMe as fetchMeAPI,
} from "../services/auth.api";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await registerAPI(userData);
      return res.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await loginAPI(credentials);
      return res.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutAPI();
      return null;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Rehydrates user from cookie on every page load/refresh
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchMeAPI();
      return res.user;
    } catch (err) {
      // Silent fail — user simply isn't logged in
      return rejectWithValue(null);
    }
  }
);

const handleAsyncCases = (builder, thunk, options = {}) => {
  builder
    .addCase(thunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      if (options.onFulfilled) options.onFulfilled(state, action);
    })
    .addCase(thunk.rejected, (state, action) => {
      state.loading = false;
      if (!options.silentReject) state.error = action.payload;
    });
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    // true while fetchCurrentUser is in-flight — used to block rendering
    // until we know if the user is authenticated or not
    hydrating: true,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    handleAsyncCases(builder, registerUser);
    handleAsyncCases(builder, loginUser);
    handleAsyncCases(builder, logoutUser);

    // fetchCurrentUser has special treatment:
    // - hydrating flag instead of loading (different UX — full page spinner vs button spinner)
    // - silent reject — a 401 here just means "not logged in", not an error to show
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.hydrating = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.hydrating = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.hydrating = false;
        state.user = null; // not an error — just unauthenticated
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;