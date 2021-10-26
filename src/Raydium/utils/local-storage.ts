/*
Some of these codes borrowed from RaydiumUI https://github.com/raydium-io/raydium-ui
Trying to R&D for possiblity of integrating Raydium with my own UI in react
By Christopher K Y Chee ketyung@techchee.com
*/

export default class LocalStorage {
  static get(name: string) {
    return localStorage.getItem(name)
  }

  static set(name: string, val: any) {
    return localStorage.setItem(name, val)
  }
}
