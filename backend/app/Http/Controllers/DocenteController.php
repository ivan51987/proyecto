<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Docente;

class DocenteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $docentes = Docente::all();
        return response()->json($docentes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'correo' => 'required|email|max:100|unique:docentes,correo',
            'telefono' => 'nullable|string|max:15',
            'especialidad' => 'required|string|max:100',
        ]);

        $docente = Docente::create($request->all());

        return response()->json([
            'message' => 'Docente registrado exitosamente',
            'docente' => $docente
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $docente = Docente::find($id);

        if (!$docente) {
            return response()->json(['message' => 'Docente no encontrado'], 404);
        }

        return response()->json($docente);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $docente = Docente::find($id);

        if (!$docente) {
            return response()->json(['message' => 'Docente no encontrado'], 404);
        }

        $request->validate([
            'nombre' => 'sometimes|string|max:100',
            'apellido' => 'sometimes|string|max:100',
            'correo' => "sometimes|email|max:100|unique:docentes,correo,{$id},id_docente",
            'telefono' => 'nullable|string|max:15',
            'especialidad' => 'sometimes|string|max:100',
        ]);

        $docente->update($request->all());

        return response()->json([
            'message' => 'Docente actualizado exitosamente',
            'docente' => $docente
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $docente = Docente::find($id);

        if (!$docente) {
            return response()->json(['message' => 'Docente no encontrado'], 404);
        }

        $docente->delete();

        return response()->json(['message' => 'Docente eliminado exitosamente']);
    }
}
