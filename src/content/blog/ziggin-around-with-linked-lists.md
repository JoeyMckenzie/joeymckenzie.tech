---
title: "Ziggin' around with linked lists"
description: 'Flashback to detecting loops in a list on a whiteboard...'
pubDate: 'May 25 2023'
heroImage: '/blog/serverless-databases-with-rust-neon/meme.jpg'
category: 'zig'
published: false
---

So I've been looking for a reason to write code to keep me sane while in the
thick of parental leave, and I, like I'm sure most of us have seen on tech bro
twitter, have been seeing a lot of commotion about [zig](https://ziglang.org).
I've been writing quite a bit of rust, and zig's model of no hidden memory
allocation or hidden control flow is fascinating to me.

Much like rust's upfront model of memory safety first, becoming conscious
of the borrows (with lots of help from the compiler) definitely made me
more aware of _what_ exactly I was doing in code rather than passing
objects (and thus, memory) around willy nilly. Those that have read a
few things around here know that I'm married to .NET during my 8-to-5,
where corporate .NET developer America is not concerned
much about zero cost abstractions and memory safety.

I wanted to get down and dirty with some zig, and what better way to
that than take a trip down CS-from-college memory lane: implementing a
linked list! I like to drink from the fire hose, so to speak, when learning
a new language, so I'll treat this blog post as a live look into my trials
and tribulations of getting started with zig.

## Getting started with zig

Okay, so I want to implement a linked list with zig. I'm definitely going
to need a zig toolchain on my machine. Luckily, the docs have me covered.
I'm on WSL using Ubuntu 22.04, so I'll use [snap](https://snapcraft.io/) to
install the zig toolchain:

```bash
$ sudo snap install zig --classic --beta
```

There's an option to install the latest version of zig from master using the
`--edge` flag in place of `--beta`, but I have no idea what I'm doing with zig
yet so the latest stable version should do me just fine. Okay, got zig installed,
let's check the version:

```bash
$ zig version
0.10.1
```

Nice! Zig was successfully installed, so let's spin up a simple library
similar to something like `cargo new --lib my-lib`. We'll use a library in this
case as we don't need really need run anything in the console, writing and running
a few tests to assert our linked list's behavior is correct should suffice.

Okay, according to the docs, a `zig init-lib` should do the trick:

```bash
$ mkdir ziggin-around-with-linked-lists && cd "$_"
$ zig init-lib
info: Created build.zig
info: Created src/main.zig
info: Next, try `zig build --help` or `zig build test`
```

Sweet! I see two files now, `src/main.zig` and `build.zig`. Let's crack open the
build file to make some sense of it:

## build.zig

```zig
const std = @import("std");

pub fn build(b: *std.build.Builder) void {
    // Standard release options allow the person running `zig build` to select
    // between Debug, ReleaseSafe, ReleaseFast, and ReleaseSmall.
    const mode = b.standardReleaseOptions();

    const lib = b.addStaticLibrary("zig-test", "src/main.zig");
    lib.setBuildMode(mode);
    lib.install();

    const main_tests = b.addTest("src/main.zig");
    main_tests.setBuildMode(mode);

    const test_step = b.step("test", "Run library tests");
    test_step.dependOn(&main_tests.step);
}
```

Okay, parsing this file a bit, it looks like there's a few things going on:

- Zig doesn't have a traditional package manager yet on the stable branch, though it's coming soon^tm
- Zig build system looks interesting in the sense it's DSL _is_ the language itself
- Since we're in the context of a library, our default build target will just run tests
  as we're not building an executable

Alright, I _think_ I've got the basics down here. Cross referencing the docs about its [build system](https://ziglearn.org/chapter-3/)
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

- Imports defined at the top with `@import` - pretty cool, feels a lot like other languages
- We export a single `add` function that returns an `i32` - feels pretty similar to go and rust integer types
- There's a testing block with a short description - pretty neat, feels a bit jest-like
- We `try` to make an assertion - `try` in zig is pretty neat
  - `try` feels a lot like rust's try operator in `?` or go's abundant `if err != nil { ... }` you'll see everywhere
  - In essence, attempt an operation and if it fails, simply return the error back to the caller

Okay, think I've got a hang of this so far. I'm loosely inline with my pontification and the docs, so
let's give this thing a go:

```bash
$ zig build test
All 1 tests passed.
```

Nice, our tests passed! Adding two numbers is fun and all,
but let's kick it up a notch by building a simple linked lists.

## Linked lists for fun

There's a thousand other resources for learning about what a linked list is
and why they useful in fundamental computer science - I'm not exactly the person
to listen to when it comes to that arena, so I'll leave it to the academics
and the LinkedIn tech influencers to do a much better job than I will
when discussing linked lists.

Without going too far down the CS rabbit hole, our version of a linked list
will be fairly straight forward. Our linked list will have:

- A head node
- A tail node
- A way to keep track of the length
- A few operations associated to it:
  - An `insert` method that will attach new nodes to the head
  - A `pop` method that will detach nodes from tail and read out their values
  - A `traverse` method will walk the linked list and print out values as it goes

There's a lot more to a linked list than the operations we defined above - for example,
one could insert at _any_ point in the linked list rather than the head, or peek values
at the tail rather than explicitly removing them. I'll leave those as an exercise for the reader.

Let's get started by scaffolding out a simple `struct` that will be our linked list. Let's create
a `linked_list.zig` file adjacent to our `main.zig` in our `src/` directory and get some boilerplate
in place:

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

    // 6. Extra credit: define an insertAt method
};
```

Taking a look, zig has `struct`s much like go and rust - nothing new here. Now,
I _do_ want this to be a generic linked list over some type of my choosing. Skimming
through the docs, looks like I need to do a bit of higher order goodness with `comptime`
types to get this working. Let's adjust this code so our `LinkedList` is actually a function `fn`
that will take in a generic `comptime` type and return a `struct` that's generic over it:

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

        // 6. Extra credit: define an insertAt method
    };
}
```

Cool, I've got a generic struct so far, and also defined a new internal `Node` type
to house the generic type value that we'll use when creating new nodes on the linked list
that also points to the next node in the list. We'll reach for zig's `?` operator as a form
of nullability, telling the compiler "hey, this `Node` here could be `null`, so make sure
to enforce checking that before dereferencing it" and also slap a `*` afterwards to signal
that this is a _pointer_ to another node, not the node itself.

Okay, I'm liking this so far. Zig feels a bit like go, a bit like rust, and a bit like C
(I cut my teach on Fortran starting out, don't judge me). Let's add a few properties
to our linked list now:

```zig
fn LinkedList(comptime T: type) type {
    return struct {
        // 1. Define a node type
        const Node = struct { value: T, next: ?*Node };

        // 2a. Define the linked list properties
        // There should be three: head, tail, and length
        head: ?*Node,
        tail: ?*Node,
        length: u32,

        // 2b. Add a constructor/initializer for our linked list
        pub fn new() LinkedList(T) {
            return LinkedList(T){ .length = 0, .head = null, .tail = null };
        }

        // 3. Define an insert method that takes a generic type

        // 4. Define a pop method

        // 5. Define a traverse method, printing all the values

        // 6. Extra credit: define an insertAt method
    };
}
```

Okay, so we added `head`, `tail`, and `length` properties as well as a
constructor with `fn new()` to initialize our linked list. So far, so good.
We have the world's most basic linked list that does and contains... absolutely nothing.
Let's write some tests to verify the nothingness:

```zig
test "initializing builds an empty linked list with no head or tail" {
    const linkedList = LinkedList(u32).new();
    try std.testing.expect(linkedList.length == 0);
    try std.testing.expect(linkedList.head == null);
    try std.testing.expect(linkedList.tail == null);
}
```

Our test is pretty basic, just asserting there's no length, head, or tail when initializing
our linked list. Let's run this:

```bash
$ zig build test
All 1 tests passed.
```

Passing tests for our useless linked list, huzzah!

Since my brain is still in rust-land, I look at `try` keywords in a similar fashion to rust's `?`,
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
        // There should be three: head, tail, and length
        head: ?*Node,
        tail: ?*Node,
        length: u32,

        // 2b. Add a constructor/initializer for our linked list
        fn new() Self {
            return .{ .length = 0, .head = null, .tail = null };
        }

        // 3. Define an insert method that takes a generic type value
        fn insert(_: *Self, _: T) void {}

        // 4. Define a pop method

        // 5. Define a traverse method, printing all the values

        // 6. Extra credit: define an insertAt method
    };
}
```

After a bit of digging, we need to add the line for `const Self = @This()` to signal
that the internal struct methods are methods associated to the struct itself,
not static functions callable without an object reference. This feels a lot like
the `&self` argument you'll see when implementing traits or defining struct
methods in rust, so we'll add it to get the same functionality. Now, let's
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

We're tapping into zig's optional chaining mechanism for struct values
with `.?.value` to essentially unwrap the nullish `value`. Now if we if we run our tests...

```bash
$ zig build test
Test [2/2] test.inserting a value appends to the head of the linked list... FAIL (TestUnexpectedResult)
/snap/zig/6352/lib/std/testing.zig:347:14: 0x211627 in expect (test)
    if (!ok) return error.TestUnexpectedResult;
             ^
