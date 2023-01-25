import api from "@/services/api";
import TokenService from "@/services/token";

class AuthService {
  signIn({ email, password }) {
    return api
      .post("token/", {
        username: email,
        password: password
      })
      .then((response) => {
        if (response.data.access) {
          TokenService.setTokens(response.data);
        } else {
          this.$store.dispatch('auth/signOut');
          TokenService.removeTokens();
        }

        return response.data;
      });
  }

  logout() {
    TokenService.removeTokens();
  }

  signUp({ email, password, first_name, last_name }) {
    return api.post("register/", {
      email: email,
      password: password,
      first_name: first_name,
      last_name: last_name
    }).then(response => {
      return response.data;
    });
  }
}

export default new AuthService();