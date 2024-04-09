namespace HopTracker;

public record Configuration
{
    public required ConnectionStrings ConnectionStrings { get; init; }
}

public record ConnectionStrings
{
    public required string Postgres { get; init; }
}
