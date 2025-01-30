<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Docente;
use App\Models\Proyecto;

class Tribunal extends Model
{
    use HasFactory;
    protected $table = 'tribunals';
    protected $primaryKey = 'id_tribunal';

    protected $fillable = [
        'id_proyecto',
        'id_docente',
        'rol',
    ];

    public function proyecto()
    {
        return $this->belongsTo(Proyecto::class, 'id_proyecto', 'id_proyecto');
    }

    public function docente()
    {
        return $this->belongsTo(Docente::class, 'id_docente', 'id_docente');
    }
}
