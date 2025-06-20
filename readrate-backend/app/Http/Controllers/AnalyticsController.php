<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnalyticsController extends Controller
{
    // Buku dengan rating tertinggi
    public function topRatedBooks()
    {
        $books = Rating::selectRaw('book_id, AVG(rating) as avg_rating')
            ->groupBy('book_id')
            ->orderByDesc('avg_rating')
            ->with('book') // pastikan relasi di model Rating
            ->take(5)
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Top rated books retrieved successfully',
            'data' => $books
        ]);
    }

    // Jumlah rating yang diberikan oleh user login
    public function userRatingCount()
    {
        $userId = Auth::id();
        $count = Rating::where('user_id', $userId)->count();

        return response()->json([
            'success' => true,
            'message' => 'User rating count retrieved successfully',
            'user_id' => $userId,
            'total_ratings' => $count
        ]);
    }
}
