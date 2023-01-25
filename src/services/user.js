import api from "@/services/api";

class UserService {
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  removeUser() {
    localStorage.removeItem('user');
  }

  me() {
    return api.get('me/').then(response => {
      this.setUser(response.data);
      return response.data;
    });
  }
}

export default new UserService();