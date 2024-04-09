using System.Data;
using Dapper;
using HopTracker.Aggregates;
using HopTracker.Entities;
using Npgsql;

namespace HopTracker.Repositories;

public class BreweryRepository : IDisposable
{
    private readonly IDbConnection _connection;

    public BreweryRepository(string? connectionString)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(connectionString);
        _connection = new NpgsqlConnection(connectionString);
        _connection.Open();
    }

    public async Task<BreweryAggregate?> GetBreweryAsync(
        int id,
        CancellationToken cancellationToken
    )
    {
        const string sql = """
            SELECT br.id,
                   br.brewery_name AS name,
                   br.created_at,
                   br.updated_at,
                   b.id AS beer_id,
                   b.beer_name AS name,
                   b.beer_type AS type,
                   b.created_at,
                   b.updated_at,
                   e.id AS employee_id,
                   e.first_name,
                   e.last_name,
                   e.created_at,
                   e.updated_at
            FROM breweries br
            JOIN beers b ON br.id = b.brewery_id
            JOIN employees e ON br.id = e.brewery_id
            WHERE br.id = @BreweryId
            """;

        BreweryAggregate? breweryAggregate = null;

        await _connection.QueryAsync<BreweryAggregate, Beer, Employee, BreweryAggregate>(
            sql,
            (brewery, beer, employee) =>
            {
                // On first pass, we'll assign the brewery based on the first row returned
                breweryAggregate ??= brewery;

                // Next, we'll add the relationships
                breweryAggregate.Beers.Add(beer);
                breweryAggregate.Employees.Add(employee);

                return breweryAggregate;
            },
            new { BreweryId = id },
            splitOn: "beer_id, employee_id"
        );

        return breweryAggregate;
    }

    public void Dispose()
    {
        GC.SuppressFinalize(this);
        _connection.Close();
    }
}
