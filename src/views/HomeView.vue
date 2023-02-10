<template>
  <div v-if="quizzes" class="container">
    <div class="row">
      <div class="col">
        <h1>{{ $t('quizzes.title') }}</h1>
        <ul class="list-group list-group-flush mb-3">
          <li v-for="item in quizzes" :key="item.id" class="list-group-item">
            <router-link :to="{name: 'quiz', params: {id: item.id}}">
              {{ item.name }} <font-awesome-icon icon="lock" v-show="isExpired(item)" />
            </router-link>
          </li>
        </ul>
        <div v-if="user.is_admin">
          <a @click.prevent="openCreateQuizModal()" href="#" class="btn btn-primary">{{ $t('createQuiz') }}</a>

          <div class="modal fade" id="createQuizModal" ref="createQuizModal" tabindex="-1" aria-labelledby="createQuizModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 id="createQuizModalLabel">{{ $t('createQuiz') }}</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="{{ $t('close') }}"></button>
                </div>
                <div class="modal-body">
                  <div class="row">
                    <div class="col">
                      <div class="form-floating mb-3">
                        <input v-model="form.name" type="text" class="form-control" id="idName" placeholder="{{ $t('quizForm.name') }}">
                        <label for="idName">{{ $t('quizForm.name') }}</label>
                      </div>
                      <div class="form-floating mb-3">
                        <input
                            v-model="form.expire_datetime"
                            type="datetime-local"
                            class="form-control"
                            id="idExpireDatetime"
                            placeholder="{{ $t('quizForm.expire_datetime') }}"
                        >
                        <label for="idExpireDatetime">{{ $t('quizForm.expire_datetime') }}</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ $t('close') }}</button>
                  <button @click.prevent="createQuiz()" type="button" class="btn btn-primary">{{ $t('createQuizButton') }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';
import { mapGetters } from 'vuex';
import { Modal } from 'bootstrap';

export default {
  name: 'HomeView',
  computed: {
    ...mapGetters({
      user: 'auth/user'
    }),
  },
  data() {
    return {
      quizzes: [],
      quizModal: null,
      form: {
        name: '',
        expire_datetime: ''
      }
    }
  },
  async created() {
    this.fetchQuizzes();
  },
  mounted() {
    this.$nextTick(() => {
      if (this.user.is_admin) {
        this.quizModal = Modal.getOrCreateInstance(this.$refs.createQuizModal)
      }
    });
  },
  methods: {
    fetchQuizzes() {
      api.get('quiz/').then(response => {
        this.quizzes = response.data;
      });
    },
    isExpired(item) {
      const now = new Date();
      const expire_datetime = new Date(item.expire_datetime);
      return expire_datetime < now;
    },
    openCreateQuizModal() {
      this.quizModal.show()
    },
    closeCreateQuizModal() {
      this.quizModal.hide()
    },
    createQuiz() {
      api.post('quiz/', this.form).then(response => {
        this.$nextTick(() => {
          this.$router.push({name: 'quiz', params: {id: response.data.id}});
        });
      }).finally(() => {
        this.closeCreateQuizModal()
      })
    }
  },
}
</script>
