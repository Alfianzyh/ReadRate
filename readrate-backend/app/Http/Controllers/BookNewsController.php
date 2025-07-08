<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Goutte\Client;
use Illuminate\Support\Carbon;

class BookNewsController extends Controller
{
    public function fetch()
    {
        $client = new Client();
        $sources = [
            'https://www.detik.com/tag/buku' => 'Detik',
            'https://www.detik.com/tag/novel' => 'Detik',
            'https://www.tempo.co/tag/buku' => 'Tempo',
            'https://www.tempo.co/tag/novel' => 'Tempo',
        ];

        $results = [];

        foreach ($sources as $url => $source) {
            try {
                $crawler = $client->request('GET', $url);
                
                if ($source === 'Detik') {
                    $crawler->filter('article')->each(function ($node) use (&$results, $source) {
                        $title = $node->filter('h2 a')->text('');
                        $link = $node->filter('h2 a')->attr('href') ?? '';
                        $img = $node->filter('img')->attr('src') ?? null;

                        if ($title && $link) {
                            $results[] = [
                                'title' => $title,
                                'link' => $link,
                                'thumbnail' => $img,
                                'description' => 'Berita dari Detik',
                                'source' => $source,
                                'pubDate' => Carbon::now()->toDateTimeString(),
                            ];
                        }
                    });
                }

                if ($source === 'Tempo') {
                    $crawler->filter('.card-list .card')->each(function ($node) use (&$results, $source) {
                        $title = $node->filter('.title a')->text('');
                        $link = $node->filter('.title a')->attr('href') ?? '';
                        $img = $node->filter('img')->attr('data-original') ?? null;

                        if ($title && $link) {
                            $results[] = [
                                'title' => $title,
                                'link' => $link,
                                'thumbnail' => $img,
                                'description' => 'Berita dari Tempo',
                                'source' => $source,
                                'pubDate' => Carbon::now()->toDateTimeString(),
                            ];
                        }
                    });
                }
            } catch (\Exception $e) {
                continue;
            }
        }

        shuffle($results);
        $results = array_slice($results, 0, 6);

        return response()->json($results);
    }
}
