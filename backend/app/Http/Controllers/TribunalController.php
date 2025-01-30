<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tribunal;
use Illuminate\Validation\Rule;

class TribunalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Tribunal::all(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_proyecto' => 'required|exists:proyectos,id_proyecto',
            'id_docente' => 'required|exists:docentes,id_docente',
            'rol' => ['required', Rule::in(['tutor', 'tribunal'])],
        ]);

        $tribunal = Tribunal::create($request->all());
        return response()->json($tribunal, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $tribunal = Tribunal::find($id);
        if (!$tribunal) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }
        return response()->json($tribunal, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $tribunal = Tribunal::find($id);
        if (!$tribunal) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }

        $request->validate([
            'id_proyecto' => 'sometimes|exists:proyectos,id_proyecto',
            'id_docente' => 'sometimes|exists:docentes,id_docente',
            'rol' => ['sometimes', Rule::in(['tutor', 'tribunal'])],
        ]);

        $tribunal->update($request->all());
        return response()->json($tribunal, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $tribunal = Tribunal::find($id);
        if (!$tribunal) {
            return response()->json(['error' => 'Registro no encontrado'], 404);
        }
        $tribunal->delete();
        return response()->json(['message' => 'Registro eliminado'], 200);
    }
}
