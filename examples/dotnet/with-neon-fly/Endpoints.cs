namespace WithNeonFly;

/// <summary>
/// Endpoint register for the various APIs offered by our service. Moving away from controllers,
/// we utilize routable endpoints in their place directly injecting required dependencies.
/// </summary>
public static class Endpoints
{
    private static IResult GetBreweriesAsync(CancellationToken cancellationToken)
    {
        // Logger.Instance.LogInfo($"Received Lendio notification that a document {request.DocumentId} was added for deal {request.Id}");

        // mediator.Send(new UploadDocumentRequest(request.Id, request.DocumentId), cancellationToken);

        // var result = UploadDocumentApiResponse.Success;
        // return Task.FromResult(ResultWithStatusCode(result));
        return Results.Ok();
    }

    /// <summary>
    /// Bundles API routes into a route group to be served by our web server.
    /// </summary>
    /// <param name="group">Route table provided by ASP.NET.</param>
    public static void MapApiRoutes(this RouteGroupBuilder group)
    {
    }
}
