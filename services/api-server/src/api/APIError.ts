class APIError extends Error {
  code: number;
  message: string;
  constructor(code, message) {
    super();
    this.code = code;
    this.message = message;
  }
  toJSON() {
    return {
      code: this.code,
      message: this.message,
    };
  }
}

export { APIError };
