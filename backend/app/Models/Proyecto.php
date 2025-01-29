<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proyecto extends Model
{
    use HasFactory;
    protected $table = 'proyectos';
    protected $primaryKey = 'id_proyecto';

    protected $fillable = [
        'titulo',
        'descripcion',
        'fecha_inicio',
        'fecha_fin',
        'estado',
        'id_estudiante',
        'id_tutor',
    ];

    public function estudiante()
    {
        return $this->belongsTo(Estudiante::class, 'id_estudiante', 'id_estudiante');
    }

    public function tutor()
    {
        return $this->belongsTo(Docente::class, 'id_tutor', 'id_docente');
    }

    public function agregarTribunal($docenteId) {
        if ($this->tribunales()->count() >= 3) {
            throw new \Exception('Un proyecto no puede tener más de 3 tribunales.');
        }
        $this->tribunales()->attach($docenteId);
    }

    public function tribunales() {
        return $this->belongsToMany(Docente::class, 'tribunal', 'id_proyecto', 'id_docente');
    }
}
