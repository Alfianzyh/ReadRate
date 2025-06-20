<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = [
        'title',
        'author',
        'cover_url',
    ];
    
    use HasFactory;
    public function ratings()
    {
        return $this->hasMany(Rating::class);
        $book = Book::with('ratings')->find($id);
        $average = $book->ratings->avg('stars');
    }

    public function store($bookId)
    {
        $user = auth()->user();

        // Pastikan buku ada
        $book = Book::findOrFail($bookId);

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


    public function bookmarkedByUsers()
    {
        return $this->hasMany(Bookmark::class);
    }

    public function readByUsers()
    {
        return $this->hasMany(ReadBook::class);
    }


}


