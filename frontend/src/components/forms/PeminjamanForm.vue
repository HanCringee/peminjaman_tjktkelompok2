<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useAlatStore } from '@/stores/alat'
import { peminjamanSchema } from '@/utils/validators'
import { format } from 'date-fns'

const props = defineProps({
  initialData: { type: Object, default: null },
  isEditing: { type: Boolean, default: false },
  selectedAlatId: { type: Number, default: null },
})

const emit = defineEmits(['submit', 'cancel'])

const alatStore = useAlatStore()

const form = reactive({
  alat_id: null,
  jumlah: 1,
})

const errors = reactive({
  alat_id: '',
  jumlah: '',
})

function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

const wibTime = computed(() => {
  return format(new Date(), 'dd MMM yyyy HH:mm')
})

const kembaliTime = computed(() => {
  return format(addDays(new Date(), 7), 'dd MMM yyyy') + ' 11:30'
})

const isLoading = ref(false)
const alatList = ref([])

watch(
  () => props.selectedAlatId,
  (val) => {
    if (val) form.alat_id = val
  },
  { immediate: true },
)

watch(
  () => props.initialData,
  (val) => {
    if (val) {
      form.alat_id = val.alat_id || val.alat?.alat_id || null
      form.jumlah = val.jumlah || 1
    }
  },
  { immediate: true },
)

const selectedAlat = computed(() => {
  return alatList.value.find((a) => a.alat_id === form.alat_id)
})

onMounted(async () => {
  try {
    await alatStore.fetchAlat()
    alatList.value = alatStore.list
  } catch {
    alatList.value = []
  }
})

async function handleSubmit() {
  Object.keys(errors).forEach((k) => (errors[k] = ''))
  isLoading.value = true

  const data = {
    ...form,
    jumlah: Number(form.jumlah),
  }

  const result = peminjamanSchema.safeParse(data)
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
      <label class="block text-sm font-medium text-muted mb-1">Pilih Alat</label>
      <select
        v-model="form.alat_id"
        class="w-full px-4 py-2.5 border rounded-lg text-sm bg-background text-text focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
        :class="errors.alat_id ? 'border-danger' : 'border-muted/20'"
        :disabled="!!selectedAlatId"
      >
        <option :value="null" disabled>Pilih alat</option>
        <option v-for="a in alatList" :key="a.alat_id" :value="a.alat_id">
          {{ a.nama_alat }} (Stok: {{ a.stok }})
        </option>
      </select>
      <p v-if="errors.alat_id" class="text-danger text-xs mt-1">{{ errors.alat_id }}</p>
      <p v-if="selectedAlat" class="text-xs text-muted mt-1">
        Stok tersedia: {{ selectedAlat.stok }}
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium text-muted mb-1">Jumlah</label>
      <input
        v-model.number="form.jumlah"
        type="number"
        min="1"
        :max="selectedAlat?.stok || 99"
        class="w-full px-4 py-2.5 border rounded-lg text-sm bg-background text-text focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
        :class="errors.jumlah ? 'border-danger' : 'border-muted/20'"
      />
      <p v-if="errors.jumlah" class="text-danger text-xs mt-1">{{ errors.jumlah }}</p>
      <p
        v-if="selectedAlat && form.jumlah > selectedAlat.stok"
        class="text-danger text-xs mt-1"
      >
        Jumlah melebihi stok tersedia ({{ selectedAlat.stok }})
      </p>
    </div>

    <div class="bg-primary/50 rounded-lg border border-muted/10 px-4 py-3">
      <label class="block text-xs font-medium text-muted mb-1">Tanggal Pinjam (otomatis)</label>
      <p class="text-sm text-text font-medium flex items-center gap-2">
        <svg class="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ wibTime }} WIB
      </p>
    </div>

    <div class="bg-primary/50 rounded-lg border border-muted/10 px-4 py-3">
      <label class="block text-xs font-medium text-muted mb-1">Tanggal Kembali (otomatis)</label>
      <p class="text-sm text-text font-medium flex items-center gap-2">
        <svg class="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {{ kembaliTime }} WIB
      </p>
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
        {{ isLoading ? 'Menyimpan...' : isEditing ? 'Update' : 'Ajukan Peminjaman' }}
      </button>
    </div>
  </form>
</template>
