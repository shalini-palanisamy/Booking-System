export class User {
  constructor(
    public email: string, // User's email address.
    public id: string, // User's unique identifier.
    private _token: string // Private token for authentication.
  ) {}

  get token() {
    return this._token; // Return the token
  }
}
