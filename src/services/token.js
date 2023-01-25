class TokenService {
  getLocalRefreshToken() {
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    return tokens?.refresh;
  }

  getLocalAccessToken() {
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    return tokens?.access;
  }

  updateLocalAccessToken(token) {
    let tokens = JSON.parse(localStorage.getItem('tokens'));
    tokens.access = token;
    localStorage.setItem('tokens', JSON.stringify(tokens));
  }

  setTokens(data) {
    localStorage.setItem('tokens', JSON.stringify(data));
  }
  removeTokens() {
    localStorage.removeItem('tokens');
  }
}

export default new TokenService();