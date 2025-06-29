import {
  constructorBurger,
  addIngredient,
  removeIngredient,
  ingredientFromApi,
  initialState
} from '../ingredientSlice';
import { TIngredient } from '@utils-types';

const mockIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093e',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://example.com/image.png',
  image_large: 'https://example.com/image_large.png',
  image_mobile: 'https://example.com/image_mobile.png'
};

describe('constructorBurger extraReducers', () => {
  it('должен установить isLoading: true при ingredientFromApi.pending', () => {
    const state = constructorBurger(
      initialState,
      ingredientFromApi.pending('')
    );
    expect(state.isLoading).toBe(true);
  });

  it('должен загрузить ингредиенты при ingredientFromApi.fulfilled', () => {
    const fulfilledAction = {
      type: ingredientFromApi.fulfilled.type,
      payload: [mockIngredient]
    };
    const state = constructorBurger(initialState, fulfilledAction);
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual([mockIngredient]);
  });

  it('должен установить ошибку при ingredientFromApi.rejected', () => {
    const rejectedAction = {
      type: ingredientFromApi.rejected.type,
      error: { message: 'Ошибка загрузки' }
    };
    const state = constructorBurger(initialState, rejectedAction);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});

describe('constructorBurger actions', () => {
  const stateWithIngredient = {
    ...initialState,
    constructorItems: {
      bun: null,
      ingredients: []
    }
  };

  it('должен добавлять ингредиент', () => {
    const state = constructorBurger(
      stateWithIngredient,
      addIngredient(mockIngredient)
    );
    expect(state.constructorItems.ingredients.length).toBe(1);
    expect(state.constructorItems.ingredients[0]._id).toBe(mockIngredient._id);
  });

  it('должен удалять ингредиент', () => {
    const addedState = constructorBurger(
      stateWithIngredient,
      addIngredient(mockIngredient)
    );
    const ingredientWithId = addedState.constructorItems.ingredients[0]; // получаем с id

    const removedState = constructorBurger(
      addedState,
      removeIngredient(ingredientWithId)
    );
    expect(removedState.constructorItems.ingredients).not.toContainEqual(
      ingredientWithId
    );
  });
});
