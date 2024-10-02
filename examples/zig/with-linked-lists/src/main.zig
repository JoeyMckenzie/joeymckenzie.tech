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
