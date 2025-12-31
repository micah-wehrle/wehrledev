import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from 'src/app/shared/services/recipe.service';

@Component({
  selector: 'app-recipe-blank',
  templateUrl: './recipe-blank.component.html',
  styleUrls: ['./recipe-blank.component.css']
})
export class RecipeBlankComponent implements OnInit {

  constructor(private recipeService: RecipeService, private router: Router) { }

  ngOnInit(): void {
    this.router.navigate(['/recipes', this.recipeService.getSelectedRecipePath()])
  }

}
