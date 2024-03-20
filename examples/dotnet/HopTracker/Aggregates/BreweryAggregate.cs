using HopTracker.Entities;

namespace HopTracker.Aggregates;

public record BreweryAggregate
{
    public required int Id { get; init; }

    public required string Name { get; init; }

    public ISet<Beer> Beers { get; } = new HashSet<Beer>();

    public ISet<Employee> Employees { get; } = new HashSet<Employee>();

    public override string ToString()
    {
        return $"""
            Id: {Id}
            Name: {Name}
            Beers: [{string.Join(", ", Beers.Select(b => b.Name))}]
            Employees: [{string.Join(", ", Employees.Select(e => $"{e.FirstName} {e.LastName}"))}]
            """;
    }
}
