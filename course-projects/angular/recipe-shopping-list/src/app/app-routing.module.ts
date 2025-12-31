import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { HomepageComponent } from "./homepage/homepage.component";
import { RecipeBlankComponent } from "./recipes/recipe-blank/recipe-blank.component";
import { RecipeDetailComponent } from "./recipes/recipe-detail/recipe-detail.component";
import { RecipeEditComponent } from "./recipes/recipe-edit/recipe-edit.component";
import { RecipeUndefinedComponent } from "./recipes/recipe-undefined/recipe-undefined.component";
import { RecipesComponent } from "./recipes/recipes.component";
import { ShoppingListComponent } from "./shopping-list/shopping-list.component";

const appRoutes: Route[] = [
  { path: '', component: HomepageComponent, pathMatch: 'full' },

  { path: 'recipes', component: RecipesComponent, children: [
    { path: '', component: RecipeBlankComponent },
    { path: 'new', component: RecipeEditComponent },
    { path: 'recipe-not-found', component: RecipeUndefinedComponent },
    { path: ':recipe-path', component: RecipeDetailComponent },
    { path: ':recipe-path/edit', component: RecipeEditComponent },
  ]},

  { path: 'shopping-list', component: ShoppingListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}