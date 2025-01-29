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
        Schema::create('documentos', function (Blueprint $table) {
            $table->id('id_documento');
            $table->string('nombre_archivo', 200);
            $table->string('ruta_archivo', 200);
            $table->enum('tipo_documento', ['Propuesta', 'Informe', 'Avance', 'Final']);
            $table->date('fecha_subida');
            $table->foreignId('id_proyecto')->constrained('proyectos','id_proyecto')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documentos');
    }
};
