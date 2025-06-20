<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Rating;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::query();

        if ($search = $request->query('search')) {
            $query->where('title', 'like', "%$search%")
                  ->orWhere('author', 'like', "%$search%");
        }

        return response()->json($query->paginate(10));
    }

    public function show($id)
    {
        $book = Book::findOrFail($id);
        return response()->json($book);
    }
    public function uploadCover(Request $request, $id)
    {
        $request->validate([
            'cover' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $book = Book::findOrFail($id);

        if ($request->hasFile('cover')) {
            $path = $request->file('cover')->store('covers', 'public');
            $book->cover_url = '/storage/' . $path;
            $book->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Cover uploaded successfully',
            'path' => $path,
            'url' => asset('storage/' . $path) // ini akan hasilkan http://localhost:8000/storage/...
        ]);

    }
   public function averageRating($id)
    {
        $book = Book::findOrFail($id);

        $average = $book->ratings()->avg('rating');

        return response()->json([
            'book_id' => $book->id,
            'average_rating' => round($average, 2)
        ]);
    }

    public function topRatedBooks()
    {
        $books = Rating::selectRaw('book_id, AVG(rating) as avg_rating')
            ->groupBy('book_id')
            ->orderByDesc('avg_rating')
            ->take(5)
            ->with('book')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $books
        ]);
    }

    public function userRatingCount()
    {
        $userId = Auth::id();
        $count = Rating::where('user_id', $userId)->count();

        return response()->json([
            'success' => true,
            'user_id' => $userId,
            'total_ratings' => $count
        ]);
    }

    public function ratingDistribution($id)
    {
        $distribution = Rating::where('book_id', $id)
            ->selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->orderBy('rating', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'book_id' => $id,
            'distribution' => $distribution
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

