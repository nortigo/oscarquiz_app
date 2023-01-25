<template>
  <div class="container">
    <div class="row">
      <div class="col-12 col-md-4 offset-md-4 mt-5">
        <form @submit.prevent="register">
          <h1 class="h3 mb-3 fw-normal">{{ $t('register.title') }}</h1>

          <div class="form-floating mb-3">
            <input v-model="form.first_name"  type="text" :class="['form-control', {'is-invalid': v$.form.first_name.$errors.length}]" id="idFirstName">
            <label for="idFirstName">{{ $t('register.firstNameLabel') }}</label>
            <div v-for="error of v$.form.first_name.$errors" :key="error.$uid" :class="[{'invalid-feedback': v$.form.first_name.$errors.length}]">{{ error.$message }}</div>
          </div>
          <div class="form-floating mb-3">
            <input v-model="form.last_name"  type="text" :class="['form-control', {'is-invalid': v$.form.last_name.$errors.length}]" id="idLastName">
            <label for="idLastName">{{ $t('register.lastNameLabel') }}</label>
            <div v-for="error of v$.form.last_name.$errors" :key="error.$uid" :class="[{'invalid-feedback': v$.form.last_name.$errors.length}]">{{ error.$message }}</div>
          </div>
          <div class="form-floating mb-3">
            <input v-model="form.email"  type="email" :class="['form-control', {'is-invalid': v$.form.email.$errors.length}]" id="floatingInput" placeholder="{{ $t('register.emailPlaceholder') }}">
            <label for="floatingInput">{{ $t('register.emailLabel') }}</label>
            <div v-for="error of v$.form.email.$errors" :key="error.$uid" :class="[{'invalid-feedback': v$.form.email.$errors.length}]">{{ error.$message }}</div>
          </div>
          <div class="form-floating mb-3">
            <input v-model="form.password" :class="['form-control', {'is-invalid': v$.form.password.$errors.length}]" type="password" id="floatingPassword">
            <label for="floatingPassword">{{ $t('register.passwordLabel') }}</label>
            <div v-for="error of v$.form.password.$errors" :key="error.$uid" :class="[{'invalid-feedback': v$.form.password.$errors.length}]">{{ error.$message }}</div>
          </div>

          <button class="w-100 btn btn-lg btn-primary mb-3" type="submit">{{ $t('register.createAccountBtn') }}</button>

          <i18n-t keypath="haveAnAccount" tag="p">
            <template v-slot:signInNow>
              <router-link :to="{name: 'login'}">
                {{ $t('register.signInNow') }}
              </router-link>
            </template>
          </i18n-t>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { helpers, required, email, minLength } from '@vuelidate/validators'
import authService from '@/services/auth';

export default {
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      form: {
        email: '',
        password: '',
        first_name: '',
        last_name: ''
      },
      vuelidateExternalResults: {
        form: {
          email: [],
          password: [],
          first_name: [],
          last_name: []
        },
      }
    }
  },
  validations() {
    return {
      form: {
        email: {
          required: helpers.withMessage(this.$t('messages.required'), required),
          email: helpers.withMessage(this.$t('messages.email'), email)
        },
        password: {
          required: helpers.withMessage(this.$t('messages.required'), required),
          min: helpers.withMessage(({$params}) => this.$t('messages.password_min', {min: $params.min}), minLength(8)) },
        first_name: {
          required: helpers.withMessage(this.$t('messages.required'), required),
        },
        last_name: {
          required: helpers.withMessage(this.$t('messages.required'), required),
        }
      }
    }
  },
  methods: {
    register() {
      this.v$.$touch();
      if (this.v$.$error) return;
      authService.signUp(this.form).then(() => {
        this.$router.push({name: 'login'});
      }).catch((err) => {
        Object.assign(this.vuelidateExternalResults.form, err.response.data);
      }).finally(() => {
        this.$nextTick(() => { this.v$.$reset(); });
      });
    }
  }
}
</script>