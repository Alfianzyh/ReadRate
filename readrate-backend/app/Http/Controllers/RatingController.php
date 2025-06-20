<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RatingController extends Controller
{
    public function index()
    {
        $ratings = Rating::where('user_id', Auth::id())->with('book')->get();

        return response()->json([
            'success' => true,
            'data' => $ratings
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);

        $rating = Rating::create([
            'user_id' => Auth::id(),
            'book_id' => $request->book_id,
            'rating' => $request->rating,
            'comment' => $request->comment
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Rating created successfully',
            'data' => $rating
        ]);
    }

   public function update(Request $request, $id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
        ]);

        $rating = Rating::findOrFail($id);
        
        $this->authorize('modify', $rating);

        $rating->rating = $request->rating;
        $rating->save();

        return response()->json([
            'success' => true,
            'message' => 'Rating updated successfully',
            'data' => $rating
        ]);
    }

    public function destroy($id)
    {
        $rating = Rating::findOrFail($id);

        $this->authorize('modify', $rating);

        $rating->delete();

        return response()->json([
            'success' => true,
            'message' => 'Rating deleted successfully'
        ]);
    }
}
