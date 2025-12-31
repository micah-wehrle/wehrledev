import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from 'src/app/shared/recipe.model';
import { RecipeService } from 'src/app/shared/services/recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  public currentRecipe: Recipe;
  public creatingNewRecipe: boolean;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private recipeService: RecipeService) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( (params: Params) => {
      this.creatingNewRecipe = typeof params['recipe-path'] === 'undefined';

      if(!this.creatingNewRecipe) {
        this.currentRecipe = this.recipeService.getRecipeByPath(params['recipe-path']);

        if(typeof this.currentRecipe === 'undefined') {
          this.router.navigate(['/recipes', 'recipe-not-found']);
        }
      }

    });
    
  }

}