/home/jmckenzie/projects/rust/joey-mckenzie-tech/samples/ziggin-around-with-linked-lists/src/main.zig:51:5: 0x21186e in test.inserting a value appends to the head of the linked list (test)
    try std.testing.expect(linkedList.length == 2);
    ^
1 passed; 0 skipped; 1 failed.
```

Awesome, our tests failed! But that's okay, because that was to be expected.
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
        // There should be three: head, tail, length, and allocator
        head: ?*Node,
        tail: ?*Node,
        length: u32,
        allocator: std.mem.Allocator,

        // 2b. Add a constructor/initializer for our linked list
        fn new(allocator: std.mem.Allocator) Self {
            return .{ .length = 0, .head = null, .tail = null, .allocator = allocator };
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
of type `std.mem.Allocator` - remember how we mentioned zig's use of no hidden memory allocations?
Well if we want to create structs in memory, we need to allocate the space to do so. This is
where a `std.mem.Allocator` comes in handy. There's several different types of allocators
in zig' standard library, though we'll use the general purpose allocator as skimming the docs
seems like the best strategy for now for a zig noobie like myself. We purposely avoid
strongly coupling to the allocator type in our linked list and force our callers to provide
one to make things a bit more flexible. In our tests, let's use the `GeneralPurposeAllocator`
and pass that in as a constructor to our `LinkedList`:

```zig
test "initializing builds an empty linked list with no head or tail" {
    // arrange
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();
    const linkedList = LinkedList(u32).new(allocator);

    // act/assert
    try std.testing.expect(linkedList.length == 0);
    try std.testing.expect(linkedList.head == null);
    try std.testing.expect(linkedList.tail == null);
}

