<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\ReadBookController;
use App\Http\Controllers\GoogleBooksController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{id}', [BookController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/ratings', [RatingController::class, 'store']);
    Route::get('/ratings', [RatingController::class, 'index']);
    Route::put('/ratings/{id}', [RatingController::class, 'update']);
    Route::delete('/ratings/{id}', [RatingController::class, 'destroy']);

    Route::post('/books/{id}/upload-cover', [BookController::class, 'uploadCover']);

    Route::get('/books/{id}/average-rating', [BookController::class, 'averageRating']);
    Route::get('/books/{id}/rating-distribution', [BookController::class, 'ratingDistribution']);

    Route::get('/analytics/top-rated-books', [AnalyticsController::class, 'topRatedBooks']);
    Route::get('/analytics/user-rating-count', [AnalyticsController::class, 'userRatingCount']);

    Route::get('/bookmarks', [BookmarkController::class, 'index']);
    Route::post('/books/{bookId}/bookmark', [BookmarkController::class, 'store']);
    Route::delete('/books/{bookId}/bookmark', [BookmarkController::class, 'destroy']);

    Route::get('/read-books', [ReadBookController::class, 'index']);
    Route::post('/books/{bookId}/mark-as-read', [ReadBookController::class, 'markAsRead']);
    Route::delete('/books/{bookId}/unmark-as-read', [ReadBookController::class, 'unmarkAsRead']);
});

Route::get('/import-books', [GoogleBooksController::class, 'searchAndImport']);

Route::get('/search-books', [BookController::class, 'search']);



