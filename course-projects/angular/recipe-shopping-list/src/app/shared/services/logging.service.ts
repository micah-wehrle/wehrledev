import { Recipe } from "../recipe.model";

export class LoggingService {

  count: number = 0;

  log(recipe: Recipe) {
    //console.log(`${++this.count} - Recipe was changed to ${recipe.name}`);
    this.count++;
    console.log(this.count);
  }
}