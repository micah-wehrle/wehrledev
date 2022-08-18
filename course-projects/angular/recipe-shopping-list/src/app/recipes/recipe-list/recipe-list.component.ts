import { Component, OnInit } from '@angular/core';

import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe('Yummy Treat', 'Boy howdy it\'s real good fam', 'https://uploads.dailydot.com/a62/97/kOC8oH2.jpg'),
    new Recipe('Yummy Treat', 'Boy howdy it\'s real good fam', 'https://uploads.dailydot.com/a62/97/kOC8oH2.jpg')
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
