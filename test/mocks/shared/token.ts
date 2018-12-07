import {TokenInterface, UserInterface} from '@rxstack/core';

export class Token implements TokenInterface {

  private user = {
    username: 'admin',
    roles: ['ROLE_ADMIN']
  };

  private authenticated = true;

  private fullyAuthenticated = true;

  eraseCredentials(): void { }

  getCredentials(): string {
    return '';
  }

  getPayload(): Object {
    return { };
  }

  getRoles(): string[] {
    return this.getUser().roles;
  }

  getUser(): UserInterface {
    return this.user;
  }

  getUsername(): string {
    return this.getUser().username;
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  isFullyAuthenticated(): boolean {
    return this.fullyAuthenticated;
  }

  setAuthenticated(authenticated: true): void {
    this.authenticated = authenticated;
  }

  setFullyAuthenticated(fullyAuthenticated: boolean): void {
    this.fullyAuthenticated = fullyAuthenticated;
  }

  setPayload(payload: Object): void { }

  setUser(user: UserInterface): void {
    this.user = user;
  }
}