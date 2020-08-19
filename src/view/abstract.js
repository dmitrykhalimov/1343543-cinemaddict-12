export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error(`You're trying to instntiate an Abstract class, Mario. Princess in the concrete one.`);
    }
  }
}
