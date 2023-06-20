namespace WithNeonFly;

public record Brewery
{
  public required Guid Id { get; init; }

  public required string Name { get; init; }

  public required decimal Abv { get; init; }

  public required int Ibu { get; init; }
}