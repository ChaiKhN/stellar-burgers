import { getIngredientsApi } from '@api';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';

export type TConstructorBurgerState = {
  ingredients: TIngredient[];
  isLoading: Boolean;
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
};

const initialState: TConstructorBurgerState = {
  ingredients: [],
  isLoading: false,
  constructorItems: { bun: null, ingredients: [] }
};

export const ingredientFromApi = createAsyncThunk(
  'ingredient/ingredientFromApi',
  getIngredientsApi
);

const randomId = () => self.crypto.randomUUID();

const constructorBurgerSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.bun = action.payload;
    },
    addIngredient: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        if (payload.type === 'bun') {
          state.constructorItems.bun = payload;
        } else {
          state.constructorItems.ingredients.push(payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: randomId() }
      })
    },
    removeIngredient: (
      state,
      { payload }: PayloadAction<TConstructorIngredient>
    ) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item: { id: string }) => item.id !== payload.id
        );
    },
    resetConstructor: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
      state.isLoading = false;
    },
    moveIngredientUp: (state, { payload }: PayloadAction<number>) => {
      const index = state.constructorItems.ingredients[payload];
      const nearIngredient = state.constructorItems.ingredients[payload - 1];
      state.constructorItems.ingredients.splice(
        payload - 1,
        2,
        index,
        nearIngredient
      );
    },
    moveIngredientDown: (state, { payload }: PayloadAction<number>) => {
      const index = payload;
      if (index >= 0 && index < state.constructorItems.ingredients.length - 1) {
        const temp = state.constructorItems.ingredients[index];
        state.constructorItems.ingredients[index] =
          state.constructorItems.ingredients[index + 1];
        state.constructorItems.ingredients[index + 1] = temp;
      }
    }
  },
  selectors: {
    getIngredient: (state) => state.ingredients,
    getIsLoading: (state) => state.isLoading,
    getConstructorItems: (state) => state.constructorItems
  },
  extraReducers: (builder) => {
    builder.addCase(ingredientFromApi.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(ingredientFromApi.fulfilled, (state, action) => {
      state.isLoading = false;
      state.ingredients = action.payload;
    });
    builder.addCase(ingredientFromApi.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export const { getIsLoading, getIngredient, getConstructorItems } =
  constructorBurgerSlice.selectors;
export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  resetConstructor
} = constructorBurgerSlice.actions;
export const constructorBurger = constructorBurgerSlice.reducer;
