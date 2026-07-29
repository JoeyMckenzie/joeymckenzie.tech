# Code Conventions

## Code Quality

- **ALWAYS** run linters and formatters constantly when working on code
- **ALWAYS** format code consistently with `composer fmt` or `composer fmt:check`
- **ALWAYS** lint code consistently with `composer lint`
- **ALWAYS** check for refactorings with `composer refactor` or `composer refactor:check`

## Use Laravel built-ins when possible

When writing PHP or TypeScript, **ALWAYS** follow this guidelines and examples.

### Use `blank()` and `filled()` for checking string values

❌ BAD - using `=== ''` or `!== ''` for string checks

```php
$value = 'asdf';

if ($value === '') {
    // ...
}

if ($value !== '') {
    // ...
}
```

✅ GOOD - using `blank` or `filled` for string checks

```php
$value = 'asdf';

if (filled($value)) {
    // ...
}

if (blank($value)) {
    // ...
}
```

### Empty comments to separate braces on constructors

Use a line breaking `//` code comment to separate braces for empty constructors.

❌ BAD - no `//` in the empty constructor

```php
class Foo
{
    function __construct(string $bar, int $baz)
    {}
}
```

✅ GOOD - uses `//` to separate braces and keeps constructor arguments on separate lines.

```php
class Foo
    function __construct(
        string $bar,
        int $baz,
    ) {
        //
    }
```

## Multi-line comment docblocks

**ALWAYS** use multi-line docblock comments when typing class properties.

❌ BAD - single line comment on class property docblock type

```php
final readonly class Foo
{
    /** @var list<string> */
    private array $bar;
}
```

✅ GOOD - multi-line comment on class property docblock type

```php
final readonly class Foo
{
    /**
     * @var list<string>
     */
    private array $bar;
}
```

**ALWAYS** use multi-line docblock comments when traits.

❌ BAD - single line comment on trait docblock type

```php
final readonly class Foo extends Model
{
    /** @use HasFactory<FooFactory> */
    use HasFactory;
}
```

✅ GOOD - multi-line comment on trait docblock type

```php
final readonly class Foo extends Model
{
    /**
     * @use HasFactory<FooFactory>
     */
    use HasFactory;
}
```

## Models

- **ALWAYS** rerun `php artisan ide-helper:models -RW` when adding new poperties to existing models
- **ALWAYS** rerun `php artisan ide-helper:models -RW` when adding new models to the codebase
- **ALWAYS** add new migrations when modifying existing models
- **NEVER** modify an existing migration file (migrations are **ALWAYS** forward, never back)

## Testing

- **NEVER** use the `test` method prefix to denote a PHPUnit test
- **ALWAYS** prefer the `#[Test]` PHPUnit attribute to denote tests
- **ALWAYS** mark test classes `final`
- **ALWAYS** use the appropriate `#[CoversClass]` and `#[UsesClass]` attributes when applicable

## Enums

- **ALWAYS** use PascalCase for enum variants
- **ALWAYS** use type-backed enums (string, int) where applicable
- **ALWAYS** format enum variants with a line break between arms:

❌ BAD - No line break between variants

```php
enum Foo : string
{
    case Bar = 'bar';
    case Baz = 'baz';
}
```

✅ GOOD - Line break between variants

```php
enum Foo : string
{
    case Bar = 'bar';

    case Baz = 'baz';
}
```

## Logging

- **PREFER** plain, human-readable log messages — a short capitalized phrase with no trailing period (e.g. `'Payment failed'`). The log level (`info`/`warning`/`error`) conveys severity.
- **ALWAYS** put identifiers and details in the structured context array, never interpolated into the message. A stable message string stays greppable and groupable; the specifics live in context.
- **NEVER** log secrets — credentials, tokens, auth headers, request/response bodies, or document bytes. Log identifiers only (ids, keys, counts, status codes, correlation/run ids).

❌ BAD - details interpolated into the message string:

```php
Log::info('Payment failed for user 123', [
    // Additional context...
]);
```

✅ GOOD - human-readable message + structured context:

```php
Log::warning('Payment failed', [
    'user_id' => $userId,
    'reason' => $reason,
]);
```
