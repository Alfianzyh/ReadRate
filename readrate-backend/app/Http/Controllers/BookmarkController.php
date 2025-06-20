<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookmarkController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $bookmarks = $user->bookmarks()->with('book')->get();

        return response()->json([
            'success' => true,
            'data' => $bookmarks
        ]);
    }

    public function store($bookId)
    {
        $user = auth()->user();

        // Cek jika bookmark sudah ada
        $existing = Bookmark::where('user_id', $user->id)
                            ->where('book_id', $bookId)
                            ->first();

        if ($existing) {
            return response()->json(['message' => 'Already bookmarked'], 409);
        }

        Bookmark::create([
            'user_id' => $user->id,
            'book_id' => $bookId,
        ]);

        return response()->json(['message' => 'Book bookmarked successfully'], 201);
    }

    public function destroy($bookId)
    {
        $user = Auth::user();

        $deleted = Bookmark::where('user_id', $user->id)
            ->where('book_id', $bookId)
            ->delete();

        return response()->json([
            'success' => $deleted > 0,
            'message' => $deleted ? 'Bookmark removed' : 'Bookmark not found'
        ]);
    }

    public function search(Request $request)
    {
        $q = $request->query('q');

        $books = Book::query()
            ->where('title', 'LIKE', "%$q%")
            ->orWhere('author', 'LIKE', "%$q%")
            ->get();

        return response()->json([
            'success' => true,
            'data' => $books
        ]);
    }
}
