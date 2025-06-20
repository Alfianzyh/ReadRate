<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasColumn('books', 'cover_url')) {
            Schema::table('books', function (Blueprint $table) {
                $table->string('cover_url')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasColumn('books', 'cover_url')) {
            Schema::table('books', function (Blueprint $table) {
                $table->dropColumn('cover_url');
            });
        }
    }
};
