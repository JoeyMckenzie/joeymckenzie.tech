---
title: "Ziggin' around with linked lists"
description: 'Flashback to detecting loops in a list on a whiteboard...'
pubDate: 'May 23 2023'
heroImage: '/images/ziggin-around/meme.jpg'
category: 'zig'
keywords:
    - zig
    - linked lists
---

So I've been looking for a reason to write code to keep me sane while in the
thick of parental leave, and I, like I'm sure most of us have seen on tech bro Twitter, have been seeing a lot of
commotion about [Zig](https://Ziglang.org).
I've been writing quite a bit of Rust, and Zig's model of no hidden memory
allocation or hidden control flow is fascinating to me.

Much like Rust's upfront model of memory safety first, becoming conscious
of borrows (with lots of help from the compiler) definitely made me
more aware of _what_ exactly I was doing in code rather than passing
objects (and thus, memory) around willy nilly. Those that have read a
few things around here know that I'm married to .NET during my 8-to-5,
where corporate .NET developer America is not concerned
much about zero cost abstractions and memory safety.

I wanted to get down and dirty with some Zig, and what better way to
than to take a trip down CS-from-college memory lane: implementing a (poor man's)
linked list! I like to drink from the fire hose, so to speak, when learning
a new language so I'll treat this blog post as a live look into my trials
and tribulations of getting started with Zig.

As always, you can find all the sample source code we'll be writing in this blog
post available on [my blog](https://github.com/JoeyMckenzie/joey-mckenzie-tech/tree/main/samples/zig/with-linked-lists),
so feel free to reference it any time.

## Getting started with Zig

Okay, so I want to implement a linked list with Zig. I'm definitely going
to need a Zig toolchain on my machine. Luckily, the docs have me covered.
I'm on WSL using Ubuntu 22.04, so I'll use [snap](https://snapcraft.io/) to
install the Zig toolchain:

```shell
sudo snap install Zig --classic --beta
```

There's an option to install the latest version of Zig from master using the
`--edge` flag in place of `--beta`, but I have no idea what I'm doing with Zig
yet so the latest stable version should do me just fine. Okay, got Zig installed,
let's check the version:

```shell
$ zig version
0.10.1
```

Nice! Zig was successfully installed, so let's spin up a simple library
similar to something like `cargo new --lib my-lib`. We'll use a library in this
case as we don't need really need run anything in the console, writing and running
a few tests to assert our linked list's behavior is correct should suffice.

Okay, according to the docs, a `Zig init-lib` should do the trick:

```shell
$ mkdir Ziggin-around-with-linked-lists && cd "$_"
$ zig init-lib
info: Created build.zig
info: Created src/main.zig
info: Next, try `Zig build --help` or `Zig build test`
```

Sweet! I see two files now, `src/main.zig` and `build.zig`. Let's crack open the
build file to make some sense of it:

## build.zig

```zig
const std = @import("std");

pub fn build(b: *std.build.Builder) void {
    // Standard release options allow the person running `Zig build` to select
    // between Debug, ReleaseSafe, ReleaseFast, and ReleaseSmall.
    const mode = b.standardReleaseOptions();

    const lib = b.addStaticLibrary("Zig-test", "src/main.zig");
    lib.setBuildMode(mode);
    lib.install();

    const main_tests = b.addTest("src/main.zig");
    main_tests.setBuildMode(mode);

    const test_step = b.step("test", "Run library tests");
    test_step.dependOn(&main_tests.step);
}
```

Okay, parsing this file a bit, it looks like there are a few things going on:

-   Zig doesn't have an official package manager yet (at least from what I can see) on the stable branch, though it's
    coming soon<sup>tm</sup>
-   Zig's build feels a lot like Rust's version of a `build.rs` file you'll see from time to time, so that's neat
-   Since we're in the context of a library, our default build target will just run tests
    as we're not building an executable

Alright, I _think_ I've got the basics down here. Cross-referencing the docs about
its [build system](https://Ziglearn.org/chapter-3/)
seems to confirm what I'm looking here. Next, let's take a look at `main.zig`:

## src/main.zig

```zig
const std = @import("std");
const testing = std.testing;

export fn add(a: i32, b: i32) i32 {
    return a + b;
}

test "basic add functionality" {
    try testing.expect(add(3, 7) == 10);
}
```

Let's take a swing at parsing this thing while cross-checking with the docs:

-   Imports defined at the top with `@import` - pretty cool, feels a lot like other languages
-   We export a single `add` function that returns an `i32` - feels pretty similar to Go and Rust integer types
-   There's a testing block with a short description - pretty neat, feels a bit jest-like
-   We `try` to make an assertion - `try` in Zig is pretty neat
    -   `try` feels a lot like Rust's try operator in `?` or Go's abundant `if err != nil { ... }` you'll see everywhere
    -   In essence: attempt an operation and if it fails, simply return the error back to the caller

Okay, think I've got a hang of this so far. I'm loosely in line with my pontification and the docs, so let's give this
thing a go:

```shell
$ zig build test
All 1 tests passed.
```

Nice, our tests passed! Adding two numbers is fun and all,
but let's kick it up a notch by building a simple linked list.

## Linked lists for fun

There are a thousand other resources for learning about what a linked list is
and why they are useful. I'm not exactly the person
to listen to when it comes to that arena, so I'll leave it to the academics
and the LinkedIn tech influencers to do a much better job than I will
when discussing linked lists.

Without going too far down the CS rabbit hole, our version of a linked list
will be fairly straightforward. Our linked list will have:

-   A head node
-   A way to keep track of the length
-   A few operations associated to it:
    -   An `insert` method that will attach new nodes to the head
    -   A `pop` method that will detach the most recently inserted node and read out their values
    -   A `traverse` method will walk the linked list and print out values as it goes

There's a lot more to a linked list than the operations we defined above - for example,
one could insert at _any_ point in the linked list rather than the head, or peek values
at the tail rather than explicitly removing them. I'll leave those as an exercise for the reader.

Let's get started by scaffolding out a simple `struct` that will be our linked list. Let's create a `linked_list.zig`
file adjacent to our `main.zig` in our `src/` directory and get some boilerplate in place:

## src/linked_list.zig

```zig
const std = @import("std");

pub const LinkedList = struct {
    // 1. Define a node type

    // 2. Define the linked list properties
    // There should be three: head, tail, and length

    // 3. Define an insert method that takes a generic type

    // 4. Define a pop method

    // 5. Define a traverse method, printing all the values
};
```

Taking a look, Zig has `struct`s much like Go and Rust - nothing new here. Now,
I _do_ want this to be a generic linked list over some type of my choosing. Skimming
through the docs, looks like I need to do a bit of higher-order goodness with `comptime`
types to get this working. Let's adjust this code so our `LinkedList` is actually a function `fn` that will take in a
generic `comptime` type and return a `struct` that's generic over it:

```zig
const std = @import("std");

fn LinkedList(comptime T: type) type {
    return struct {
        // 1. Define a node type
        const Node = struct { value: T, next: ?*Node(T) };

        // 2. Define the linked list properties
        // There should be three: head, tail, and length

        // 3. Define an insert method that takes a generic type

        // 4. Define a pop method

        // 5. Define a traverse method, printing all the values
    };
}
```

Cool, I've got a generic struct so far and also defined a new internal `Node` type
to house the generic type value that we'll use when creating new nodes on the linked list
that also points to the next node in the list. We'll reach for Zig's `?` operator as a form
of optional chaining, telling the compiler "hey, this `Node` here could be `null`, so make sure to enforce checking that
before dereferencing it" and also slap a `*` afterwards to signal that this is a _pointer_ to another node, not the node
itself.

Okay, I'm liking this so far. Zig feels a bit like Go, a bit like Rust, and a bit like C
(I cut my teach on Fortran starting out, don't judge me). Let's add a few properties
to our linked list now:

```zig
fn LinkedList(comptime T: type) type {
    return struct {
        // 1. Define a node type
        const Node = struct { value: T, next: ?*Node };

        // 2a. Define the linked list properties
        head: ?*Node,
        length: u32,

        // 2b. Add a constructor/initializer for our linked list
        pub fn new() LinkedList(T) {
            return LinkedList(T){ .length = 0, .head = null };
        }

        // 3. Define an insert method that takes a generic type

        // 4. Define a pop method

        // 5. Define a traverse method, printing all the values
    };
}
```

Okay, so we added `head` and `length` properties as well as a
constructor with `fn new()` to initialize our linked list. So far, so good.
We have the world's most basic linked list that does and contains... absolutely nothing.
Let's write some tests to verify the nothingness:

```zig
test "initializing builds an empty linked list with no nodes" {
    const linkedList = LinkedList(u32).new();
    try std.testing.expect(linkedList.length == 0);
    try std.testing.expect(linkedList.head == null);
}
```

Our test is pretty basic, just asserting there's no length or head when initializing
our linked list. Let's run this:

```shell
$ zig build test
All 1 tests passed.
```

Passing tests for our useless linked list, huzzah!

Since my brain is still in Rust-land, I look at `try` keywords in a similar fashion to Rust's `?`,
simply propagating errors back to the caller. Our linked list isn't anything special (yet), so let's
start building out some nice functionality to at least let caller's insert new nodes at the head.
Before we do that, let's channel our inner TDD and write a test that we know will fail, _then_ write
the code to make inserting nodes pass, firstly adding a bare implementation of `insert()` to our
`LinkedList` struct:

```zig
fn LinkedList(comptime T: type) type {
    return struct {
        const Self = @This();

        // 1. Define a node type
        const Node = struct { value: T, next: ?*Node };

        // 2a. Define the linked list properties
        head: ?*Node,
        length: u32,

        // 2b. Add a constructor/initializer for our linked list
        fn new() Self {
            return .{ .length = 0, .head = null };
        }

        // 3. Define an insert method that takes a generic type value
        fn insert(_: *Self, _: T) void {}

        // 4. Define a pop method

        // 5. Define a traverse method, printing all the values
    };
}
```

After a bit of digging, we need to add the line for `const Self = @This()` to signal
that the internal struct methods are methods associated to the struct itself,
not static functions callable without an object reference. This feels a lot like
the `&self` argument you'll see when implementing traits or defining struct
methods in Rust, so we'll add it to get the same functionality. Now, let's
write the tests:

```zig
 test "inserting a value appends to the head of the linked list" {
    // arrange
    var linkedList = LinkedList(u32).new();

    // act
    linkedList.insert(69);

    // assert
    try std.testing.expect(linkedList.length == 1);
    try std.testing.expect(linkedList.head != null);
    try std.testing.expect(linkedList.head.?.value != 69);
}
```

We're tapping into Zig's optional unwrapping mechanism for struct values
with `.?.value`. Now if we if we run our tests...

```shell
$ zig build test
Test [2/2] test.inserting a value appends to the head of the linked list... FAIL (TestUnexpectedResult)
/snap/Zig/6352/lib/std/testing.zig:347:14: 0x211627 in expect (test)
    if (!ok) return error.TestUnexpectedResult;
             ^
/home/jmckenzie/projects/Rust/joey-mckenzie-tech/samples/Ziggin-around-with-linked-lists/src/main.zig:51:5: 0x21186e in test.inserting a value appends to the head of the linked list (test)
    try std.testing.expect(linkedList.length == 2);
    ^
1 passed; 0 skipped; 1 failed.
```

Awesome, our tests failed! But that's okay because that was to be expected.
Now let's implement our `insert()` method to make them pass:

```zig
fn LinkedList(comptime T: type) type {
    return struct {
        const Self = @This();

        // 1. Define a node type
        const Node = struct {
            value: T,
            next: ?*Node,
        };

        // 2a. Define the linked list properties
        head: ?*Node,
        length: u32,
        allocator: std.mem.Allocator,

        // 2b. Add a constructor/initializer for our linked list
        fn new(allocator: std.mem.Allocator) Self {
            return .{ .length = 0, .head = null, .allocator = allocator };
        }

        // 3. Define an insert method that takes a generic type value
        fn insert(self: *Self, value: T) !void {
            // Allocate the memory and create a `Node` for us to use
            var newNode = try self.allocator.create(Node);

            // Next, set the node value and point it's next value to the current head
            const currentHead = self.head;
            newNode.value = value;
            newNode.next = currentHead;

            // Finally, repoint our head to the new node and increment the count
            self.head = newNode;
            self.length += 1;
        }

        // 4. Define a pop method

        // 5. Define a traverse method, printing all the values

        // 6. Extra credit: define an insertAt method
    };
}
```

Okay, a few things have changed. We've added an `allocator` property that's
of type `std.mem.Allocator` - remember how we mentioned Zig's use of no hidden memory allocations?
Well if we want to create structs, we need to allocate the memory manually to do so. This is
where a `std.mem.Allocator` comes in handy. There are several different types of allocators
in Zig's standard library, though we'll use the [arena allocator](https://Ziglearn.org/chapter-2/)
as skimming the docs seems like the best strategy for now for a Zig noobie like myself. We purposely avoid
strongly coupling to the allocator type in our linked list and force our callers to provide
one to make things a bit more flexible, as tomorrow we might wake up and decide
to use a `GeneralPurposeAllocator` instead. Let's update our tests to use the `ArenaAllocator`:

```zig
test "initializing builds an empty linked list with no head or tail" {
    // arrange, setup and allocator for our linked list to create nodes internally
    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    const linkedList = LinkedList(u32).new(allocator);

    // act/assert
    try std.testing.expect(linkedList.length == 0);
    try std.testing.expect(linkedList.head == null);
}

test "inserting a value appends to the head of the linked list" {
    // arrange
    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    var linkedList = LinkedList(u32).new(allocator);

    // act
    try linkedList.insert(69);

    // assert
    try std.testing.expect(linkedList.length == 1);
    try std.testing.expect(linkedList.head != null);
    try std.testing.expect(linkedList.head.?.value == 69);
}
```

Though we're running single process unit tests that aren't long running (they start and stop
without using much in terms of resources from our machine) and probably don't need to manually free memory
with the calls to `defer arena.deinit()`, it's a good habit to form to get used to manually
managing and freeing allocated memory. We might also benefit from being able to free memory
from within our `LinkedList` as well by adding a wrapping call in the form
of `fn free(self: *Self) !void { // Free the memory }`,
but I'll save that for a rainy day as I still have fairly no clue what I'm doing with Zig.

We also need to slap some `try`s to our `insert()` method
now that its return signature is `!void` instead of just `void` - errors can occur while
allocating memory, so we need to explicitly state that in our signature with a prefixed `!` operator before our return
type (`void` in this case). Okay, our tests
are updated to handle/return the errors. Let's run our tests now:

```shell
$ zig build test
All 2 tests passed.
```

Nice, passing tests that are _actually_ somewhat legit now! What happens if
we insert multiple values into the linked list? Let's write a test
for this case:

```zig
test "inserting multiple values correctly updates head" {
    // arrange
    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    var linkedList = LinkedList(u32).new(allocator);

    // act
    try linkedList.insert(69);
    try linkedList.insert(420);
    try linkedList.insert(1337);

    // assert
    try std.testing.expect(linkedList.length == 3);
    try std.testing.expect(linkedList.head != null);
    try std.testing.expect(linkedList.head.?.value == 1337);
}
```

Running our tests again, and they pass without needing to update our
implementation, nice! Okay, we're getting the hang of things... let's
kick it up another notch and flesh out our pop method. Let's flesh out the bare minimum case:

```zig
fn LinkedList(comptime T: type) type {
    return struct {
        // Other stuff...

        // 4. Define a pop method
        fn pop(_: *Self) ?T {
            return null;
        }
    };
}
```

And next, let's add the tests that we know will fail:

```zig
test "popping nodes off the linked list returns a value" {
    // arrange
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();
    var linkedList = LinkedList(u32).new(allocator);

    // act, with order 1337 -> 420 -> 69 -> null
    try linkedList.insert(69);
    try linkedList.insert(420);
    try linkedList.insert(1337);

    // after popping, our list should be 420 -> 69 -> null
    const poppedValue = linkedList.pop();

    // assert
    try std.testing.expect(linkedList.length == 2);
    try std.testing.expect(linkedList.head != null);
    try std.testing.expect(linkedList.head.?.value == 420);
    try std.testing.expect(poppedValue != null);
    try std.testing.expect(poppedValue.? == 1337);
}
```

Our tests fail when we run them, so let's flesh out our `.pop()` implementation
now to get them passing:

```zig
fn LinkedList(comptime T: type) type {
        // Other stuff...

        // 4. Define a pop method
        fn pop(self: *Self) ?T {
            // If we don't have a head, there's no value to pop!
            if (self.head == null) {
                return null;
            }

            // Grab a few temporary values of the current head
            const currentHead = self.head;
            const updatedHead = self.head.?.next;

            // Update head and decrement the length now that we're freeing ourselves of a node
            self.head = updatedHead;
            self.length -= 1;

            return currentHead.?.value;
        }
    };
}
```

Once again, if we run our tests, we should see four now passing in the console. Sweet!
But wait... what happens if we `.pop()` on a single-item linked list? In theory, we should
get the value as it'll be the only node in the list. Let's verify that our implementation
covers this case with yet another test:

```zig
test "popping a node off a linked list with one item returns it's value" {
    // arrange, setup and allocator for our linked list to create nodes internally
    var arena = std.heap.ArenaAllocator.init(pageAllocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    var linkedList = LinkedList(u32).new(allocator);

    // act
    try linkedList.insert(69);
    const poppedValue = linkedList.pop();

    // assert
    try std.testing.expect(linkedList.length == 0);
    try std.testing.expect(linkedList.head == null);
    try std.testing.expect(poppedValue != null);
    try std.testing.expect(poppedValue.? == 69);
}
```

Running the tests again, looks like we're covered for the case of
a single-item linked list. What happens if we `.pop()` on a linked list
with no items? In theory, we shouldn't get any values returned, but let's
verify with a test:

```zig
test "popping a node off an empty linked list returns null" {
    // arrange, setup and allocator for our linked list to create nodes internally
    var arena = std.heap.ArenaAllocator.init(pageAllocator);
    defer arena.deinit();
    const allocator = arena.allocator();
    var linkedList = LinkedList(u32).new(allocator);

    // act
    const poppedValue = linkedList.pop();

    // assert
    try std.testing.expect(linkedList.length == 0);
    try std.testing.expect(linkedList.head == null);
    try std.testing.expect(poppedValue == null);
}
```

Running the tests yet again yields passing results! Okay, only
one more implementation to flesh out with our `.traverse()` method. For this
implementation, let's simply print out the values to stdout:

```zig
const std = @import("std");
const pageAllocator = std.heap.page_allocator;
const testing = std.testing;

pub fn LinkedList(comptime T: type) type {
    return struct {
        // Other stuff...

        // 5. Define a traverse method, printing all the values
        pub fn traverse(self: *Self) void {
            // If we don't have a head, there's nothing traverse!
            if (self.head == null) {
                return;
            }

            // We'll walk our linked list as long as there's a next node available
            var currentNode = self.head;

            while (currentNode != null) : (currentNode = currentNode.?.next) {
                std.log.info("value {}", .{currentNode.?.value});
            }
        }
    };
}
```

Since we're printing node values out to the stdout, it'll be a bit
hard to verify with a unit test that the printed values are as we expect.
Let's refactor our code a bit from a library to an executable binary, that
way we can run our program and visually assert the printed values are correct.
To start, let's rename `src/main.zig` to `src/linked_list.zig` and sprinkle
in a few `pub` keywords to expose the `LinkedList` type itself as well as the
various methods associated to it:

## src/linked_list.zig

```zig
const std = @import("std");
const pageAllocator = std.heap.page_allocator;
const testing = std.testing;

pub fn LinkedList(comptime T: type) type {
    return struct {
        const Self = @This();

        // 1. Define a node type
        const Node = struct {
            value: T,
            next: ?*Node,
        };

        // 2a. Define the linked list properties
        // There should be three: head, length, and allocator
        head: ?*Node,
        length: u32,
        allocator: std.mem.Allocator,

        // 2b. Add a constructor/initializer for our linked list
        pub fn new(allocator: std.mem.Allocator) Self {
            return .{ .length = 0, .head = null, .allocator = allocator };
        }

        // 3. Define an insert method that takes a generic type value
        pub fn insert(self: *Self, value: T) !void {
            // Allocate the memory and create a `Node` for us to use
            var newNode = try self.allocator.create(Node);

            // Next, set the node value and point it's next value to the current head
            const currentHead = self.head;
            newNode.value = value;
            newNode.next = currentHead;

            // Finally, repoint our head to the new node and increment the count
            self.head = newNode;
            self.length += 1;
        }

        // 4. Define a pop method that removes the last inserted node
        pub fn pop(self: *Self) ?T {
            // If we don't have a head, there's no value to pop!
            if (self.head == null) {
                return null;
            }

            // Grab a few temporary values of the current head
            const currentHead = self.head;
            const updatedHead = self.head.?.next;

            // Update head and decrement the length now that we're freeing ourselves of a node
            self.head = updatedHead;
            self.length -= 1;

            return currentHead.?.value;
        }

        // 5. Define a traverse method, printing all the values
        pub fn traverse(self: *Self) void {
            // If we don't have a head, there's nothing traverse!
            if (self.head == null) {
                return;
            }

            // We'll walk our linked list as long as there's a next node available
            var currentNode = self.head;

            while (currentNode != null) : (currentNode = currentNode.?.next) {
                std.log.info("value {}", .{currentNode.?.value});
            }
        }
    };
}

// None of our test code will change...
```

We can keep our inline unit tests the same, and they should still work. Next,
let's update our `src/main.zig` file to be just a simple `main()`:

## src/main.zig

```zig
const std = @import("std");
const linkedList = @import("./linked_list.zig").LinkedList;

pub fn main() !void {
    // Assign an arena allocator for our linked list to use for creating nodes
    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    const allocator = arena.allocator();

    // Don't forget to free the memory on exit!
    defer arena.deinit();

    // Declare our linked list and add a few nodes
    var u32LinkedList = linkedList(u32).new(allocator);
    try u32LinkedList.insert(2);
    try u32LinkedList.insert(3);
    try u32LinkedList.insert(1);

    // Finally, traverse the list with the output:
    //    1
    //    3
    //    2
    u32LinkedList.traverse();
}
```

Okay, if I'm _hopefully_ doing this right, I'll `@import()` our `LinkedList`
from our local `linked_list.zig` file, spin up an allocator as a linked list dependency,
insert a few nodes, and walk the list. One last thing we need to change is our `build.zig` file
as it's expected to build for a library, not an executable binary. Let's update that
to add an executable target with a little copy-pasta from a fresh `zig init-exe` test
executable:

## build.zig

```zig
const std = @import("std");

pub fn build(b: *std.build.Builder) void {
    // Standard target options allows the person running `zig build` to choose
    // what target to build for. Here we do not override the defaults, which
    // means any target is allowed, and the default is native. Other options
    // for restricting supported target set are available.
    const target = b.standardTargetOptions(.{});

    // Standard release options allow the person running `zig build` to select
    // between Debug, ReleaseSafe, ReleaseFast, and ReleaseSmall.
    const mode = b.standardReleaseOptions();

    const exe = b.addExecutable("ziggin-around-with-linked-lists", "src/main.zig");
    exe.setTarget(target);
    exe.setBuildMode(mode);
    exe.install();

    const run_cmd = exe.run();
    run_cmd.step.dependOn(b.getInstallStep());
    if (b.args) |args| {
        run_cmd.addArgs(args);
    }

    const run_step = b.step("run", "Run the app");
    run_step.dependOn(&run_cmd.step);

    const exe_tests = b.addTest("src/main.zig");
    exe_tests.setTarget(target);
    exe_tests.setBuildMode(mode);

    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&exe_tests.step);
}
```

Note the key changes being our builder calling `.addExecutable()` and running
the program with `exe.run()`. Let's take this for a spin now and see what we get:

```shell
$ zig build run
info: value 1
info: value 3
info: value 2
```

Alright, just like we expected! Since we did a bit of refactoring, let's
make sure our tests still pass. We're building in the context of a runnable
program, so we can directly test our `linked_list.zig` file with the toolchain:

```shell
$ zig test src/linked_list.zig
All 6 tests passed.
```

And once again, we have passing tests!

## Wrapping up

I'm gonna call that a wrap for now, as our (poor man's) linked
list is looking pretty good and functioning as we expect. I'll be looking to a bit more Zig to spice up my daily
developer life when I can.
Zig feels a lot like Rust with much of the same safety guarantees and is just plain fun to write.

Until next time, friends!
