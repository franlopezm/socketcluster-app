export class LocalStorage {
  constructor(key) {
    this._key = key
    this._toParse = false
  }

  get() {
    const data = localStorage.getItem(this._key)

    if (this._toParse && data) return JSON.parse(data)

    return data
  }

  set(data) {
    if (data) {
      const t = typeof data
      const needParse = t !== 'string'

      localStorage.setItem(
        this._key,
        needParse ? JSON.stringify(data) : data
      )

      this._toParse = needParse
    }
  }

  remove() {
    localStorage.removeItem(this._key)
  }

  static cleanAll() {
    localStorage.clear()
  }
}

export const MenuStorage = new LocalStorage('menu_storage')