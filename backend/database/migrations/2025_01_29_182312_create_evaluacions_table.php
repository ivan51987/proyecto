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
        Schema::create('evaluacions', function (Blueprint $table) {
            $table->id('id_evaluacion');
            $table->foreignId('id_proyecto')->constrained('proyectos','id_proyecto')->onDelete('cascade');
            $table->foreignId('id_docente')->constrained('docentes','id_docente')->onDelete('cascade');
            $table->decimal('calificacion', 5, 2)->nullable();
            $table->text('comentarios')->nullable();
            $table->date('fecha_evaluacion');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluacions');
    }
};
