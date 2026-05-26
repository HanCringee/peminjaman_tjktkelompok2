<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $table = (new \App\Models\Peminjaman)->getTable();
        DB::statement("ALTER TABLE {$table} MODIFY COLUMN tanggal_kembali DATETIME NOT NULL");
    }

    public function down(): void
    {
        $table = (new \App\Models\Peminjaman)->getTable();
        DB::statement("ALTER TABLE {$table} MODIFY COLUMN tanggal_kembali DATE NOT NULL");
    }
};
