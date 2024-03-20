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
