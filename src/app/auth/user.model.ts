export class User {
  constructor(
    public email: string, // User's email address.
    public id: string, // User's unique identifier.
    private _token: string, // Private token for authentication.
    private _tokenExpirationDate: Date
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token; // Return the token
  }
}
