declare module "iyzipay" {
  interface IyzipayConfig {
    apiKey: string;
    secretKey: string;
    uri: string;
  }

  class Iyzipay {
    constructor(config: IyzipayConfig);
    checkoutFormInitialize: {
      create(request: unknown, callback: (err: unknown, result: unknown) => void): void;
    };
    checkoutForm: {
      retrieve(request: unknown, callback: (err: unknown, result: unknown) => void): void;
    };
  }

  export = Iyzipay;
}
