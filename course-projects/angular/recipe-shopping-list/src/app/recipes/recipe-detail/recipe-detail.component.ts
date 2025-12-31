import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from 'src/app/shared/recipe.model';
import { RecipeService } from 'src/app/shared/services/recipe.service';
import { ShoppingListService } from 'src/app/shared/services/shopping-list.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipeBeingDisplayed: Recipe;

  constructor(private slService: ShoppingListService, private recipeService: RecipeService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( (param: []) => {
      this.recipeBeingDisplayed = this.recipeService.getRecipeByPath(param['recipe-path']);

      if(this.recipeBeingDisplayed === undefined) {
        this.router.navigate(['recipes', 'recipe-not-found']);
        this.recipeBeingDisplayed = this.recipeService.getFirstRecipe(); // prevents an error due to looking for undefined image path
      }
    });
  }

  addRecipeIngredientsToShoppingList() {
    this.slService.addIngredients(this.recipeBeingDisplayed.ingredients);
  }

  onEditRecipeClick(): void {
    this.router.navigate(['edit'], {relativeTo: this.activatedRoute});
  }

}
