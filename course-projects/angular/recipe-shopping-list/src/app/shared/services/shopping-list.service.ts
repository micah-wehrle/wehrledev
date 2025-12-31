import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../recipe.model";

@Injectable({providedIn: 'root'})
export class ShoppingListService {

  private ingredientsUpdated = new Subject<void>();

  private ingredients: Ingredient[] = [
    new Ingredient("Beef", 5),
    new Ingredient("Flavor", 1000)
  ];

  getIngredients(): Ingredient[] {
    return this.ingredients.slice();
  }

  addIngredient(ingredient: Ingredient): void {
    this.addIngredientPrivate(ingredient);
    this.ingredientsUpdated.next();
  }

  // Creating an addIngredients (plural) method allows me to add all the ingredients, and then I implemented a private addIngredint method to save having to code the addition logic twice
  addIngredients(ingredients: Ingredient[]): void {
    ingredients.forEach((ingr: Ingredient) => {
      this.addIngredientPrivate(ingr);
    });

    this.ingredientsUpdated.next();
  }


  private addIngredientPrivate(ingredient: Ingredient): void {
    for(let ingrEl of this.ingredients) {
      if(ingrEl.name === ingredient.name) {
        ingrEl.quantity += ingredient.quantity;
        return;
      }
    }

    this.ingredients.push(ingredient);
  }

  public getIngredientsSubject(): Subject<void> {
    return this.ingredientsUpdated;
  }

}