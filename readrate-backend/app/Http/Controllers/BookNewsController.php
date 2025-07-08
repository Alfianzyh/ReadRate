<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Goutte\Client;

class BookNewsController extends Controller
{
    public function fetch()
    {
        $client = new Client();
        $sources = [
            'https://www.detik.com/tag/buku',
            'https://www.detik.com/tag/novel',
            'https://www.tempo.co/tag/buku',
            'https://www.tempo.co/tag/novel',
        ];

        $results = [];

        foreach ($sources as $url) {
            try {
                $crawler = $client->request('GET', $url);
                
                if (str_contains($url, 'detik.com')) {
                    $crawler->filter('article')->each(function ($node) use (&$results) {
                        $title = $node->filter('h2 a')->text('');
                        $link = $node->filter('h2 a')->attr('href');
                        $img = $node->filter('img')->attr('src') ?? null;

                        if ($title && $link) {
                            $results[] = [
                                'title' => $title,
                                'link' => $link,
                                'image' => $img,
                                'source' => 'Detik',
                            ];
                        }
                    });
                }

                if (str_contains($url, 'tempo.co')) {
                    $crawler->filter('.card-list .card')->each(function ($node) use (&$results) {
                        $title = $node->filter('.title a')->text('');
                        $link = $node->filter('.title a')->attr('href');
                        $img = $node->filter('img')->attr('data-original') ?? null;

                        if ($title && $link) {
                            $results[] = [
                                'title' => $title,
                                'link' => $link,
                                'image' => $img,
                                'source' => 'Tempo',
                            ];
                        }
                    });
                }
            } catch (\Exception $e) {
                continue;
            }
        }

        // Ambil 6 berita acak
        shuffle($results);
        $results = array_slice($results, 0, 6);

        return response()->json($results);
    }
}
