import { isEmpty } from "lodash"
import jwt from "jsonwebtoken"

const TOKEN_KEY = "jwtToken"
const USER_INFO = "userInfo"
const STRONG_KEY = "strongKey"

const parse = JSON.parse
const stringify = JSON.stringify

const auth = {
  /**
   * Remove an item from the used storage
   * @param  {String} key [description]
   */
  clear(key) {
    if (localStorage && localStorage.getItem(key)) {
      return localStorage.removeItem(key)
    }

    if (sessionStorage && sessionStorage.getItem(key)) {
      return sessionStorage.removeItem(key)
    }

    return null
  },

  /**
   * Clear all app storage
   */
  clearAppStorage() {
    if (localStorage) {
      localStorage.clear()
    }

    if (sessionStorage) {
      sessionStorage.clear()
    }
  },

  clearToken(tokenKey = TOKEN_KEY) {
    return auth.clear(tokenKey)
  },

  clearUserInfo(userInfo = USER_INFO) {
    return auth.clear(userInfo)
  },
  clearStrongKey(strongKey = STRONG_KEY) {
    return auth.clear(strongKey)
  },

  /**
   * Returns data from storage
   * @param  {String} key Item to get from the storage
   * @return {String|Object}     Data from the storage
   */
  get(key) {
    if (localStorage && localStorage.getItem(key)) {
      return parse(localStorage.getItem(key)) || null
    }

    if (sessionStorage && sessionStorage.getItem(key)) {
      return parse(sessionStorage.getItem(key)) || null
    }

    return null
  },

  getToken(tokenKey = TOKEN_KEY) {
    return auth.get(tokenKey)
  },

  isUserLoggedIn() {
    return auth.get(TOKEN_KEY)
  },

  getUserInfo(userInfo = USER_INFO) {
    return auth.get(userInfo)
  },

  getStronkKey(strongKey = STRONG_KEY) {
    return auth.get(strongKey)
  },

  /**
   * Set data in storage
   * @param {String|Object}  value    The data to store
   * @param {String}  key
   * @param {Boolean} isLocalStorage  Defines if we need to store in localStorage or sessionStorage
   */
  set(value, key, isLocalStorage) {
    if (isEmpty(value)) {
      return null
    }

    if (isLocalStorage && localStorage) {
      return localStorage.setItem(key, stringify(value))
    }

    if (sessionStorage) {
      return sessionStorage.setItem(key, stringify(value))
    }

    return null
  },

  setToken(value = "", isLocalStorage = false, tokenKey = TOKEN_KEY) {
    return auth.set(value, tokenKey, isLocalStorage)
  },

  setUserInfo(value = "", isLocalStorage = false, userInfo = USER_INFO) {
    return auth.set(value, userInfo, isLocalStorage)
  },
  setStrongKey(key, isLocalStorage = false) {
    auth.set(key, STRONG_KEY, isLocalStorage)
  },

  userHasPermission(role, arrayPermission) {
    return arrayPermission.includes(role.name)
  },
  isAdmin(role) {
    return "Gerencial".includes(role?.name)
  },
  isCreator(role) {
    return "Creator".includes(role?.name)
  },
  validToken() {
    const token = auth.getToken()
    const jwtKey = process.env.REACT_APP_JWT_SECRET
    return jwt.verify(token, jwtKey, (err, decoded) => {
      if (err && err.message === 'jwt expired') {
        swal({
            title: 'Sessão encerrada!',
            text: 'A sessão foi encerrada.',
            icon: 'warning',
            timer: 5000,
            buttons: false
        })
        .then(() => {
          auth.clearToken()
          auth.clearUserInfo()
          return false
        })
      }
      if (err) {
        auth.clearToken()
        auth.clearUserInfo()
        return false
      } else if (decoded.exp < (Date.parse())) {
        auth.clearToken()
        auth.clearUserInfo()
        return false
      }
      return true
    })
  }
}

export default auth
