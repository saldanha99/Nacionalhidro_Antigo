import axios from 'axios'
import auth from './auth'
import { Redirect } from 'react-router-dom'

const URL_API = process.env.REACT_APP_BACKEND_URL

class Service {
  constructor() {
    const service = axios.create({
      baseURL: URL_API,
      timeout: 2000000
    })
    service.interceptors.request.use(this.handleRequest)
    service.interceptors.response.use(this.handleSuccess, this.handleError)
    this.service = service
  }

  handleRequest(config) {
    const token = auth.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }

  handleSuccess(response) {
    return response
  }

  handleError = (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      auth.clearToken()
      auth.clearUserInfo()
      window.location.reload()
    }
    return Promise.reject(error)
  };

  get(path, callback) {
    return this.service.get(path).then(
      (response) => callback(response.data)
    )
    .catch((err) => callback(err.response))
  }

  put(path, payload, callback) {
    return this.service.request({
      method: 'PUT',
      url: path,
      responseType: 'json',
      data: payload
    }).then((response) => callback(response.status, response.data))
    .catch((err) => (console.log(err)))
  }

  postUntype(path, payload, responseType, callback) {
    return this.service
      .request({
        method: "POST",
        url: path,
        data: payload,
        responseType,
      })
      .then((response) => {
        return callback(response.status, response.data);
      })
      .catch((err) => callback(err));
  }

  post(path, payload, callback) {
    return this.service.request({
      method: 'POST',
      url: path,
      responseType: 'json',
      data: payload
    }).then((response) => callback(response.status, response.data))
    .catch((err) => callback(err.response.status, err.response))
  }

  delete(path, callback) {
    return this.service.request({
      method: 'DELETE',
      url: path,
      responseType: 'json'
    }).then((response) => callback(response.status, response.data))
    .catch((err) => callback(err.response.status, err.response))
  }
  
}

export default new Service()