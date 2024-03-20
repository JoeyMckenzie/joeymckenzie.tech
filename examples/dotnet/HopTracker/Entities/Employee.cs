namespace HopTracker.Entities;

public record Employee : EntityBase
{
    public required string FirstName { get; init; }

    public required string LastName { get; init; }

    public required int BreweryId { get; init; }
}
