using System.Diagnostics;
using Dapper;
using HopTracker;
using HopTracker.Repositories;
using Microsoft.Extensions.Configuration;

var config = new ConfigurationBuilder().AddUserSecrets<Configuration>().Build();
using var breweryRepository = new BreweryRepository(config.GetConnectionString("Postgres"));
using var tokenSource = new CancellationTokenSource(TimeSpan.FromSeconds(1));

DefaultTypeMap.MatchNamesWithUnderscores = true;

var cancellationToken = tokenSource.Token;
var brewery = await breweryRepository.GetBreweryAsync(1, cancellationToken);

Console.WriteLine(brewery);

var instanceA = new SomeClass(42069);
var instanceB = new SomeClass(42069);

Console.WriteLine(instanceA.GetHashCode());
Console.WriteLine(instanceB.GetHashCode());

// Will print to the console:
//
// 42069
// 42069

// False! Instance A and B have different hash codes
Debug.Assert(instanceA == instanceB);

public class SomeClass(int someValue) : IEquatable<SomeClass>
{
    public int SomeValue { get; } = someValue;

    public bool Equals(SomeClass? other)
    {
        if (other is null)
        {
            return false;
        }

        return SomeValue == other.SomeValue;
    }

    public static bool operator ==(SomeClass? left, SomeClass? right)
    {
        if (left is null && right is null)
        {
            return true;
        }

        if (left is null && right is not null)
        {
            return false;
        }

        if (left is not null && right is null)
        {
            return false;
        }

        return left!.Equals(right);
    }

    public static bool operator !=(SomeClass? left, SomeClass? right) => !(left == right);

    public override int GetHashCode() => SomeValue.GetHashCode();
}
