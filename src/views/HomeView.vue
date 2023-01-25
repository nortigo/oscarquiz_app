<template>
  <div v-if="quizzes" class="container">
    <div class="row">
      <div class="col">
        <h1>{{ $t('quizzes.title') }}</h1>
        <ul class="list-group list-group-flush">
          <li v-for="item in quizzes" :key="item.id" class="list-group-item">
            <router-link :to="{name: 'quiz', params: {id: item.id}}">
              {{ item.name }} <font-awesome-icon icon="lock" v-show="isExpired(item)" />
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  name: 'HomeView',
  data() {
    return {
      'quizzes': []
    }
  },
  async created() {
    this.fetchQuizzes();
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
    }
  },
}
</script>
