const user = JSON.parse(localStorage.getItem('user'));
const tokens = JSON.parse(localStorage.getItem('tokens'));
const initialUserState = user
  ? { user }
  : { user: null };
const initialTokenState = tokens
  ? { tokens }
  : { tokens: { access: null, refresh: null } };

export default {
  namespaced: true,
  state: {
    ...initialUserState,
    ...initialTokenState
  },
  getters: {
    authenticated (state) {
      return !!state.user;
    },
    user (state) {
      return state.user;
    }
  },
  mutations: {
    SET_TOKENS (state, { access, refresh }) {
      state.tokens.access = access;
      state.tokens.refresh = refresh;
    },
    SET_USER (state, user) {
      state.user = user
    },
    REFRESH_TOKEN (state, access) {
      state.tokens.access = access;
    },
    RESET (state) {
      state.user = null;
      state.tokens.access = null;
      state.tokens.refresh = null;
    }
  },
  actions: {
    signIn({ commit }, { access, refresh }) {
      commit('SET_TOKENS', access, refresh);
    },
    refreshToken({ commit }, access) {
      commit('REFRESH_TOKEN', access);
    },
    signOut({ commit }) {
      commit('RESET');
    },
    setUser({ commit }, user) {
      commit('SET_USER', user);
    }
  }
}