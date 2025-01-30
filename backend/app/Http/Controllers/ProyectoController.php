<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Proyecto;

class ProyectoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $proyectos = Proyecto::with(['estudiante', 'tutor','tribunales'])->get();
        return response()->json($proyectos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:200',
            'descripcion' => 'nullable|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'estado' => 'required|in:En progreso,Finalizado,Aprobado,Rechazado',
            'id_estudiante' => 'required|exists:estudiantes,id_estudiante',
            'id_tutor' => 'required|exists:docentes,id_docente',
        ]);

        $proyecto = Proyecto::create($request->all());

        return response()->json([
            'message' => 'Proyecto registrado exitosamente',
            'proyecto' => $proyecto
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $proyecto = Proyecto::with(['estudiante', 'tutor','tribunales'])->find($id);

        if (!$proyecto) {
            return response()->json(['message' => 'Proyecto no encontrado'], 404);
        }

        return response()->json($proyecto);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $proyecto = Proyecto::find($id);

        if (!$proyecto) {
            return response()->json(['message' => 'Proyecto no encontrado'], 404);
        }

        $request->validate([
            'titulo' => 'sometimes|string|max:200',
            'descripcion' => 'nullable|string',
            'fecha_inicio' => 'sometimes|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'estado' => 'sometimes|in:En progreso,Finalizado,Aprobado,Rechazado',
            'id_estudiante' => 'sometimes|exists:estudiantes,id_estudiante',
            'id_tutor' => 'sometimes|exists:docentes,id_docente',
        ]);

        $proyecto->update($request->all());

        return response()->json([
            'message' => 'Proyecto actualizado exitosamente',
            'proyecto' => $proyecto
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $proyecto = Proyecto::find($id);

        if (!$proyecto) {
            return response()->json(['message' => 'Proyecto no encontrado'], 404);
        }

        $proyecto->delete();

        return response()->json(['message' => 'Proyecto eliminado exitosamente']);
    }
}
