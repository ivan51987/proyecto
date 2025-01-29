<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('proyectos', function (Blueprint $table) {
            $table->id('id_proyecto');
            $table->string('titulo', 200);
            $table->text('descripcion')->nullable();
            $table->date('fecha_inicio');
            $table->date('fecha_fin')->nullable();
            $table->enum('estado', ['En progreso', 'Finalizado', 'Aprobado', 'Rechazado']);
            $table->foreignId('id_estudiante')->constrained('estudiantes','id_estudiante')->onDelete('cascade');
            $table->foreignId('id_tutor')->constrained('docentes','id_docente')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proyectos');
    }
};
