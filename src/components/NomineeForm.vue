<template>
  <div ref="nomineesFormModal" class="modal fade" id="addNomineesModal" tabindex="-1" aria-labelledby="addNomineesModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="addNomineesModalLabel">{{ categoryLabel }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="{{ $t('close') }}"></button>
        </div>
        <div class="modal-body">
          <div v-for="(nominee, index) in nominees" :key="index" class="row mb-3">
            <input v-model="nominee.id" type="hidden">

            <div class="col-11">
              <label
                  :for="`name${index}`"
                  class="visually-hidden"
              >{{ $t('nomineeRowForm.name') }}</label>
              <input
                  v-model="nominee.name"
                  :id="`name${index}`"
                  :class="['form-control']"
                  :placeholder="$t('nomineeRowForm.name')"
                  type="text"
              />
            </div>
            <div v-if="!nominee.id" class="col-1 d-flex align-items-center justify-content-end">
              <a href="#" @click.prevent="removeRow(index)">
                <font-awesome-icon icon="trash" />
              </a>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click.prevent="addRow(null)" type="button" class="btn btn-link">{{ $t('addNominee') }}</button>
          <button @click.prevent="closeModal()" type="button" class="btn btn-secondary">{{ $t('close') }}</button>
          <button @click.prevent="save()" type="button" class="btn btn-primary">{{ $t('save') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Modal} from "bootstrap"
import api from '@/services/api'

export default {
  name: 'NomineeForm',
  props: {
    quiz: Object,
    modalRef: String,
    selectedCategory: {
      type: Object,
      default() {
        return null
      }
    },
  },
  data() {
    return {
      modal: null,
      category: null,
      categoryLabel: '',
      nominees: []
    }
  },
  watch: {
    selectedCategory() {
      if (this.selectedCategory) {
        this.category = this.selectedCategory.value
        this.categoryLabel = this.selectedCategory.label
        this.nominees = [...this.selectedCategory.nominees]
      } else {
        this.category = null
        this.categoryLabel = ''
        this.nominees = []
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.modal = Modal.getOrCreateInstance(this.$refs.nomineesFormModal);
    })
  },
  methods: {
    openModal() {
      this.modal.show()
    },
    closeModal() {
      this.$emit('refresh')
      this.modal.hide()
    },
    save() {
      api.post(`nominees/?qid=${this.$route.params.id}&category=${this.category}`, this.nominees).then(() => {
        this.$nextTick(() => {
          this.closeModal()
        })
      })
    },
    addRow() {
      this.nominees.push({name: ''})
    },
    removeRow(index) {
      this.nominees.splice(index, 1)
    }
  }
}
</script>