<script setup>
import { ref, reactive, watch } from 'vue'
import { alatSchema } from '@/utils/validators'

const props = defineProps({
  initialData: { type: Object, default: null },
  isEditing: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  nama_alat: '',
  kategori: '',
  stok: 0,
  kondisi: 'Baik',
})

const errors = reactive({
  nama_alat: '',
  kategori: '',
  stok: '',
  kondisi: '',
})

const isLoading = ref(false)

const kategoriOptions = ['Pengukuran', 'Pengujian', 'Perkakas', 'Keamanan', 'Lainnya']
const kondisiOptions = ['Baik', 'Rusak', 'Perlu Perbaikan']

watch(
  () => props.initialData,
  (val) => {
    if (val) {
      form.nama_alat = val.nama_alat || ''
      form.kategori = val.kategori || ''
      form.stok = val.stok ?? 0
      form.kondisi = val.kondisi || 'Baik'
    }
  },
  { immediate: true },
)

async function handleSubmit() {
  Object.keys(errors).forEach((k) => (errors[k] = ''))
  isLoading.value = true

  const data = {
    ...form,
    stok: Number(form.stok),
  }

  const result = alatSchema.safeParse(data)
  if (!result.success) {
    result.error.errors.forEach((err) => {
      if (errors[err.path[0]] !== undefined) {
        errors[err.path[0]] = err.message
      }
    })
    isLoading.value = false
    return
  }

  try {
    await emit('submit', data)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-5">
    <div>
      <label class="block text-sm font-medium text-muted mb-1">Nama Alat</label>
      <input
        v-model="form.nama_alat"
        type="text"
        class="w-full px-4 py-2.5 border rounded-lg text-sm bg-background text-text focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
        :class="errors.nama_alat ? 'border-danger' : 'border-muted/20'"
        placeholder="Masukkan nama alat"
      />
      <p v-if="errors.nama_alat" class="text-danger text-xs mt-1">{{ errors.nama_alat }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-muted mb-1">Kategori</label>
      <select
        v-model="form.kategori"
        class="w-full px-4 py-2.5 border rounded-lg text-sm bg-background text-text focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
        :class="errors.kategori ? 'border-danger' : 'border-muted/20'"
      >
        <option value="" disabled>Pilih kategori</option>
        <option v-for="k in kategoriOptions" :key="k" :value="k">{{ k }}</option>
      </select>
      <p v-if="errors.kategori" class="text-danger text-xs mt-1">{{ errors.kategori }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-muted mb-1">Stok</label>
      <input
        v-model.number="form.stok"
        type="number"
        min="0"
        class="w-full px-4 py-2.5 border rounded-lg text-sm bg-background text-text focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
        :class="errors.stok ? 'border-danger' : 'border-muted/20'"
      />
      <p v-if="errors.stok" class="text-danger text-xs mt-1">{{ errors.stok }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-muted mb-1">Kondisi</label>
      <select
        v-model="form.kondisi"
        class="w-full px-4 py-2.5 border rounded-lg text-sm bg-background text-text focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
        :class="errors.kondisi ? 'border-danger' : 'border-muted/20'"
      >
        <option v-for="k in kondisiOptions" :key="k" :value="k">{{ k }}</option>
      </select>
      <p v-if="errors.kondisi" class="text-danger text-xs mt-1">{{ errors.kondisi }}</p>
    </div>

    <div class="flex justify-end gap-3 pt-2">
      <button
        type="button"
        @click="emit('cancel')"
        class="px-4 py-2 text-sm font-medium text-text bg-primary border border-muted/20 rounded-lg hover:bg-surface transition"
      >
        Batal
      </button>
      <button
        type="submit"
        :disabled="isLoading"
        class="px-6 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-accent disabled:opacity-50 transition"
      >
        {{ isLoading ? 'Menyimpan...' : isEditing ? 'Update' : 'Simpan' }}
      </button>
    </div>
  </form>
</template>
