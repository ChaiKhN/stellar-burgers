import {
  TLoginData,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { setCookie, deleteCookie } from '../../utils/cookie';

export const setLoginUser = createAsyncThunk(
  'loginUser/loginUserApi',
  async function (loginData: TLoginData) {
    const data = await loginUserApi(loginData);
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
);

export const getUser = createAsyncThunk('user/getUserApi', getUserApi);

export const logoutUser = createAsyncThunk(
  'logoutUser/logoutApi',
  async function () {
    logoutApi().then(() => {
      localStorage.clear();
      deleteCookie('accessToken');
    });
  }
);

export const setRegisterUser = createAsyncThunk(
  'setRegisterUser/registerUserApi',
  registerUserApi
);

export const updateUser = createAsyncThunk(
  'updateUser/updateUserApi',
  updateUserApi
);

interface IUserState {
  request: boolean;
  profile: TUser;
  isInitUser: boolean;
  error: string | undefined;
}

const initialState: IUserState = {
  request: false,
  profile: { email: '', name: '' },
  isInitUser: false,
  error: undefined
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = '';
    },
    userLogout: (state) => {
      state.profile = { email: '', name: '' };
    }
  },
  selectors: {
    getRequestUser: (state) => state.request,
    getProfile: (state) => state.profile,
    getIsInitUser: (state) => state.isInitUser,
    getError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder.addCase(setLoginUser.pending, (state) => {
      state.request = true;
      state.isInitUser = false;
    }),
      builder.addCase(setLoginUser.fulfilled, (state, action) => {
        state.request = false;
        state.isInitUser = true;
        state.profile = action.payload.user;
      }),
      builder.addCase(setLoginUser.rejected, (state, action) => {
        state.request = false;
        state.isInitUser = false;
        state.error = action.error.message;
      });
    builder.addCase(getUser.pending, (state) => {
      state.request = true;
      state.isInitUser = false;
    }),
      builder.addCase(getUser.fulfilled, (state, action) => {
        state.request = false;
        state.isInitUser = true;
        state.profile = action.payload.user;
      }),
      builder.addCase(getUser.rejected, (state, action) => {
        state.request = false;
        state.isInitUser = false;
        state.error = action.error.message;
      });
    builder.addCase(setRegisterUser.pending, (state) => {
      state.request = true;
      state.isInitUser = false;
    }),
      builder.addCase(setRegisterUser.fulfilled, (state, action) => {
        state.request = false;
        state.isInitUser = true;
        state.profile = action.payload.user;
      }),
      builder.addCase(setRegisterUser.rejected, (state, action) => {
        state.request = false;
        state.isInitUser = false;
        state.error = action.error.message;
      });
    builder.addCase(logoutUser.pending, (state) => {
      state.request = true;
    }),
      builder.addCase(logoutUser.fulfilled, (state) => {
        state.request = false;
        state.isInitUser = true;
      }),
      builder.addCase(logoutUser.rejected, (state, action) => {
        state.request = false;
        state.isInitUser = false;
        state.error = action.error.message;
      });
    builder.addCase(updateUser.pending, (state) => {
      state.request = true;
    }),
      builder.addCase(updateUser.fulfilled, (state, action) => {
        state.request = false;
        state.isInitUser = true;
        state.profile = action.payload.user;
      }),
      builder.addCase(updateUser.rejected, (state, action) => {
        state.request = false;
        state.error = action.error.message;
      });
  }
});

export const { clearError, userLogout } = userSlice.actions;

export const { getRequestUser, getProfile, getIsInitUser, getError } =
  userSlice.selectors;

export const user = userSlice.reducer;
