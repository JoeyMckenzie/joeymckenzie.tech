---
title: 'Dynamic error assertions with PHPStan'
description: 'This blog post could have been tweet, but yet here I am.'
pubDate: 'Mar 11 2025'
heroImage: '/images/dynamic-phpstan-error-assertions/meme.jpeg'
category: 'php'
keywords:
    - php
    - phpstan
    - phpunit
---

So I've been working on a [fun little library](https://github.com/JoeyMckenzie/nasastan) as an excuse to learn how to
write extensions for PHP. I'll spare the gory
details as I'll probably write more extensively about it next week, but in essence, it's a PHPStan extension for
enforcing [NASA's Power of Ten](https://en.wikipedia.org/wiki/The_Power_of_10:_Rules_for_Developing_Safety-Critical_Code)
programming rules within your PHP code. Coming from nearly a decade working primarily in .NET, PHPStan is that
comforting blanket of static analysis that wraps me in its embrace assuring me those pesky runtime errors won't try to
scare me in the middle of the night.

I ran into an interesting testing scenario writing some unit tests for one of the rules and thought I'd share how I
solved it. At its core, I needed to assert PHPStan detected some errors on anonymous classes, though I think this
technique can be generally applied to any scenario that fits the bill.

## The problem

One of the Power of Ten rules revolves around restricting the scope of data (rule 6) to be as small as possible. This
can be interpreted a few ways, but primarily for my use case and application to PHP, I implemented a rule that would
restrict the number of properties within a class, including anonymous classes.

Some code that might trigger this PHPStan error could look something like this:

```php
class TooManyProperties
{
    private int $prop1;
    
    private int $prop2;
    
    private int $prop3;
    
    private int $prop4;
    
    private int $prop5;
    
    private int $prop6;
    
    private int $prop7;
    
    private int $prop8;
    
    private int $prop9;
    
    private int $prop10;
    
    private int $prop11;
    
    // ...other stuff/methods that might interact with properties
}
```

Running a quick analysis with PHPStan using my extension would trigger errors like this:

```shell
 ------ ---------------------------------------------------------------------------------------------------- 
  Line   TooManyProperties.php                                                                               
 ------ ---------------------------------------------------------------------------------------------------- 
  :7     NASA Power of Ten Rule #6: Class "TooManyProperties" has 11 properties, but the maximum allowed is  
         10.            
 ------ ----------------------------------------------------------------------------------------------------
```

This rule will also apply to anonymous classes too:

```php
new readonly class
{
        private int $prop1;

        private int $prop2;

        private int $prop3;

        private int $prop4;

        private int $prop5;

        private int $prop6;

        private int $prop7;

        private int $prop8;

        private int $prop9;

        private int $prop10;

        private int $prop11;
};
```

With a similar error:

```shell
 ------ ---------------------------------------------------------------------------------------------------- 
  Line   TooManyPropertiesAnonymous.php                                                                               
 ------ ---------------------------------------------------------------------------------------------------- 
  :7     NASA Power of Ten Rule #6: Class "AnonymousClassf133621dffe158efe7db3570c09909a" has 11 properties, 
         but the maximum allowed is 10.
 ------ ----------------------------------------------------------------------------------------------------
```

What I learned during this process is that when PHP executes code for anonymous classes, it creates an internal
reference to the class using a name like `AnonymousClassf133621dffe158efe7db3570c09909a`, a concatenation of a class
name and a hash to ensure uniqueness of the anonymous class instance.

This can be somewhat tricky to test with PHPStan to assert analysis errors, we won't know the anonymous class hash
during assertion time. A test like this would likely fail:

```php
#[Test]
public function test_wildcard_pattern_matching(): void
{
    $configuration = new NasastanConfiguration(
        maxClassProperties: 10,
        allowedPublicProperties: ['id', 'user_*', '*_date', '*_id']
    );

    $this->rule = new RestrictDataScopeRule($configuration);

    $this->analyse([__DIR__.'/../Examples/Rule_6/AnonymousClasses.php'], [
        [
            'NASA Power of Ten Rule #6: Class "AnonymousClass" has 11 properties, but the maximum allowed is 10.',
            10,
        ],
    ]);
}
```

The first approach was to see if PHPStan would allow me to use regex like in a PHPStan `ignoreErrors` block. Taking
Nasastan's `phpstan.neon` file as an example, it might look something like:

```yml
parameters:
    level: max
    paths:
        - src
        - tests/Rules
    reportUnmatchedIgnoredErrors: true
    ignoreErrors:
        -   message: '#Method Nasastan\\Rules\\[a-zA-Z]+::processNode\(\) should return list<PHPStan\\Rules\\IdentifierRuleError> but returns array{PHPStan\\Rules\\RuleError}.#'
            paths:
                - src/Rules/*.php
        -   message: '#Method Nasastan\\Rules\\[a-zA-Z]+::processNode\(\) should return list<PHPStan\\Rules\\IdentifierRuleError> but returns array<PHPStan\\Rules\\RuleError>.#'
            paths:
                - src/Rules/*.php
```

Surrounding a message with a hash symbol allows the use of regex to match on reported errors, telling PHPStan to simply
ignore any files that it finds matching the string. I tried a test like this:

```php
#[Test]
public function test_wildcard_pattern_matching(): void
{
    $configuration = new NasastanConfiguration(
        maxClassProperties: 10,
        allowedPublicProperties: ['id', 'user_*', '*_date', '*_id']
    );

    $this->rule = new RestrictDataScopeRule($configuration);

    $this->analyse([__DIR__.'/../Examples/Rule_6/AnonymousClasses.php'], [
        [
            '#NASA Power of Ten Rule \#6: Class "AnonymousClass[a-z0-9]+" has 11 properties, but the maximum allowed is 10.#',
            10,
        ],
    ]);
}
```

Though that didn't seem to do the trick. Digging a bit deeper into PHPStan itself, if we look at the `analyse()` method
on PHPStan v2.0:

```php
/**
 * @param string[] $files
 * @param list<array{0: string, 1: int, 2?: string|null}> $expectedErrors
 */
public function analyse(array $files, array $expectedErrors) : void
{
    $actualErrors = $this->gatherAnalyserErrors($files);
    $strictlyTypedSprintf = static function (int $line, string $message, ?string $tip) : string {
        $message = sprintf('%02d: %s', $line, $message);
        if ($tip !== null) {
            $message .= "\n    💡 " . $tip;
        }
        return $message;
    };
    $expectedErrors = array_map(static fn(array $error): string => $strictlyTypedSprintf($error[1], $error[0], $error[2] ?? null), $expectedErrors);
    $actualErrors = array_map(static function (Error $error) use($strictlyTypedSprintf) : string {
        $line = $error->getLine();
        if ($line === null) {
            return $strictlyTypedSprintf(-1, $error->getMessage(), $error->getTip());
        }
        return $strictlyTypedSprintf($line, $error->getMessage(), $error->getTip());
    }, $actualErrors);
    $this->assertSame(implode("\n", $expectedErrors) . "\n", implode("\n", $actualErrors) . "\n");
}
```

The devil's in the details, as they say. To summarize the above code, PHPStan `analyse()` helper test method is doing a
direct string comparison, and though I've scoured (and probably not long enough), I couldn't seem to find association
that allowed for regex-able messages for assertions. There's _probably_ some way to do this with PHPStan error
utilities, but I'll let someone smarter than I help with that.

## The solution

As a quick workaround, I rewrote the test, so I could catch those anonymous classes within my assertions and verify the
PHPStan analysis was as expected. The updated test looks something like:

```php
#[Test]
public function test_anonymous_classes_cases(): void
{
    $configuration = new NasastanConfiguration(
        maxClassProperties: 10,
        allowedPublicProperties: []
    );

    $this->rule = new RestrictDataScopeRule($configuration);
    $errors = $this->gatherAnalyserErrors([__DIR__.'/../Examples/Rule_6/AnonymousClasses.php']);

    // Create a map of line numbers to expected regex patterns
    $assertions = [
        21 => '/NASA Power of Ten Rule #6: Class "AnonymousClass[a-z0-9]+" has 11 properties, but the maximum allowed is 10/',
        42 => '/NASA Power of Ten Rule #6: Public property "publicProp" in class "AnonymousClass[a-z0-9]+" violates data scope restriction/',
    ];

    // Ensure we have the correct number of errors
    Assert::assertCount(count($assertions), $errors, 'Expected number of errors does not match actual errors');

    // We track which assertions have been verified rolling through each error
    $verifiedAssertions = [];

    // Check each error against our expected patterns
    foreach ($errors as $error) {
        $line = $error->getLine();
        $message = $error->getMessage();

        // Check if we have an assertion for this line
        if (isset($assertions[$line])) {
            Assert::assertMatchesRegularExpression(
                $assertions[$line],
                $message,
                "Error message for line $line doesn't match expected pattern"
            );

            // Add the assertion so we can verify it by line number
            $verifiedAssertions[] = $line;
        } else {
            Assert::fail("Unexpected error on line $line: $message");
        }
    }

    // Verify all the assertions we ran match the line numbers reported by PHPStan's analysis
    foreach (array_keys($assertions) as $line) {
        Assert::assertContains($line, $verifiedAssertions, "Expected error on line $line was not found");
    }
}
```

With this test now refactored with a bit of help from Claude to catch a few issues, I can now have my test assertions
with anonymous classes fire as expected. A quick overview from above:

- First, I use `gatherAnalyserErrors()` to have PHPStan do its thing and give me back all the errors it finds in a file
- Next, I capture all the regex'd error messages I expect to see keyed off their line number where PHPStan finds them
- Then, I roll through each error and compare the message with my regex matching string
- I add the positively caught assertions to a `$verifiedAssertions` array
- As a sanity check, I roll through the `$assertions` array keys to verify the line numbers are correct for where
  they were found

And that's it! A quick workaround for an interesting use case. I assume someone out there (again, _much_ smarter than
me), has run into this before and there's _probably_ a much more elegant way to solve this. Until then, I'll be rolling
with this approach for my dynamic assertions for PHPStan.

Until next time, friends!
