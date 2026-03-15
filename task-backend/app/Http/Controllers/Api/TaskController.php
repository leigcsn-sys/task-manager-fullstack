<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class TaskController extends Controller
{
    public function index(): JsonResponse
    {
        $tasks = Task::orderBy('created_at', 'desc')->get();
        return response()->json($tasks, 200);
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255|min:1',
            ]);

            $task = Task::create([
                'title' => trim($validated['title']),
            ]);

            return response()->json($task, 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors'  => $e->errors(),
            ], 422);
        }
    }

    public function destroy($id): JsonResponse
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found.'], 404);
        }

        $task->delete();
        return response()->json(['message' => 'Task deleted.'], 200);
    }
}