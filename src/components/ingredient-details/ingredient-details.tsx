import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredientsSlice';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const ingredients = useSelector<TIngredient[]>(getIngredients);

  const { id } = useParams();

  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
