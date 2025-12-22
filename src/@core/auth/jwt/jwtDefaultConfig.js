// ** Auth Endpoints
export default {
  loginEndpoint: "/jwt/login",
  registerEndpoint: "/jwt/register",
  refreshEndpoint: "/jwt/refresh-token",
  logoutEndpoint: "/jwt/logout",

  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: "Bearer",

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: "accessToken",
  storageRefreshTokenKeyName: "refreshToken", 
   onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter((callback) =>
      callback(accessToken)
    );
  },

  addSubscriber(callback) {
    this.subscribers.push(callback);
  },

  getToken() {
    return localStorage.getItem(this.storageTokenKeyName);
  },

  getRefreshToken() {
    return localStorage.getItem(this.storageRefreshTokenKeyName);
  },

  setToken(value) {
    localStorage.setItem(this.storageTokenKeyName, value);
  },

  setRefreshToken(value) {
    localStorage.setItem(this.storageRefreshTokenKeyName, value);
  },

  login(...args) {
    return axios.post(this.loginEndpoint, ...args);
  },

  register(...args) {
    return axios.post(this.registerEndpoint, ...args);
  },

  refreshToken() {
    return axios.post(this.refreshEndpoint, {
      refreshToken: this.getRefreshToken(),
    });
  }
}
