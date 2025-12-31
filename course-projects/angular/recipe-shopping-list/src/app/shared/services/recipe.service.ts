import { Injectable } from "@angular/core";
import { Ingredient, Recipe } from "../recipe.model";

@Injectable({providedIn: 'root'})
export class RecipeService {

  private currentRecipe: Recipe;

  private recipes: Recipe[] = [
    new Recipe(
      'Yummy Treat', 
      'Boy howdy it\'s real good fam',
      'If you just like a bunch of food smashed right in there then boy howdy you\'re sure to like whatever the heck this is. Like woah man, I don\'t see how anyone could eat this and survive. Looks good IMO.',
      'https://uploads.dailydot.com/a62/97/kOC8oH2.jpg', 
      [new Ingredient('Eggs', 5), new Ingredient('Milk', 1)]
    ),
    new Recipe(
      'Something else good yum', 
      'I just love to eat this soo much mmm', 
      'This is just a bunch of food. Wow! You should make it. It isn\'t hard, just a bunch of food! Yeah! Eat it! Yum! NOW. DO IT. EAT IT!',
      'https://thumbs.dreamstime.com/z/heart-shape-various-vegetables-fruits-healthy-food-concept-isolated-white-background-140287808.jpg', 
      [new Ingredient('Veggies', 12), new Ingredient('Lemon Juice', 25)]
    ),
    new Recipe(
      'Who would eat this',
      'I think you should be careful with this one...',
      'I know I sure wouldn\'t! MMM that look so bad! I need to make this part really long to make sure I don\'t display too much!',
      'https://www.boredpanda.com/blog/wp-content/uploads/2021/11/61a61bb00d2c2_b90u2bntrox71__700.jpg',
      [new Ingredient('Flavor', 1), new Ingredient('Milk', 10), new Ingredient('Oreos?', 7), new Ingredient('A Burger', 1)]
    )
  ];

  /**
   * 
   * @returns {Recipe[]} returns a cloned array of recipes, this is NOT a pointer
   */
  getRecipes(): Recipe[] {
    return this.recipes.slice(); 
  }

  getFirstRecipe(): Recipe {
    return (this.recipes && this.recipes.length > 0) ? this.recipes[0] : undefined;
  }

  selectRecipe(recipe: Recipe): void {
    this.currentRecipe = recipe;
  }


  getRecipeByPath(pathName: string): Recipe {
    for(let recipe of this.recipes) {
      if(recipe.pathName === pathName) {
        return recipe;
      }
    }

    return undefined;
  }

  getSelectedRecipePath(): string {
    return this.currentRecipe ? this.currentRecipe.pathName : this.getFirstRecipePath();
  }

  getFirstRecipePath(): string {
    return (this.recipes && this.recipes.length > 0 && this.recipes[0].pathName) ? this.recipes[0].pathName : '';
  }
}