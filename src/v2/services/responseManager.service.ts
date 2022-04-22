import { Response } from "express";

interface ResponseInterface {
  status: boolean;
  message: string;
}

export class ResponseManager {
  private response: Response;
  constructor(res: Response) {
    this.response = res;
  }

  public sendResponse(status: boolean, message: string) {
    this.response.send({ status, message });
  }
}
