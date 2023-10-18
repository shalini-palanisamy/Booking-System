export class User {
  constructor(
    public email: string,                  // User's email address.
    public id: string,                     // User's unique identifier.
    private _token: string,                // Private token for authentication.
    private _tokenExpirationDate: Date     // Private token expiration date.
  ) {}

  get token() {
    // Check if the token is still valid based on the expiration date.
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;  // Return null if the token has expired or is not set.
    }
    return this._token;  // Return the token if it's valid and not expired.
  }
}
