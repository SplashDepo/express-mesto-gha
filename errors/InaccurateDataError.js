class InaccurateDataErrorClass extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

const InaccurateDataError = new InaccurateDataErrorClass();

export default InaccurateDataError;
