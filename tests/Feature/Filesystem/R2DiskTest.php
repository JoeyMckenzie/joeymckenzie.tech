<?php

declare(strict_types=1);

namespace Tests\Feature\Filesystem;

use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

final class R2DiskTest extends TestCase
{
    #[Test]
    public function r2_disk_can_store_and_retrieve_files(): void
    {
        $this->assertSame('s3', config('filesystems.disks.r2.driver'));

        Storage::fake('r2');

        $disk = Storage::disk('r2');

        $this->assertTrue($disk->put('health-check.txt', 'R2 is configured'));
        $this->assertSame('R2 is configured', $disk->get('health-check.txt'));
    }
}
