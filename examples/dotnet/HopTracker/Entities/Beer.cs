namespace HopTracker.Entities;

public record Beer : EntityBase
{
    public required string Name { get; init; }

    public required string Type { get; init; }

    public required int BreweryId { get; init; }
}
