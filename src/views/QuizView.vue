<template>
  <div v-if="quiz" class="container">
    <div class="row mb-3">
      <div class="col">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><router-link :to="{name: 'home'}">{{ $t('quizzes.title') }}</router-link></li>
            <li class="breadcrumb-item active" aria-current="page">{{ quiz.name }}</li>
          </ol>
        </nav>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col">
        <h1>{{ quiz.name }}</h1>
        <p v-show="hasExpired()" class="alert alert-danger"><font-awesome-icon icon="lock" /> {{ $t('quizClosed') }}</p>
      </div>
    </div>
    <div v-show="canPlay && !hasExpired()" class="row mb-3">
      <div class="col">
        <router-link :to="{name: 'play', params: {id: quiz.id}}" class="btn btn-primary btn-lg d-block text-uppercase"><font-awesome-icon icon="play" /> {{ $t('play.action') }}</router-link>
      </div>
    </div>
    <div v-show="!canPlay && !quiz.archived" class="row mb-3">
      <div class="col">
        <a @click.prevent="refresh" href="#" class="btn btn-success"><font-awesome-icon icon="arrows-rotate" /> {{ $t('refresh') }}</a>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col">
        <h2>{{ $t('ranking') }}</h2>

        <table class="table table-sm">
          <thead>
          <tr>
            <th class="col-1">#</th>
            <th>{{ $t('name') }}</th>
            <th class="text-end">{{ $t('score') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(player, index) in players" :key="player.id">
            <td class="col-1">{{ getRank(index) }}</td>
            <td>{{ player.name }}</td>
            <td class="text-end">{{ player.score }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mb-3">
      <div class="row">
        <div class="col">
          <h2>{{ $t('nominees') }}</h2>
        </div>
      </div>
      <div class="row row-cols-1 row-cols-md-4 g-4">
        <div v-for="(item, index) in nominees" :key="item.value" class="col">
          <div class="card h-100 mb-3">
            <div class="card-header">
              <h5 class="m-0">{{ item.label }}</h5>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush m-0">
                <li v-for="nominee in item.nominees" :key="nominee.id" :class="[nominee.is_winner ? 'text-success-emphasis' : '', 'list-group-item']">
                  <font-awesome-icon icon="trophy" v-show="nominee.is_winner" /> {{ nominee.name }}
                </li>
              </ul>
            </div>
            <div v-if="user.is_admin" class="card-footer text-end">
              <a href="#" class="btn btn-success" @click.prevent="openWinnerModal(index)">
                {{ $t('setWinnerLabel') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL -->
    <div class="modal fade" id="winnerModal" ref="winnerModal" tabindex="-1" aria-labelledby="winnerModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div v-if="selectedCategory" class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="winnerModalLabel">{{ selectedCategory.label }}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="{{ $t('close') }}"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col">
                <div v-for="nominee of selectedCategory.nominees" :key="nominee.id" class="form-check">
                  <input
                      :id="`idWinner${nominee.id}`"
                      :value="nominee.id"
                      v-model="nomineeId"
                      class="form-check-input"
                      type="radio"
                      name="winner"
                  >
                  <label :for="`idWinner${nominee.id}`" class="form-check-label">
                    {{ nominee.name }}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">{{ $t('close') }}</button>
            <button @click.prevent="setWinner()" type="button" class="btn btn-primary">{{ $t('setOscarToLabel') }}</button>
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
  name: 'QuizView',
  data () {
    return {
      quiz: null,
      players: [],
      nominees: [],
      selectedCategory: null,
      winnerModal: null,
      nomineeId: null
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    }),
    canPlay() {
      for (let player of this.players) {
        if (player.user_id === this.user.id && player.can_play) {
          return true;
        }
      }
      return false;
    }
  },
  mounted() {
    Promise.allSettled([
      this.fetchQuiz(),
      this.fetchPlayers(),
      this.fetchNominees()
    ]).then(() => {
      this.$nextTick(() => {
        this.winnerModal = Modal.getOrCreateInstance(this.$refs.winnerModal);
      });
    });
  },
  methods: {
    refresh() {
      this.fetchQuiz();
      this.fetchPlayers();
      this.fetchNominees();
    },
    fetchQuiz() {
      return api.get(`quiz/${this.$route.params.id}/`).then(response => {
        this.quiz = response.data;
      });
    },
    fetchPlayers() {
      return api.get(`quiz/${this.$route.params.id}/players/`).then(response => {
        this.players = response.data;
      });
    },
    fetchNominees() {
      return api.get(`quiz/${this.$route.params.id}/nominees/`).then(response => {
        this.nominees = response.data;
      });
    },
    hasExpired() {
      const now = new Date();
      const expire_datetime = new Date(this.quiz.expire_datetime);
      return expire_datetime < now;
    },
    getRank(index) {
      return index + 1;
    },
    openWinnerModal(index) {
      this.selectedCategory = this.nominees[index];
      this.winnerModal.show();
    },
    setWinner() {
      api.patch(`nominee/${this.nomineeId}/winner/?qid=${this.$route.params.id}`).then(() => {
        this.winnerModal.hide();
        this.$nextTick(() => {
          this.refresh();
        })
      }).finally(() => {
        this.nomineeId = null;
      });
    }
  },
}
</script>
