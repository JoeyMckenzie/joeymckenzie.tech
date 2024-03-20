namespace HopTracker.Entities;

public abstract record EntityBase
{
    public required int Id { get; init; }

    public required DateTime CreatedAt { get; init; }

    public required DateTime UpdatedAt { get; init; }
}
