<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;

class BookSeeder extends Seeder
{
    public function run()
    {
        Book::create([
            'title' => 'Atomic Habits',
            'author' => 'James Clear',
            'description' => 'Panduan membentuk kebiasaan baik dalam hidup sehari-hari.',
            'cover_url' => 'https://images.example.com/atomic-habits.jpg'
        ]);

        Book::create([
            'title' => 'Sapiens',
            'author' => 'Yuval Noah Harari',
            'description' => 'Sejarah singkat umat manusia dari masa purba hingga modern.',
            'cover_url' => 'https://images.example.com/sapiens.jpg'
        ]);

        // Tambah lebih banyak buku jika mau
    }
}
