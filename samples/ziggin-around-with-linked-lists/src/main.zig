const std = @import("std");

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

            // For a linked list with a single item, both the head and tail will be the same node in the list
            if (self.length == 1) {
                self.tail = self.head;
            }
        }

        // 4. Define a pop method

        // 5. Define a traverse method, printing all the values

        // 6. Extra credit: define an insertAt method
    };
}

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
    try std.testing.expect(linkedList.tail == linkedList.head);
}
