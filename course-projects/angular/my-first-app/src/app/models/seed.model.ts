/**
 * @description Allows for random numbers to be generated from a seed. Input the seed at creation, (ideally the ban), and then call next() to get the next random number. Whenever you re-generate a page, call resetSeed so that it will start over from a "zeroed" seed
 * @param {number} seed The seed for the random numbers. Inputting the same seed will always produce the same sequence of random numbers
 */
export class SeededRandomNumber {

  private seed: number;
  private counter: number;

  // Got prime numbers and formula from https://en.wikipedia.org/wiki/Pseudorandom_number_generator
  private mult1: number = 15485863; //9293787934331213n; I tried these two primes originally but I was having trouble with BigInts
  private mult2: number = 2038074743; //14159265358979323846264338327950n; This ends in a 0 so I don't think it's a prime but whatever, too long


  constructor(seed: number) {
    this.counter = 1;
    this.seed = seed;
  }

  /**
   * @description Will return the next random number in the sequence based off of the seed.
   * @returns {number} A number from 0 to 1
   */
  public next(): number {
    this.counter++;
    let a = this.seed*this.counter*this.counter*this.mult1;
    return ( a * a * a % this.mult2 ) / this.mult2;
  }

  /**
   * @description Will return the Nth random number from the seed sequence that you'd like to generate
   * @param count The Nth random number in the seed sequence you'd like to generate
   * @returns {number} A number from 0 to 1
   */
  public nextNumberAtCount(count: number): number {
    let a = this.seed * count * count * this.mult1;
    return ( a * a * a % this.mult2 ) / this.mult2;
  }

  /**
   * @description Set the seed back to "zero" as if you were beginning to use it for the first time
   */
  public resetSeed(): void {
    this.counter = 1;
  }

  /**
   * @description 
   * @param index 
   */
  public setSeedIndex(index: number) {
    this.counter = index;
  }

  /**
   * @description Essentailly the same as "new SeedRng(seed)"
   */
  public setNewSeed(seed: number) {
    this.seed = seed;
    this.counter = 1;
  }

  public nextLetter(): string { // 97 to 122
    const nextNum = Math.min(Math.floor(this.next()*26)+97, 122);

    return String.fromCharCode(nextNum).toUpperCase();
  }

}

/**
 * @description Given a 9 digit BAN, will generate account data from the BAN. 
 */
export class SeededBanDataGenerator extends SeededRandomNumber {

  private streetNames: string[] = "Devon Lafayette Cypress Kings Jewel Great Baker Steam Summer Bath Autumn Farmer Archer Walnut Chapel Congress University Grime Sunny Lower".split(" ");
  private streetTypes: string[] = "Road Lane Boulevard Drive".split(" ");
  private cityNames: string[] = "Austin Seattle Boston Chicago Portland Denver Cleveland Atlanta Akron Arronton Orlando".split(" ");
  private stateNames: string[] = "TX NV CA OK KA MS AR LA MI AL TN KY IL WI MI OH NC SC GA FL CN".split(" "); // I think that's all ATT states and I think I got them spelled right
  private regionNames: string[] = "mw sw se nw".split(" ");

  // This allows for the seed to generate a specific bit of data every time. Uses the number here as the count for a seed.
  private seedCodes = {
    streetNum: 1,
    streetName: 2,
    streetType: 3,
    cityName: 4,
    stateName: 5,
    zip: 6,
    phone: 7,

    circuitID: 1000, // draws X seeded numbers
  };

  constructor(ban:number) {
    super(ban);
  }

  public getStreet(): string {
    const number = Math.floor(this.nextNumberAtCount(this.seedCodes.streetNum)*10000);
    const streetNameIndex = Math.floor(this.nextNumberAtCount(this.seedCodes.streetName) * this.streetNames.length);
    const name = this.streetNames[ streetNameIndex ];
    const streetTypeIndex = Math.floor(this.nextNumberAtCount(this.seedCodes.streetType) * this.streetTypes.length);
    const type = this.streetTypes[ streetTypeIndex ];
    return `${number} ${name} ${type}`;
  }

  public getAddress(): string {
    const street: string = this.getStreet();

    const cityIndex = Math.floor(this.nextNumberAtCount(this.seedCodes.cityName) * this.cityNames.length);
    const city: string = this.cityNames[cityIndex];

    const stateIndex = Math.floor(this.nextNumberAtCount(this.seedCodes.stateName) * this.stateNames.length);
    const state: string = this.stateNames[stateIndex];

    const zip: number = Math.floor(this.nextNumberAtCount(this.seedCodes.zip) * 90000 + 10000);

    return `${street}, ${city}, ${state} ${zip}`;
  }
  
  public getPhoneNumber(): string {
    const phoneNum: string = String(Math.floor( this.nextNumberAtCount(this.seedCodes.phone) *9000000000 + 1000000000 ));
    return `${phoneNum.substring(0,3)}-${phoneNum.substring(3,6)}-${phoneNum.substring(6,11)}`;
  }

  public getCircuitID(): string {
    this.setSeedIndex(this.seedCodes.circuitID)
    let output = '';

    for(let i = 0; i < 12; i++) {
      if(i < 6) {
        output += this.nextLetter() + (i === 1 || i === 5 ? '.' : '');
      }
      else {
        output += Math.floor(this.next()*10);
      }
    }

    const regionIndex: number = Math.floor(this.next() * this.regionNames.length);
    output += '..' + this.regionNames[regionIndex];

    return output;
  }

}

export class SeededPLEGenerator extends SeededRandomNumber {

  private courseNames: string[] = ['Climbing a Ladder', 'Circle of Safety', 'Safely Greeting the Customer', 'Don\'t Get Shocked', 'Cleaver? I Hardly Know \'er!', 'Working Without Tools'];
  private seedCodes = {
    completedCourseCount: 1, 
    

    courseListScramble: 100
  };

  private orderedCourses;

  constructor(uuid: string) {
    let uuidAsNum = '';

    for(let str of uuid) {
      uuidAsNum += '' + (isNaN(Number(str)) ? str.charCodeAt(0) : str);
    }

    super(Number(uuidAsNum));


  }

  

  



}