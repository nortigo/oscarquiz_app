<template>
  <div class="container">
    <div class="row">
      <div class="col-12 col-md-4 offset-md-4 mt-5">
        <form @submit.prevent="login">
          <h1 class="h3 mb-3 fw-normal">{{ $t('login.pleaseSignIn') }}</h1>

          <div class="form-floating mb-3">
            <input v-model="form.email"  type="email" class="form-control" id="idEmail" placeholder="{{ $t('login.emailPlaceholder') }}">
            <label for="idEmail">{{ $t('login.emailLabel') }}</label>
          </div>
          <div class="form-floating mb-3">
            <input v-model="form.password" type="password" class="form-control" id="idPassword" placeholder="{{ $t('login.passwordLabel') }}">
            <label for="idPassword">{{ $t('login.passwordLabel') }}</label>
          </div>

          <button class="w-100 btn btn-lg btn-primary mb-3" type="submit">{{ $t('login.title') }}</button>

          <i18n-t keypath="createAccountText" tag="p">
            <template v-slot:registerNowLabel>
              <router-link :to="{name: 'register'}">
                {{ $t('login.registerNowLabel') }}
              </router-link>
            </template>
          </i18n-t>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import authService from '@/services/auth';
import userService from '@/services/user';

export default {
  data() {
    return {
      'form': {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    login() {
      authService.signIn(this.form).then((data) => {
        this.$store.dispatch('auth/signIn', data);
        userService.me().then((userData) => {
          this.$store.dispatch('auth/setUser', userData);
          this.$router.push({name: 'home'})
        });
      });
    }
  }
}
</script>