test "inserting a value appends to the head of the linked list" {
    // arrange
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();
    var linkedList = LinkedList(u32).new(allocator);

    // act
    try linkedList.insert(69);

    // assert
    try std.testing.expect(linkedList.length == 1);
    try std.testing.expect(linkedList.head != null);
    try std.testing.expect(linkedList.head.?.value == 69);
}
```

There's a few initialization options when using the `GeneralPurposeAllocator`, though
we'll take the default one in this case. We need to slap some `try`s to our `insert()` method
now that its return signature is `!void` instead of just `void` - errors can occur while
allocating memory, so we need to explicitly state that in our signature. Okay, our tests
are updated to handle/return the errors. Let's run our tests now:

```bash
$ zig build test
All 2 tests passed.
```

Nice, passing tests that are _actually_ somewhat legit now! There's one problem
though. What's the tail of a single-item linked list? Its head! We need to update
our tests to reflect that case as well:

```zig
test "inserting a value appends to the head of the linked list" {
    // arrange
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();
    var linkedList = LinkedList(u32).new(allocator);

    // act
    try linkedList.insert(69);

    // assert
    try std.testing.expect(linkedList.length == 1);
    try std.testing.expect(linkedList.head != null);
    try std.testing.expect(linkedList.head.?.value == 69);
    try std.testing.expect(linkedList.tail == linkedList.head);
}
```

If we run the tests now, they fail. Let's update our `insert()` method to
account for the single-item edge case of a linked list that keeps track
of both its head and tail:

```zig
fn LinkedList(comptime T: type) type {
    return struct {
        // Other stuff...

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

            // For a linked list with a single item, both the head and tail will be the same node in the list
            if (self.length == 1) {
                self.tail = self.head;
            } else if (self.length > 1) {

            }
        }
    };
}
```

Running our tests now, we're back to both of them passing... but we have yet another issue.
I'll let you take a guess - what happens if we add more than one node to our linked list?
As it stands, when we push our initial item into the linked list, `tail` will point to `head`.
If we push _another_ item into the list... yep, you guessed... `tail` will _still_ point to the initial
item. Not good, we need to update this so our tail is always the last node inserted:

```zig

```
