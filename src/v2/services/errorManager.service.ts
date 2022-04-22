class ErrorManager {
  protected errors: string[] = [];

  constructor() {}

  public isNoError() {
    if (this.errors.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  public addErrorMessage(errorMessage: string) {
    this.errors.push(errorMessage);
  }

  public getErrorMessage() {
    if (this.errors.length > 0) {
      console.error("error :\n", this.errors.join("\n "));
      setTimeout(() => {
        this.errors = [];
      }, 100);
      return this.errors;
    } else {
      return false;
    }
  }
}

/**
 * @description Manage errors messages (Singleton)
 */
const errorManager = new ErrorManager();

export default errorManager;
