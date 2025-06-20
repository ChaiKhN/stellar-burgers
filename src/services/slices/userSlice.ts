import {
  TLoginData,
  TRegisterData,
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  updateUserApi
} from '@api';
import {
  PayloadAction,
  SerializedError,
  createAsyncThunk,
  createSlice
} from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie } from '../../utils/cookie';

interface IUpdateUserApiParams {
  email: string;
  name: string;
  password: string;
}

interface IResetPasswordApiParams {
  password: string;
  token: string;
}

type TUserState = {
  isInit: boolean;
  isLoading: boolean;
  isLogout: boolean;
  error: SerializedError | null;
  user: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
};

const initialState: TUserState = {
  isInit: false,
  isLoading: false,
  isLogout: false,
  error: null,
  user: null,
  isAuthChecked: false,
  isAuthenticated: false
};

// Получение пользователя
export const getUserApiThunk = createAsyncThunk(
  'user/getUser',
  async () => await getUserApi()
);

// Обновление пользователя
export const updateUserApiThunk = createAsyncThunk(
  'user/updateUser',
  async (params: IUpdateUserApiParams) => await updateUserApi({ ...params })
);

// Выход пользователя
export const logoutApiThunk = createAsyncThunk(
  'user/logout',
  async () =>
    await logoutApi()
      .then(() => {
        localStorage.clear(); // очищаем refreshToken
        deleteCookie('accessToken'); // очищаем accessToken
      })
      .catch(() => {
        console.log('Ошибка выполнения выхода');
      })
);

// Регистрация пользователя
export const registerUserThunk = createAsyncThunk(
  'user/registerUser',
  async (params: TRegisterData) => {
    const { email, name, password } = params;
    return await registerUserApi({ email, name, password });
  }
);

// Авторизация пользователя
export const loginUserThunk = createAsyncThunk(
  'user/loginUser',
  async (params: TLoginData) => {
    const { email, password } = params;
    return await loginUserApi({ email, password });
  }
);

// Забыл пароль
export const forgotPasswordApiThunk = createAsyncThunk(
  'user/forgotPassword',
  async (email: string) => await forgotPasswordApi({ email })
);

// Восстановление пароля
export const resetPasswordApiThunk = createAsyncThunk(
  'user/resetPassword',
  async (params: IResetPasswordApiParams) => {
    const { password, token } = params;
    return await resetPasswordApi({ password, token });
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    init: (state) => {
      state.isInit = true;
    },
    updateUser: (
      state,
      action: PayloadAction<{ name: string; email: string }>
    ) => {
      if (state.user) {
        state.user.name = action.payload.name;
        state.user.email = action.payload.email;
      }
    },
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  selectors: {
    selectUser: (state) => state.user,
    isAuthCheckedSelector: (state) => state.isAuthChecked
  },
  extraReducers: (builder) => {
    // Получение пользователя
    builder.addCase(getUserApiThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserApiThunk.rejected, (state, action) => {
      state.isInit = true;
      state.isLoading = false;
      state.error = action.error;
    });
    builder.addCase(getUserApiThunk.fulfilled, (state, action) => {
      state.isInit = true;
      state.isLoading = false;
      state.user = action.payload.user;
    });

    // Обновление пользователя
    builder.addCase(updateUserApiThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateUserApiThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.isLogout = false;
      state.error = action.error;
    });
    builder.addCase(updateUserApiThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isLogout = false;
      state.error = null;
      state.user = action.payload.user;
    });

    //Выход пользователя
    builder.addCase(logoutApiThunk.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logoutApiThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.isLogout = false;
      state.error = action.error;
    });
    builder.addCase(logoutApiThunk.fulfilled, (state, action) => {
      state.isInit = false;
      state.isLoading = false;
      state.isLogout = true;
      state.error = null;
      state.user = null;
    });

    // Регистрация
    builder.addCase(registerUserThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.isAuthenticated = false;
    });
    builder.addCase(registerUserThunk.rejected, (state, action) => {
      state.isLoading = true;
      state.error = action.error;
      state.isAuthenticated = false;
    });
    builder.addCase(registerUserThunk.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
      state.isAuthenticated = false;
    });

    // Логин
    builder.addCase(loginUserThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.isAuthenticated = false;
    });
    builder.addCase(loginUserThunk.rejected, (state, action) => {
      state.isLoading = true;
      state.error = action.error;
      state.isAuthenticated = false;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    });

    // Забыл пароль
    builder.addCase(forgotPasswordApiThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.isAuthenticated = false;
    });
    builder.addCase(forgotPasswordApiThunk.rejected, (state, action) => {
      state.isLoading = true;
      state.error = action.error;
      state.isAuthenticated = false;
    });
    builder.addCase(forgotPasswordApiThunk.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
      state.isAuthenticated = false;
    });

    // Сброс пароля
    builder.addCase(resetPasswordApiThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.isAuthenticated = false;
    });
    builder.addCase(resetPasswordApiThunk.rejected, (state, action) => {
      state.isLoading = true;
      state.error = action.error;
      state.isAuthenticated = false;
    });
    builder.addCase(resetPasswordApiThunk.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
      state.isAuthenticated = false;
    });
  }
});

export const { init } = userSlice.actions;
export const { selectUser } = userSlice.selectors;

export default userSlice.reducer;
