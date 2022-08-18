export class Recipe {
  
  public name: string; 
  public description: string;
  public imagePath: string;
  
  /**
   *
   * @param name The name of the recipe
   * @param dsc A brief description of the recipe
   * @param imgPath A path to an image of the recipe
   */
  constructor(name: string, dsc: string, imgPath: string) {
    this.name = name;
    this.description = dsc;
    this.imagePath = imgPath;
  }
}