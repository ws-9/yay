export default class User {
  constructor(id = 0, username = "", roles = []) {
    this.id = id
    this.username = username
    this.roles = roles
  }
}