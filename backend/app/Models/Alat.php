<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alat extends Model
{
    use HasFactory;

    protected $table = 'alat';

    protected $primaryKey = 'alat_id';

    protected $fillable = [
        'nama_alat',
        'kategori',
        'stok',
        'kondisi'
    ];
}
