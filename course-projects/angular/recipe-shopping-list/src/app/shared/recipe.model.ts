export class Recipe {
  
  public name: string; 
  public shortDesc: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[];
  public pathName: string;
  
  /**
   *
   * @param name The name of the recipe
   * @param shortDesc A brief description of the recipe
   * @param desc The full description of the recipe
   * @param imgPath A path to an image of the recipe
   * @param ingredients An array of Ingredients which are used in the recipe
   */
  constructor(name: string, shortDesc: string, desc: string, imgPath: string, ingredients: Ingredient[]) {
    this.name = name;
    this.shortDesc = shortDesc;
    this.description = desc;
    this.imagePath = imgPath;
    this.ingredients = ingredients;
    this.pathName = name.toLowerCase();
    while(this.pathName.indexOf(' ') !== -1) {
      this.pathName = this.pathName.replace(' ', '-');
    }
  }
}

export class Ingredient {
  public name: string;
  public quantity: number;

  constructor(name: string, quantity: number) {
    this.name = name;
    this.quantity = quantity;
  }

  asString(): string {
    return `${this.name} - x${this.quantity}`;
  }
}