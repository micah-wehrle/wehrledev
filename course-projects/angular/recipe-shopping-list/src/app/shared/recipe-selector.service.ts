import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})

export class RecipeSelector {

  currentRecipe: Recipe;

  changeRecipe(recipe: Recipe) {
    this.currentRecipe = recipe;
  }

}