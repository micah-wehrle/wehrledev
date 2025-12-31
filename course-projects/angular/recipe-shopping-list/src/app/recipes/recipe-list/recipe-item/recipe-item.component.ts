import { Component, OnInit , Input } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from 'src/app/shared/services/recipe.service';
import { Recipe } from '../../../shared/recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {

  @Input() recipe: Recipe;

  constructor(private recipeService: RecipeService, private router: Router) { }

  ngOnInit(): void {
  }


  onRecipeItemClick() {
    this.recipeService.selectRecipe(this.recipe);
  }

}
