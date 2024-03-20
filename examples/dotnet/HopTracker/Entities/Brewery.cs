namespace HopTracker.Entities;

public record Brewery : EntityBase
{
    public required string Name { get; init; }
}
