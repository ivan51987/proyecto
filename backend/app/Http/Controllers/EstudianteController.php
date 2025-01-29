<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Estudiante;

class EstudianteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $estudiantes = Estudiante::all();
        return response()->json($estudiantes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'carnet' => 'required|string|max:20|unique:estudiantes,carnet',
            'correo' => 'required|email|max:100|unique:estudiantes,correo',
            'telefono' => 'nullable|string|max:15',
            'fecha_registro' => 'required|date',
        ]);

        $estudiante = Estudiante::create($request->all());
        return response()->json([
            'message' => 'Estudiante registrado exitosamente',
            'estudiante' => $estudiante
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $estudiante = Estudiante::find($id);

        if (!$estudiante) {
            return response()->json(['message' => 'Estudiante no encontrado'], 404);
        }

        return response()->json($estudiante);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $estudiante = Estudiante::find($id);

        if (!$estudiante) {
            return response()->json(['message' => 'Estudiante no encontrado'], 404);
        }

        $request->validate([
            'nombre' => 'sometimes|string|max:100',
            'apellido' => 'sometimes|string|max:100',
            'carnet' => "sometimes|string|max:20|unique:estudiantes,carnet,{$id},id_estudiante",
            'correo' => "sometimes|email|max:100|unique:estudiantes,correo,{$id},id_estudiante",
            'telefono' => 'nullable|string|max:15',
            'fecha_registro' => 'sometimes|date',
        ]);

        $estudiante->update($request->all());

        return response()->json([
            'message' => 'Estudiante actualizado exitosamente',
            'estudiante' => $estudiante
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $estudiante = Estudiante::find($id);

        if (!$estudiante) {
            return response()->json(['message' => 'Estudiante no encontrado'], 404);
        }

        $estudiante->delete();

        return response()->json(['message' => 'Estudiante eliminado exitosamente']);
    }
}
