import { Response } from "express";
import {
  IApiResponse,
  IApiResponseResults,
  IApiResponseError,
  IApiResponseContext,
} from "../interfaces/ApiResponseManager.interface";

export class ApiResponseManager {
  private response: Response;
  private ApiResponse: IApiResponse = {};

  /**
   * Creates an instance of ApiResponseManager.
   * @param {Response} res
   * @memberof ApiResponseManager
   */
  constructor(res: Response) {
    this.response = res;
  }

  /**
   * Return a 200 success response
   *
   * @param {IApiResponseResults[]} results
   * @param {IApiResponseMetadata} context
   * @memberof ApiResponseManager
   */
  public successResponse(
    results: IApiResponseResults[] | IApiResponseResults,
    context?: IApiResponseContext
  ): void {
    this.ApiResponse.context = context;
    this.ApiResponse.results = this.consolidateResults(results);
    this.response.status(200).json(this.ApiResponse);
  }

  /**
   * Return a 200 success response in XML
   *
   * @param {IApiResponseResults[]} results
   * @param {IApiResponseMetadata} context
   * @memberof ApiResponseManager
   */
  public successResponseXML(results: any): void {
    // this.ApiResponse.context = context;
    // this.ApiResponse.results = this.consolidateResults(results);
    this.ApiResponse.results = results;
    // this.response.set('Accept', 'application/xml');
    // this.response.status(200).send(this.ApiResponse);
    // this.response.set('Content-Type', 'text/xml');
    this.response.type("application/xml");
    this.response.send(results);
  }

  /**
   * Return a 404 error response
   *
   * @param {IApiResponseMetadata} context
   * @param {IApiResponseError} error
   * @memberof ApiResponseManager
   */
  public errorResponse(
    error: IApiResponseError,
    context?: IApiResponseContext
  ): void {
    this.ApiResponse.error = {
      name: error.name,
      message: error.message,
      hint: error.hint,
      code: error.code,
      status: error.status,
    };
    if (error.parent) {
      this.ApiResponse.error.hint = error.parent.hint;
      this.ApiResponse.error.code = error.parent.code;
    }
    this.ApiResponse.context = context;
    this.response
      .status(this.ApiResponse.error.status || 404)
      .json(this.ApiResponse);
  }

  /**
   * Return a 401 error response
   *
   * @param {string} [message='Unauthorized !']
   * @memberof ApiResponseManager
   */
  public forbiddenResponse(message = "Unauthorized !"): void {
    this.response.status(401).send(message);
  }

  /**
   *
   *
   * @private
   * @param {(IApiResponseResults[] | IApiResponseResults)} result
   * @returns {IApiResponseResults[]}
   * @memberof ApiResponseManager
   */
  private consolidateResults(
    result: IApiResponseResults[] | IApiResponseResults
  ): IApiResponseResults[] {
    if (!Array.isArray(result)) {
      result = [result];
    }

    return <IApiResponseResults[]>result;
  }
}
