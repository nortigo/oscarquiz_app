<template>
  <nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
    <div class="container-fluid">
      <router-link :to="{name: 'home'}" class="navbar-brand">Oscar Quiz</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <template v-if="authenticated">
            <li class="nav-item">
              <a href="#" class="nav-link" @click.prevent="logout">{{ $t('logout.title') }}</a>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <router-link :to="{name: 'register'}" class="nav-link">{{ $t('register.title') }}</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{name: 'login'}" class="nav-link">{{ $t('login.title') }}</router-link>
            </li>
          </template>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ $i18n.locale }}
            </a>
            <ul class="dropdown-menu">
              <li v-for="(lang, i) in $i18n.availableLocales" :key="`Lang${i}`">
                <a class="dropdown-item" href="#" @click.prevent="setLocale(lang)">{{ lang }}</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>


<script>
import AuthService from '@/services/auth';
import UserService from '@/services/user';
import { mapGetters } from 'vuex'

export default {
  name: 'NavBar',
  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated',
      user: 'auth/user'
    })
  },
  methods: {
    logout() {
      AuthService.logout();
      UserService.removeUser();
      this.$store.dispatch('auth/signOut');
      this.$router.push({name: 'login'});
    },
    setLocale(locale) {
      this.$i18n.locale = locale;
    }
  },
  watch: {
    '$i18n.locale': function(newVal) {
      localStorage.setItem('last-locale', newVal);
    }
  }
}
</script>