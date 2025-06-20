<?php

namespace App\Http\Controllers;

use App\Models\ReadBook;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReadBookController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $books = $user->readBooks()->with('book')->get();

        return response()->json([
            'success' => true,
            'data' => $books
        ]);
    }

    public function markAsRead($bookId)
    {
        $user = Auth::user();

        $book = Book::findOrFail($bookId);

        $read = ReadBook::firstOrCreate([
            'user_id' => $user->id,
            'book_id' => $book->id,
        ], [
            'finished_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Book marked as read.',
            'data' => $read
        ]);
    }

    public function unmarkAsRead($bookId)
    {
        $user = Auth::user();

        $deleted = ReadBook::where('user_id', $user->id)
            ->where('book_id', $bookId)
            ->delete();

        return response()->json([
            'success' => $deleted > 0,
            'message' => $deleted ? 'Book unmarked as read.' : 'No record found.'
        ]);
    }
}