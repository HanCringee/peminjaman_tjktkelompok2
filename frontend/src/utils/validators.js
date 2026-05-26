import { z } from 'zod'

export const registerSchema = z.object({
  nik: z
    .string()
    .min(1, 'NIS diperlukan'),
  name: z
    .string()
    .min(3, 'Nama minimal 3 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter'),
})

export const loginSchema = z.object({
  nik: z.string().min(1, 'NIS diperlukan'),
  password: z.string().min(1, 'Password diperlukan'),
})

export const alatSchema = z.object({
  nama_alat: z
    .string()
    .min(3, 'Nama minimal 3 karakter')
    .max(255, 'Nama maksimal 255 karakter'),
  kategori: z.string().min(1, 'Kategori diperlukan'),
  stok: z
    .number({ invalid_type_error: 'Stok harus angka' })
    .min(0, 'Stok tidak boleh negatif')
    .int('Stok harus angka bulat'),
  kondisi: z.string().min(1, 'Kondisi diperlukan'),
})

export const peminjamanSchema = z.object({
    alat_id: z.number({ invalid_type_error: 'Alat diperlukan' }).min(1, 'Alat diperlukan'),
    jumlah: z
      .number({ invalid_type_error: 'Jumlah harus angka' })
      .min(1, 'Jumlah minimal 1')
      .int('Jumlah harus angka bulat'),
  })
