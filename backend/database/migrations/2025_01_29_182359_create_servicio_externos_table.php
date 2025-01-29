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
        Schema::create('servicio_externos', function (Blueprint $table) {
            $table->id('id_servicio');
            $table->string('nombre_servicio', 100);
            $table->text('descripcion')->nullable();
            $table->string('endpoint', 200);
            $table->string('token_acceso', 200)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('servicio_externos');
    }
};
