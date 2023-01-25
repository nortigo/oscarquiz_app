<template>
  <div v-if="quiz" class="container">
    <div class="row mb-3">
      <div class="col">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><router-link :to="{name: 'home'}">{{ $t('quizzes.title') }}</router-link></li>
            <li class="breadcrumb-item"><router-link :to="{name: 'quiz', params: {id: quiz.id}}">{{ quiz.name }}</router-link></li>
            <li class="breadcrumb-item active" aria-current="page">{{ $t('play.action') }}</li>
          </ol>
        </nav>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col">
        <h1>{{ quiz.name }}</h1>
      </div>
    </div>
    <div class="row">
      <div v-if="category" class="col-12 col-md-6 offset-md-3">
        <h2 class="mb-3">{{ start + 1}}/{{ total }} - {{ category.label }}</h2>
        <form @submit.prevent="nextCategory">
          <div class="card">
            <div class="card-body">
              <div v-for="nominee in category.nominees" :key="nominee.id" class="form-check">
                <input
                    v-model="form.nominee_id"
                    :id="`answer-${nominee.id}`"
                    :checked="category.answer.nominee.id === nominee.id"
                    :value="nominee.id"
                    class="form-check-input"
                    type="radio"
                    name="answer"
                >
                <label class="form-check-label" :for="`answer-${nominee.id}`">
                  {{ nominee.name }}
                </label>
              </div>
            </div>
            <div class="card-footer text-end">
              <button type="submit" class="btn btn-primary">
                <span v-if="!isLast()">{{ $t('next') }}</span>
                <span v-else>{{ $t('finish') }}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  name: "PlayView",
  data () {
    return {
      quiz: null,
      nominees: [],
      answers: [],
      category: null,
      start: 0,
      total: 0,
      form: {
        nominee_id: null
      }
    }
  },
  async created() {
    this.fetchQuiz().then(() => {
      if (this.isExpired()) {
        this.$router.push({name: 'quiz', params: {id: this.quiz.id}});
        return;
      }
      let promises = [
        this.fetchNominees(),
        this.fetchAnswers()
      ];
      Promise.allSettled(promises).then(() => {
        this.total = this.nominees.length;
        this.compileData();
        this.category = this.nominees[this.start];
      });
    });
  },
  methods: {
    fetchQuiz() {
      return api.get(`quiz/${this.$route.params.id}/`).then(response => {
        this.quiz = response.data;
      });
    },
    fetchNominees() {
      return api.get(`quiz/${this.$route.params.id}/nominees/`).then(response => {
        this.nominees = response.data;
      });
    },
    fetchAnswers() {
      return api.get(`quiz/${this.$route.params.id}/answers/`).then(response => {
        this.answers = response.data;
      });
    },
    isExpired() {
      const now = new Date();
      const expire_datetime = new Date(this.quiz.expire_datetime);
      return expire_datetime < now;
    },
    compileData() {
      for (let nominees_idx in this.nominees) {
        this.nominees[nominees_idx]['answer'] = null;

        for (let answer of this.answers) {
          if (this.nominees[nominees_idx].value !== answer.category) {
            continue;
          }

          for (let nominee_idx in this.nominees[nominees_idx].nominees) {
            if (answer.nominee.id === this.nominees[nominees_idx].nominees[nominee_idx].id) {
              this.nominees[nominees_idx]['answer'] = answer;

              if (this.start === parseInt(nominees_idx)) {
                this.form.nominee_id = answer.nominee.id;
              }

              break;
            }
          }
        }
      }
    },
    isLast() {
      return this.start === this.total - 1;
    },
    nextCategory() {
      let url = 'answer/';
      let response = null;

      if (this.category.answer) {
        url += `${this.category.answer.id}/?qid=${this.$route.params.id}`;
        response = api.put(url, this.form);
      } else {
        url += `?qid=${this.$route.params.id}`;
        response = api.post(url, this.form);
      }

      response.then(() => {
        if (this.isLast()) {
          this.$router.push({name: 'quiz', params: {id: this.quiz.id}});
          return;
        }

        this.start++;
        this.category = this.nominees[this.start];

        if (this.category.answer) {
          this.form.nominee_id = this.category.answer.nominee.id;
        }
      }).catch((err) => {
        console.error(err);
      });
    }
  }
}
</script>
