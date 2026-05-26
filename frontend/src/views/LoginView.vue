<script setup>
import LoginForm from '@/components/forms/LoginForm.vue'
</script>

<template>
  <div class="min-h-[calc(100vh-8rem)] bg-[radial-gradient(circle_at_top,_rgba(92,131,116,0.18),_transparent_28%),linear-gradient(180deg,_#081116_0%,_#0a161b_100%)] px-4 py-12">
    <div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <section class="hidden rounded-[2rem] bg-surface/80 p-10 shadow-[0_30px_80px_rgba(0,0,0,0.35)] border border-muted/20 lg:block">
        <div class="max-w-lg space-y-6">
          <p class="text-sm uppercase tracking-[0.32em] text-accent">Selamat Datang di TJKT</p>
          <h1 class="text-4xl font-semibold text-text leading-tight">Login untuk mengelola pinjaman dan akses profil.</h1>
          <p class="text-base text-muted leading-relaxed">Masuk dengan NIS dan password kamu. Setelah login, kamu bisa mengubah profil, mengunggah foto, dan melihat riwayat peminjaman alat.</p>
          <div class="grid gap-4 text-sm text-text/80">
            <div class="rounded-2xl bg-background/80 p-4 border border-muted/15">• Tampilan modern sesuai tema TJKT</div>
            <div class="rounded-2xl bg-background/80 p-4 border border-muted/15">• Keamanan login dengan Laravel Sanctum</div>
            <div class="rounded-2xl bg-background/80 p-4 border border-muted/15">• Profil dapat memperbarui nama, email, password, dan foto</div>
          </div>
        </div>
      </section>

      <div class="rounded-[2rem] bg-surface/95 p-8 shadow-[0_30px_60px_rgba(0,0,0,0.35)] border border-muted/20">
        <LoginForm />
      </div>
    </div>
  </div>
</template>
