<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Book;

class GoogleBooksController extends Controller
{
    public function searchAndImport(Request $request)
    {
        $query = $request->input('q', 'harry potter');

        $response = Http::get('https://www.googleapis.com/books/v1/volumes', [
            'q' => $query,
            'maxResults' => 10,
        ]);

        $results = $response->json()['items'] ?? [];
        $imported = [];

        foreach ($results as $item) {
            $volume = $item['volumeInfo'];
            $title = $volume['title'] ?? 'No title';
            $author = implode(', ', $volume['authors'] ?? []);
            $cover = $volume['imageLinks']['thumbnail'] ?? null;

            $book = Book::firstOrCreate(
                ['title' => $title, 'author' => $author],
                ['cover_url' => $cover]
            );

            $imported[] = $book;
        }

        return response()->json([
            'success' => true,
            'imported' => $imported,
        ]);
    }
}
