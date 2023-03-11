---
title: 'Blazor basics - calling external APIs with typed HTTP clients'
description: "Move over JavaScript, there's a new sheriff in town (not really, we still love you, JS)."
pubDate: 'Apr 24 2020'
heroImage: '/blog/blazor-basics-series/javascript_meme.png'
category: 'blazor'
---

Two truths and a lie: Nickelback is good, pineapples don't belong on pizza, and JavaScript is bad.

/s

All memes aside, JavaScript is **not** actually bad, despite most of the developer opinions you might see on [r/ProgrammerHumor](https://www.reddit.com/r/ProgrammerHumor/). JavaScript is used _all_ over the web, across the entire stack, and even leaking into the desktop development space with things like [Electron](https://www.electronjs.org/). Now just because a language happens to be used en mass across a variety of development specializations does not necessarily mean it is superior to any other language, or framework. It just so happens that since JavaScript's rise to power beginning in the mid-to-late 2000's (some might argue sooner, some later), virtually every modern website on the web nowadays has some sort of JS running to make those fancy page transitions seem like magic to the user.

Listen, I get it: JavaScript leaves a lot to be desired for a Turing-complete language, but nonetheless, it is quite the robust language and is used by companies large and small across their entire stack and there's nothing we can do to change that. Heck, I've had my fair share of JS development during my professional career, from fixing mid-90's early JS that will make your eyes bleed, to building large enterprise web applications using Angular with TypeScript for sanity. If I told you that I'm an advocate for JS, in all honesty, I'd be lying. However, despite my personal angst with JavaScript, I can think of quite a few other languages and platforms I'd much rather stay further away from than JS (I'm looking at you, AS/400).

I could go on and on about my personal journey with JS, things I like about the language, things about it that make me want to throw my laptop off a 20-story building, and where I see JavaScript's place in modern web development evolving over the coming years, but I digress.

Enter [Blazor](https://dotnet.microsoft.com/apps/aspnet/web-apps/blazor), the new kid on the block from Microsoft that enables .NET developers, and anyone looking for a JavaScript alternative, to bring their backend skills and knowledge to the browser, all in the same platform. If you've been living under a rock and this is your first time hearing about Microsoft's new SPA framework, I'd suggest taking an afternoon to read through some of the getting started docs the team has put together, the different [hosting models](https://docs.microsoft.com/en-us/aspnet/core/blazor/hosting-models?view=aspnetcore-3.1) the framework has to offer, and Blazor's philosophy in general. If you _have_ heard of Blazor, or have even used it in a project, you'll know that it works because of [WebAssembly](https://webassembly.org/). I won't go into the details as to how exactly we get native C# code to run in the browser, as there are numerous articles and documentation out there that will do a much better job than I ever could providing technical explanation for the framework, as quite frankly I'd be lying if I said I fully understand how the minds at Microsoft, a.k.a Steve Sanderson and team, built Blazor in the first place. Don't get me wrong, we'll dive into some of the details when we start getting our hands dirty with the framework so we have a somewhat fundamental understanding of what exactly is going, but we'll only be skimming the surface.

I've been fiddling with Blazor a lot lately, using it for personal projects, and experimenting with the plethora of [awesome tools and libraries](https://github.com/AdrienTorris/awesome-blazor) put together by the .NET community as they've embraced the framework in its entirety. In the spirit of helping others learn from my trials and tribulations, I wanted to write a series of posts exploring Blazor that will hopefully serve as a reference for you on your own personal journey into Blazor development. So, without further ado, let's jump into the first topic in our Blazor series.

#### HTTP Request Workflow

Working on the modern web nowadays, for the most part, requires knowledge in some form of the client-server model, with our specific implementation being communication between the browser and a backend service API. With the plethora of SPA frameworks available at our disposal, JavaScript holds the market share by a landslide, and for a good reason. When we build web applications meant to be run in the browser, more often than not, we'll require some sort of data to display on the page that ultimately is stored in some database on some server, somewhere on continental Earth. The question is, how do we, from the comfort of our local browser, access this data? With modern security protocols and limitations of the browser, we can't exactly establish a database connection and query for the data we desire (for good reason).

Quite often in the modern world, our browser will make HTTP requests to some backend API, or service, requesting some form of data, or data to be processes attached on the request, and depending on the backend service's knowledge of the client requesting this data and/or data processing, the service will respond back to the request in question with the data, or knowledge that the data was processed: In its simplest form:

![Browser_server_model](/blog/blazor-basics-series/http_request_flow.png)

From the browsers perspective, a user lands on a page that will make an HTTP request to some backend service to retrieve some data to display on said page. In a more typical scenario exampling a GET call, the browser (more so, the HTTP requesting service implementation within our SPA) will initially make an OPTIONS request to the backend server, telling the server "hey, I'm a browser client from this origin, is it cool if I have some data?" Depending on the server's cross-origin resource sharing policy (referred to as CORS), it'll respond with a status 200, signalling "yeah dude, absolutely!"

Once the response is received from the browser giving the OK that the request is good to go through with that particular HTTP verb, our client will make another HTTP request with the original request verb and any body data we might want to serialize to the server for processing. We'll see this application flow scenario in our browser tools often times, as it is important for any developer working on the web to understand how client's interact with backend servers and why CORS policies are important. Nearly all modern browsers will stop any client application running inside it when the browser see's the client is trying to make a cross-origin request with the server responding negatively, i.e. non-successful status code, on the OPTIONS request. Without this pre-flight communication, any client would be able to hammer any backend server with HTTP requests, which can lead to a multitude of security and infrastructure issues that can wreak havoc on our backend architecture. The browser is a bouncer, and if we're cool enough, he _might_ just let us into the bar.

#### Calling External APIs from the Browser using Blazor

With the semantics out of the way, let's fire up a new Blazor project and see what calling external APIs looks like in action. While most Blazor how-to's I've seen and read on the web deal with calling ASP.NET Core APIs that also host and serve the Blazor application (the 'ASP.NET Core hosted' checkbox option when creating a new Blazor WASM project), more often than not, we'll be calling APIs and external services already deployed by our company in production from the client's browser. For the purposes of this demo, we'll be creating a Blazor WebAssembly project that will serve using the `Microsoft.AspNetCore.Components.WebAssembly.DevServer` library, rather than having a web project serve the Blazor files for us running as the host. This is more typical in a real world scenario, as a common use case for a single page application is to replace legacy applications that have had their backends rewritten, catering to multiple clients.

I'll be using Visual Studio 2019 for this demo, but feel free to use your IDE/editor of choice. Let's start by creating a new project, either from the command line with `dotnet new blazorwasm`, or `File > New Project` from VS. If you don't have the latest template installed, you can find it [here](https://docs.microsoft.com/en-us/aspnet/core/blazor/get-started?view=aspnetcore-3.1&tabs=visual-studio).

![File_new_project](/blog/blazor-basics-series/file_new_project.png)

Select `Blazor App` from the dialog that appears, and we'll setup our project metadata.

![project_name](/blog/blazor-basics-series/project_name.png)

Punch in whatever name for the project you'd like, and optionally, check the option to place the solution within the project folder. For our simple demo, we won't be adding any additional projects, so placing the solution within the project directory is perfectly fine. However, in a real world application, we'd most likely have tens of hundreds (yep, you heard me right) of projects in a single solution and would better be suited to having the solution file higher up in the directory hierarchy.

Hit Create, and we'll select a Blazor WebAssembly App project hosting model. For now, we'll leave the ASP.NET Core hosted checkbox unchecked for the aforementioned reasons.

![blazor_hosting_model](/blog/blazor-basics-series/blazor_hosting_model.png)

Once the code gen has completed, go ahead and open up your solution explorer in VS, VS Code, or Rider and let's take a look at what Microsoft has bootstrapped for us.

#### Program.cs

```csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.Extensions.DependencyInjection;

namespace ExternalApisWithBlazor
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebAssemblyHostBuilder.CreateDefault(args);
            builder.RootComponents.Add<App>("app");

            builder.Services.AddBaseAddressHttpClient();

            await builder.Build().RunAsync();
        }
    }
}
```

Notice that we no longer are supplied a `Startup.cs` file; thanks to the folks hard at work on Blazor, they've bundled up our application bootstrapping to just a single entry point file that also contains our dependency injection container. Anytime we need to add a service to our DI container, we'll simply use one of `.AddScoped()`, `.AddTransient()`, or `.AddSingleton()` depending on your desired service request lifetime.

#### App.razor

```html
<Router AppAssembly="@typeof(Program).Assembly">
  <Found Context="routeData">
    <RouteView RouteData="@routeData" DefaultLayout="@typeof(MainLayout)" />
  </Found>
  <NotFound>
    <LayoutView Layout="@typeof(MainLayout)">
      <p>Sorry, there's nothing at this address.</p>
    </LayoutView>
  </NotFound>
</Router>
```

Enter Blazor's `Router` component which serves as our route resolver as users navigate to our different `.razor` pages decorated with `@page` directives. For a brief overview of Blazor routing, checkout the [official docs](https://docs.microsoft.com/en-us/aspnet/core/blazor/routing?view=aspnetcore-3.1) from the team. If you're familiar with Angular, I like to think of this as our `<router-outlet>` component that we place in our root component with the help of the framework's `RouterModule`.

At runtime, the `RouteView` renders the desired component with the `routeData` passed from the `Router` component on a resolvable context, a.k.a. a matching `RouterAttribute` from our compiled `.razor` files. We use the default `MainLayout` as our root layout component that all pages will render inside of, and have the ability to change, if we so choose. If no resolvable context is found, we'll render a `LayoutView` (effectively a simple child component with markup rendered within the layout) again using our `MainLayout` as the root component.

#### \_Imports.razor

```html
@using System.Net.Http @using Microsoft.AspNetCore.Components.Forms @using
Microsoft.AspNetCore.Components.Routing @using
Microsoft.AspNetCore.Components.Web @using Microsoft.JSInterop @using
ExternalApisWithBlazor @using ExternalApisWithBlazor.Shared
```

`_Imports.razor` acts our root namespace, more or less, where we can bring in references to external libraries and namespaces to be utilized by our `.razor` page files. Nothing too fancy here, I like to think of it as just another "wiring" file.

#### MainLayout.razor

```html
@inherits LayoutComponentBase

<div class="sidebar">
  <NavMenu />
</div>

<div class="main">
  <div class="top-row px-4">
    <a href="http://blazor.net" target="_blank" class="ml-md-auto">About</a>
  </div>

  <div class="content px-4">@Body</div>
</div>
```

`MainLayout.razor` serves as our root component that will act as the container whose job is to render the child pages found from a resolved context from the `Router` component. With this component inheriting from `LayoutComponentBase`, we have access to the `@Body` directive, acting as the placeholder that will render the markup of our child pages.

#### NavMenu.razor

```csharp
<div class="top-row pl-4 navbar navbar-dark">
    <a class="navbar-brand" href="">ExternalApisWithBlazor</a>
    <button class="navbar-toggler" @onclick="ToggleNavMenu">
        <span class="navbar-toggler-icon"></span>
    </button>
</div>

<div class="@NavMenuCssClass" @onclick="ToggleNavMenu">
    <ul class="nav flex-column">
        <li class="nav-item px-3">
            <NavLink class="nav-link" href="" Match="NavLinkMatch.All">
                <span class="oi oi-home" aria-hidden="true"></span> Home
            </NavLink>
        </li>
        <li class="nav-item px-3">
            <NavLink class="nav-link" href="counter">
                <span class="oi oi-plus" aria-hidden="true"></span> Counter
            </NavLink>
        </li>
        <li class="nav-item px-3">
            <NavLink class="nav-link" href="fetchdata">
                <span class="oi oi-list-rich" aria-hidden="true"></span> Fetch data
            </NavLink>
        </li>
    </ul>
</div>

@code {
    private bool collapseNavMenu = true;

    private string NavMenuCssClass => collapseNavMenu ? "collapse" : null;

    private void ToggleNavMenu()
    {
        collapseNavMenu = !collapseNavMenu;
    }
}
```

We saw that in our `MainLayout.razor` we have a reference to the `NavMenu` component, whose markup will be rendered inside the layout page and included on all application routed pages. The more important aspect of this navbar component that I want to point out is the `NavLink` component wrapping each `<span>` tag inside our list items. `NavLink` is simply an anchor tag facade, allowing us to defer to this component when creating links instead of a typical `<a>` tag. `NavLink` will also add an `active` class member to the current CSS class list of the element if the current window URL matches the `href` destination URL.

Note the use of the `Match` attribute within the `NavLink` component - Blazor offers us a convenient way to give matching criteria for active links through the use of the `NavLinkMatch` enumeration. `NavLinkMatch.All` requires the entire URL segment to match the destination `href` for the `active` class to be added, whereas `NavLinkMatch.Prefix` will add the `active` class if a route begins with our destination URL (i.e. `/blazor/is/cool` would have the `active` class added if it's `NavLink` had `href="blazor" Match="NavLinkMatch.Prefix"`).

### Adding Components

With the basic bootstrapped files provided for us, let's go ahead and get started by adding a page that will interface with an external API of our choosing. The other files included are pretty basic `.razor` pages exampling some of the features of Blazor - I'll leave the exploration of those as a task for the reader.

For the purpose of our project here today, we'll be using the GitHub API to retrieve a list of our repositories and commits from those projects which we'll display in a simple Bootstrap table. GitHub provides and external API for client applications, offering a plethora of data to consume in just about any way we see fit. Let's start by adding a `.razor` page within the `Pages` directory called `GitHubProjects.razor`, where we'll add some markup to just get us started:

#### GitHubProjects.razor

```csharp
@page "/projects"

<h1>Projects</h1>

<table class="table table-hover">
    <thead>
        <tr>
            <th scope="col">Repository</th>
            <th scope="col">Updated At</th>
            <th scope="col">Stars</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>My Super Cool API</td>
            <td>@DateTime.Today.ToLongDateString()</td>
            <td>1337</td>
        </tr>
        <tr>
            <td>My Other Super Cool API</td>
            <td>@DateTime.Today.ToLongDateString()</td>
            <td>9000</td>
        </tr>
    </tbody>
</table>

@code {

    protected override void OnInitialized()
    {
        Console.WriteLine("Projects page loaded");
    }

}
```

We've added a Bootstrap table to help us template things out so we have an idea of how our data will be loaded. We'll create a second table that will load a project's commits when the user clicks on a row and display the latest commits with some additional metadata about each commit. Before we add the markup for the commits table, let's update our current page to be a bit more dynamic, replacing the hard coded table values, and adding a view model to house the data that we'll display in the table along with an `onclick` event handler that will serve to help us retrieve commits for a project when a user clicks on a row:

#### GitHubProjects.razor

```csharp
@using ExternalApisWithBlazor.Models

@page "/projects"

<h1>Projects</h1>

<table class="table table-hover">
    <thead>
        <tr>
            <th scope="col">Repository</th>
            <th scope="col">Updated At</th>
            <th scope="col">Stars</th>
        </tr>
    </thead>
    <tbody>
        @foreach (var repository in repositories)
        {
            <tr @onclick="(() => OnRowClick(repository.Name))">
                <td>@repository.Name</td>
                <td>@repository.UpdatedAt.ToLongDateString()</td>
                <td>@repository.Stars</td>
            </tr>
        }
    </tbody>
</table>

@code {

    private IList<GitHubRepositoryViewModel> repositories = new List<GitHubRepositoryViewModel>();

    protected override void OnInitialized()
    {
        Console.WriteLine("Projects page loaded");

        // Add our stub data for now
        repositories.Add(new GitHubRepositoryViewModel("My Super Cool API", DateTime.Today, 1337));
        repositories.Add(new GitHubRepositoryViewModel("My Other Super Cool API", DateTime.Today, 9000));
        repositories.Add(new GitHubRepositoryViewModel("My Not So Super Cool API", DateTime.Today, 1));
    }

    private void OnRowClick(string repositoryName)
    {
        Console.WriteLine($"{repositoryName} row clicked");
    }

}
```

Alright, things are looking good now! We've added a new model to our page with `GitHubRepositoryViewModel` that will serve as the view model for this page, and I've placed it in a new `Models` directory at the root of our project:

#### Models/GitHubRepositoryViewModel.cs

```csharp
using System;

namespace ExternalApisWithBlazor.Models
{
    public class GitHubRepositoryViewModel
    {
        public GitHubRepositoryViewModel(string name, DateTime updatedAt, int stars) =>
            (Name, UpdatedAt, Stars) = (name, updatedAt, stars);

        public string Name { get; }

        public DateTime UpdatedAt { get; }

        public int Stars { get; }
    }
}
```

This view model is nothing more than a simple POCO, a plain old C# object, whose only job is to be the container for data that we'll display on the UI. While we _could_ use the direct repository JSON model that the GitHub API gives back to us when calling the `repos` endpoint, there's quite a handful of properties that won't concern us, so I prefer to extract the fields we care about into separate models to isolate the API response models from what is actually displayed to the user.

Back in our `GitHubProjects.razor` file, we've added an event handler to fire whenever the user clicks on a row, which Bootstrap will add a highlight to when the user hovers over that particular row. Our handler, seen in the form `@onclick="(() => OnRowClick(repository.Name))"`, is an `EventCallback` that accepts a delegate with the same signature as `MouseEventArgs`, or a lambda expression as we've done here. We use the lambda expression to capture and close over the `repository` as we enumerate through `repositories` to pass the repository name to our click handler method.

Note that in `GitHubProjects.razor`, we've also added an `@using ExternalApisWithBlazor.Models` namespace reference so the compiler can resolve our view model class. Without it, we would need to fully qualify any reference to the `GitHubRepositoryViewModel` type within our razor file.

With everything looking good so far, let's fire up our application and take a look at what we've got so far. Using your IDE, or a terminal with `dotnet watch run`, let's kick off our Blazor application:

![landing_page](/blog/blazor-basics-series/initial_landing_page.png)

Now, if we navigate to `https://localhost:5001/projects`, we'll see our newly added page:

![projects_page](/blog/blazor-basics-series/projects_page.png)

We don't want users to have to manually navigate to the projects page by typing in the URL, so let's go ahead and update `NavMenu.razor` with another menu item that will route users to `/projects`:

#### NavMenu.razor

```csharp
@* Previous navbar stuff *@

<div class="@NavMenuCssClass" @onclick="ToggleNavMenu">

        @* Other links... *@

        <li class="nav-item px-3">
            <NavLink class="nav-link" href="projects">
                <span class="oi oi-dashboard" aria-hidden="true"></span> GitHub Projects
            </NavLink>
        </li>
    </ul>
</div>

@* Our code block *@
```

All we've done is add another `<li>` tag including a `NavLink` to our projects page. Save the project and restart your server, or if you're running `dotnet watch run` through the terminal/PowerShell, go ahead and refresh the page:

![projects_page_with_nav](/blog/blazor-basics-series/projects_page_with_nav.png)

Nice! Now we can easily navigate through the different pages of our application through the nav links on the side menu. Remember that we included a few `Console.WriteLine()` calls in our `OnInitialized` and `OnRowClick` methods; open up your browser's developer tools and navigate to the console. Once there, go ahead and refresh the page, then click on each row:

![event_handlers_in_action](/blog/blazor-basics-series/event_handlers_in_action.png)

Using `Console.WriteLine()`, we're able to perform JavaScript interop with `console.log()` to write to the browser console using C# - if your mind hasn't shattered yet, I'd suggest watching [this](https://www.youtube.com/watch?v=Khn7sDUSEJM) presentation by Steve Sanderson on some of the features of Blazor that dwarf our simple use case here. Continuing with stubbing out our UI, let's add some markup for rendering the commits table for `GitHubProjects.razor`:

#### GitHubProjects.razor

```csharp
@page "/projects"

@using ExternalApisWithBlazor.Models

<h1>Projects</h1>

<table class="table table-hover">
    <thead>
        <tr>
            <th scope="col">Repository</th>
            <th scope="col">Updated At</th>
            <th scope="col">Stars</th>
        </tr>
    </thead>
    <tbody>
        @foreach (var repository in repositories)
        {
            <tr @onclick="(async () => await OnRowClick(repository.Name))">
                <td>@repository.Name</td>
                <td>@repository.UpdatedAt.ToLongDateString()</td>
                <td>@repository.Stars</td>
            </tr>
        }
    </tbody>
</table>

<hr class="py-2" />

@if (loadingCommits)
{
    <div class="d-flex flex-row justify-content-center">
        <div class="spinner-border text-info" role="status">
            <span class="sr-only">Loading commits...</span>
        </div>
    </div>
}
else if (commitAggregate is null)
{
    <h4 class="text-center">Select a row from the table above to load commits</h4>
}
else
{
    @if (commitAggregate.Commits != null && commitAggregate.Commits.Any())
    {
        <h2>Commits for @commitAggregate.Repository</h2>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Sha</th>
                    <th scope="col">User</th>
                    <th scope="col">Message</th>
                </tr>
            </thead>
            <tbody>
                @foreach (var commit in commitAggregate.Commits)
                {
                    <tr>
                        <td>
                            <a href="@commit.HtmlUrl" target="_blank">@commit.Sha.Substring(0, 6)</a>
                        </td>
                        <td>@commit.CommitUser</td>
                        <td>@commit.CommitMessage</td>
                    </tr>
                }
            </tbody>
        </table>
    }
    else
    {
        <h4>No commits found for repository @commitAggregate.Repository :(</h4>
    }
}

@code {

    private IList<GitHubRepositoryViewModel> repositories = new List<GitHubRepositoryViewModel>();

    private GitHubCommitAggregateViewModel commitAggregate;

    private bool loadingCommits;

    protected override void OnInitialized()
    {
        Console.WriteLine("Projects page loaded");

        // Add our stub data for now
        repositories.Add(new GitHubRepositoryViewModel("My Super Cool API", DateTime.Today, 1337));
        repositories.Add(new GitHubRepositoryViewModel("My Other Super Cool API", DateTime.Today, 9000));
        repositories.Add(new GitHubRepositoryViewModel("My Not So Super Cool API", DateTime.Today, 1));
    }

    private async Task OnRowClick(string repositoryName)
    {
        loadingCommits = true;
        Console.WriteLine($"Loading commits for repository {repositoryName}...");

        // Simulate some network latency
        await Task.Delay(TimeSpan.FromMilliseconds(800));

        if (string.Equals(repositoryName, repositories[0].Name))
        {
            commitAggregate = new GitHubCommitAggregateViewModel(repositoryName, new List<GitHubCommitViewModel>
            {
                new GitHubCommitViewModel("abc123", "https://github.com", "joey32793", "feat(Core): Add FluentValidation library"),
                new GitHubCommitViewModel("def456", "https://github.com", "joey32793", "chore(UI): Refactor login screen"),
            });
        }
        else if (string.Equals(repositoryName, repositories[1].Name))
        {
            commitAggregate = new GitHubCommitAggregateViewModel(repositoryName, new List<GitHubCommitViewModel>
            {
                new GitHubCommitViewModel("jkl987", "https://github.com", "user123", "chore(Build): Fix failing Azure Pipelines build"),
                new GitHubCommitViewModel("qwe678", "https://github.com", "user456", "feat(Infrastructure): Add email service"),
            });
        }
        else
        {
            commitAggregate = new GitHubCommitAggregateViewModel(repositoryName, new List<GitHubCommitViewModel>());
        }

        Console.WriteLine("Commits loaded successfully!");
        loadingCommits = false;
    }

}
```

As you can see, we've added quite a bit of code to our projects file. Let's walk through the changes we've added, starting inside our `@code` block:

- We've added two new view models to help us containerize and display relevant data on the page with `GitHubCommitAggregateViewModel` and `GitHubCommitViewModel`, with their implementations shown below
- Next, we changed the signature of our `OnRowClick` method to be asynchronous, as we'll be making HTTP network calls to the GitHub API, and unfortunately, the speed of light has a limit so we have wait while the call is inflight. For now, we're simply just simulating that network latency with the line `await Task.Delay(TimeSpan.FromMilliseconds(800))`; once we wire up our API service, we'll substitute that out with actual API calls
- Once the API call has successfully completed, we stub out some dummy data for the `commitAggregate` view model property that's referenced in the HTML to enumerate the commits and display the repository name
- We've also added a `loadingCommits` property to the page to help us render a spinner while the call to the API is inflight and has yet to comeback

&nbsp;

#### GitHubCommitAggregateViewModel.cs

```csharp
using System.Collections.Generic;

namespace ExternalApisWithBlazor.Models
{
    public class GitHubCommitAggregateViewModel
    {
        public GitHubCommitAggregateViewModel(string repository, IEnumerable<GitHubCommitViewModel> commits) =>
            (Repository, Commits) = (repository, commits);
        public string Repository { get; }

        public IEnumerable<GitHubCommitViewModel> Commits { get; }
    }
}
```

&nbsp;

#### GitHubCommitViewModel.cs

```csharp
using System;

namespace ExternalApisWithBlazor.Models
{
    public class GitHubCommitViewModel
    {
        public GitHubCommitViewModel(string sha, string htmlUrl, string commitUser, string commitMessage) =>
            (Sha, HtmlUrl, CommitUser, CommitMessage) = (sha, htmlUrl, commitUser, commitMessage);

        public string Sha { get; }

        public string HtmlUrl { get; }

        public string CommitUser { get; }

        public string CommitMessage { get; }
    }
}
```

Inside our markup:

- Using a Razor `@if` directive, we conditionally render bits of HTML based on our current page state
- If we're in a `loadingCommits` state, flipped on/off when a user clicks a row from the repository table, we'll render a simple Bootstrap spinner
- If our `commitAggregate` property has yet to be instantiated, we'll render a message to the user to select a row to load some commits
- If the user has clicked a row and the call to load commits has completed, we'll render another Bootstrap table that enumerates the commit list on the `commitAggregate` page property and display the commit alongside the repository for clarity
- If the user has clicked a row and the call to load commits has completed, but there are no commits returned from the API, we'll render a message to let the user know

Once again, if you're using the `watch` argument from the command, go ahead and save while refreshing the page:

![updated_projects_on_load](/blog/blazor-basics-series/updated_projects_on_load.png)

Go ahead and click a row from the projects table, and we should now be seeing the loading spinner flash for just a few quick moments, then disappear with our commits table loaded for our selected repository - and we have _yet_ to write a single line of JavaScript ourselves!

![first_project](/blog/blazor-basics-series/first_project_after_load.png)

### Creating Application Services

While this is all fine and dandy, we're still dealing with static data. To make a our page dynamic, we'll need to add an HTTP service that will make network calls to the GitHub API so that we can load data dynamically into the page once the user lands on it. Recall that back in our `Program.cs` file that we have a line that adds a default implementation of Blazor's `HttpClient` service to the DI container with the line `builder.Services.AddBaseAddressHttpClient()`, allowing us to extend its capability and add our own custom services with requests to inject an instance of an `HttpClient`. Let's add a `Services` folder to the root project and underneath that, we'll add a `GitHubService.cs` file:

#### Services/GitHubService.cs

```csharp
using System;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using ExternalApisWithBlazor.Models;

namespace ExternalApisWithBlazor.Services
{
    public class GitHubService
    {
        private const string BaseUrl = "https://api.github.com/";
        private static readonly List<GitHubRepositoryViewModel> _repositories = new List<GitHubRepositoryViewModel>
            {
                new GitHubRepositoryViewModel("My Super Cool API", DateTime.Today, 1337),
                new GitHubRepositoryViewModel("My Other Super Cool API", DateTime.Today, 9000),
                new GitHubRepositoryViewModel("My Not So Super Cool API", DateTime.Today, 1)
            };

        private readonly HttpClient _httpClient;

        public GitHubService(HttpClient httpClient) =>
            _httpClient = httpClient;

        public async Task<IEnumerable<GitHubRepositoryViewModel>> GetRepositoriesAsync(string user)
        {
            // Simulate some network traffic
            await Task.Delay(TimeSpan.FromMilliseconds(1000));

            return _repositories;
        }

        public async Task<GitHubCommitAggregateViewModel> GetCommitsAsync(string repositoryName)
        {
            // Simulate some network traffic
            await Task.Delay(TimeSpan.FromMilliseconds(1000));
            List<GitHubCommitViewModel> commits;

            if (string.Equals(repositoryName, _repositories[0].Name))
            {
                commits = new List<GitHubCommitViewModel>
                    {
                        new GitHubCommitViewModel("abc123", "https://github.com", "joey32793", "feat(Core): Add FluentValidation library"),
                        new GitHubCommitViewModel("def456", "https://github.com", "joey32793", "chore(UI): Refactor login screen"),
                    };

                return new GitHubCommitAggregateViewModel(repositoryName, commits);
            }
            else if (string.Equals(repositoryName, _repositories[1].Name))
            {
                commits = new List<GitHubCommitViewModel>
                    {
                        new GitHubCommitViewModel("jkl987", "https://github.com", "user123", "chore(Build): Fix failing Azure Pipelines build"),
                        new GitHubCommitViewModel("qwe678", "https://github.com", "user456", "feat(Infrastructure): Add email service"),
                    };

                return new GitHubCommitAggregateViewModel(repositoryName, commits);
            }
            else
            {
                return new GitHubCommitAggregateViewModel(repositoryName, new List<GitHubCommitViewModel>());
            }
        }
    }
}
```

Let's break down our `GitHubService` here:

- First, we declare some internal class properties with `BaseUrl` and `_repositories`, with `BaseUrl` being the domain to the GitHub API and `_repositories` acting as our temporary data stub (we'll rip this out in a bit)
- Next, we inject an instance of the base `HttpClient` that comes with the DI container when we bootstrap our Blazor application
- Then we declare two externally available asynchronous methods to our consumers in `GetRepositoriesAsync` and `GetCommitsAsync`
- We pass a `user` string to `GetRepositoriesAsync` to load repositories for a specific user's login name, and a `repositoryName` once the repositories have been loaded and the user selects a repository to load
- We've moved the stub data out of our `GitHubProjects.razor` file and into our service, which we'll again swap out with an HTTP call to the API
- For now, we're using a hard coded user login, where I'll leave the ability to retrieve repositories based on GitHub username as an exercise for the reader

With our service in place, let's refactor our `GitHubProjects.razor` page to remove the stub data and add the service reference to `GitHubService`:

#### GitHubProjects.razor

```csharp
@page "/projects"

@using ExternalApisWithBlazor.Models
@using ExternalApisWithBlazor.Services
@inject GitHubService GitHubService

<h1>Projects</h1>

@if (loadingRepositories)
{
    <div class="d-flex flex-row justify-content-center">
        <div class="spinner-border text-info" role="status">
            <span class="sr-only">Loading repositories...</span>
        </div>
    </div>
}
else if (repositories is null || !repositories.Any())
{
    <h4 class="text-center">No repositories found :(</h4>
}
else
{
    <table class="table table-hover">
        <thead>
            <tr>
                <th scope="col">Repository</th>
                <th scope="col">Updated At</th>
                <th scope="col">Stars</th>
            </tr>
        </thead>
        <tbody>
            @foreach (var repository in repositories)
            {
                <tr @onclick="(async () => await OnRowClick(repository.Name))">
                    <td>@repository.Name</td>
                    <td>@repository.UpdatedAt.ToLongDateString()</td>
                    <td>@repository.Stars</td>
                </tr>
            }
        </tbody>
    </table>
}

<hr class="py-2" />

@if (repositories != null)
{
    @if (loadingCommits)
    {
        <div class="d-flex flex-row justify-content-center">
            <div class="spinner-border text-info" role="status">
                <span class="sr-only">Loading commits...</span>
            </div>
        </div>
    }
    else if (commitAggregate is null)
    {
        <h4 class="text-center">Select a row from the table above to load commits</h4>
    }
    else
    {
        @if (commitAggregate.Commits != null && commitAggregate.Commits.Any())
        {
            <h2>Commits for @commitAggregate.Repository</h2>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Sha</th>
                        <th scope="col">User</th>
                        <th scope="col">Message</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach (var commit in commitAggregate.Commits)
                    {
                        <tr>
                            <td>
                                <a href="@commit.HtmlUrl" target="_blank">@commit.Sha.Substring(0, 6)</a>
                            </td>
                            <td>@commit.CommitUser</td>
                            <td>@commit.CommitMessage</td>
                        </tr>
                    }
                </tbody>
            </table>
        }
        else
        {
            <h4>No commits found for repository @commitAggregate.Repository :(</h4>
        }
    }
}

@code {

    private IEnumerable<GitHubRepositoryViewModel> repositories;

    private GitHubCommitAggregateViewModel commitAggregate;

    private bool loadingCommits;

    private bool loadingRepositories;

    protected override async Task OnInitializedAsync()
    {
        loadingRepositories = true;

        // Add our stub data for now
        Console.WriteLine("Loading repositories...");
        repositories = await GitHubService.GetRepositoriesAsync("user123");

        Console.WriteLine("Repositories loaded successfully!");
        loadingRepositories = false;
    }

    private async Task OnRowClick(string repositoryName)
    {
        loadingCommits = true;
        Console.WriteLine($"Loading commits for repository {repositoryName}...");

        // Simulate some network latency
        commitAggregate = await GitHubService.GetCommitsAsync(repositoryName);

        Console.WriteLine("Commits loaded successfully!");
        loadingCommits = false;
    }

}
```

Note that not much of the markup has changed, with the only addition being a `loadingRepositories` flag that's used to render the spinner when we initialize the page. We've moved our view properties in `repositories` and `commitAggregate` to reference what's returned from our `GitHubService`, abstracting away the fact that we're still loading dummy data. Once we swap out our stubs with live calls, our `GitHubProjects` page will not require any additional changes. We've also moved both `OnInitialized` to its asynchronous variant with `OnInitializedAsync` and our click handler as well so that we can await the service calls in each method's implementation. We also need to change our lambda method to accommodate handling our asynchronous flow now, updating the expression to `async () => await OnRowClick(repository.Name)` inside our `@onclick` event handler for our `<tr>` tag in the repository table.

### Adding API Resource Models

With our page and service in place, let's go ahead and add our API models that we'll be deserializing into POCOs from the GitHub API responses. The two endpoints we're interested in are `/users/{username}/repos` to get a list of repositories from the user, and `/repos/{username}/{repositoryName}/commits` to get a list of commits for a particular repository. For those with [Postman](https://www.postman.com/) installed, let's fire it up and try calling the repositories endpoint for Microsoft to see the list of public repositories they have. To spare some blog post real estate, I'll leave the response out, but if you're following along, you'll see a JSON payload response roughly 3000 lines long. For those without Postman, checkout the example response in the repository for this blog post [here](https://github.com/JoeyMckenzie/ExternalApisWithBlazor/blob/master/Examples/ReposResponse.json).

The question becomes, how do we deserialize this response into a C# class? Thankfully, [quicktype](https://app.quicktype.io/?l=csharp) comes to the rescue. Using quicktype, we can easily punch in JSON content and see what the corresponding C# class would look like. Using the first object in the response from the call to Microsoft's repositories, I was able to generate a C# class, which I named `GitHubRepository.cs`, and quicktype auto-magically creates nested types for us as well. You'll notice in the repository response, there are two nested types identified by the `license` and `owner` properties. We'll need to implement the `owner` type, conveniently scaffolded for us thanks to quicktype. For the `license`, we won't be utilizing any of its child properties, so for now, I'll simply just make this type an `object`.

For brevity, I'll just leave links to the [GitHubRepository.cs](https://github.com/JoeyMckenzie/ExternalApisWithBlazor/blob/master/Models/GitHubRepository.cs) and [GitHubUser.cs](https://github.com/JoeyMckenzie/ExternalApisWithBlazor/blob/master/Models/GitHubUser.cs) classes from the associated GitHub repository for this blog post. One thing to note is that quicktype utilizes Newtonsoft's [Json.NET](https://www.newtonsoft.com/json) JSON deserializer with the `JsonProperty` attributes on each property. I've swapped that out in place of the new `System.Text.Json` Microsoft is now shipping with .NET Core, and converted all uses of `JsonProperty` to `JsonPropertyName`.

We'll do the same for the commits API response, taking Microsoft's Visual Studio Code repository as an example. Again, using Postman, let's call the commits endpoint at `https://api.github.com/repos/microsoft/vscode/commits` and take the first node from the response and let quicktype generate a commit class with the appropriate nested classes as well. We see that there are seven different classes generated, namely: the parent commit class, a commit detail information class, a commit parent class, a commit author class, a commit author detail class, a commit tree node class, and a commit verification class. Thankfully, I've done the hard work (read: 5 minutes of copy/paste) and created the necessary classes we'll need to deserialize a commit, leaving a couple class implementations that quicktype gave us as simple `object` types. Feel free to take a look at the classes [here](https://github.com/JoeyMckenzie/ExternalApisWithBlazor/tree/master/Models/Commits).

Now that we have our deserialized classes in place, let's go ahead and swap out our stub data in our `GitHubService` class with live HTTP calls to these endpoints:

#### GitHubService.cs

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using ExternalApisWithBlazor.Models;
using Microsoft.AspNetCore.Components;

namespace ExternalApisWithBlazor.Services
{
    public class GitHubService
    {
        private const string BaseUrl = "https://api.github.com";
        private readonly HttpClient _httpClient;

        public GitHubService(HttpClient httpClient) =>
            _httpClient = httpClient;

        public async Task<IEnumerable<GitHubRepositoryViewModel>> GetRepositoriesAsync(string user)
        {
            var repositories = await _httpClient.GetJsonAsync<IEnumerable<GitHubRepository>>($"{BaseUrl}/users/{user}/repos");

            if (repositories is null)
            {
                throw new HttpRequestException("Repositories not returned on response");
            }

            // Project each repository resource model from the GitHub API into our view model for the page
            return repositories
                .Select(r => new GitHubRepositoryViewModel(r.Name, r.UpdatedAt.DateTime, (int)r.StargazersCount))
                .OrderByDescending(r => r.UpdatedAt)
                .Take(10);
        }

        public async Task<GitHubCommitAggregateViewModel> GetCommitsAsync(string user, string repositoryName)
        {
            var commitsFromRepository = await _httpClient.GetJsonAsync<IEnumerable<GitHubCommit>>($"{BaseUrl}/repos/{user}/{repositoryName}/commits");

            if (commitsFromRepository is null)
            {
                throw new HttpRequestException("Commits from repository not found");
            }

            var commitsViewModel = commitsFromRepository
                .Select(c => new GitHubCommitViewModel(c.Sha, c.HtmlUrl?.AbsoluteUri, c.Author?.Login, c.Commit?.Message))
                .Take(10);

            return new GitHubCommitAggregateViewModel(repositoryName, commitsViewModel);
        }
    }
}
```

Finally, we've completely removed our dependency on hard coded values (almost) and replaced our stubs with live API calls to the GitHub API. In this bare bones implementation, we simply call the endpoint, deserialize the response list into the appropriate models, and project each resource response into our custom view model, taking only 10 at a time for page real estate and poor man's pagination. Note this is **not** intended for a real world use case, as we have yet to handle instances of the API being down, not responding properly, circuit breaking, and the list goes on. We simply call the endpoint assuming everything is fine, get some data, and map it back to our view model. Let's update our `GitHubProjects.razor` page one last time to accommodate calling the Microsoft repository, as I've modified the signature for `GetCommitsAsync` to take a `user` login as well to be used in the request path:

#### GitHubProjects.razor

```csharp
@page "/projects"

@using ExternalApisWithBlazor.Models
@using ExternalApisWithBlazor.Services
@inject GitHubService GitHubService

<h1>Projects</h1>

@if (loadingRepositories)
{
    <div class="d-flex flex-row justify-content-center">
        <div class="spinner-border text-info" role="status">
            <span class="sr-only">Loading repositories...</span>
        </div>
    </div>
}
else if (repositories is null || !repositories.Any())
{
    <h4 class="text-center">No repositories found :(</h4>
}
else
{
    <table class="table table-hover">
        <thead>
            <tr>
                <th scope="col">Repository</th>
                <th scope="col">Updated At</th>
                <th scope="col">Stars</th>
            </tr>
        </thead>
        <tbody>
            @foreach (var repository in repositories)
            {
                <tr @onclick="(async () => await OnRowClick(repository.Name))">
                    <td>@repository.Name</td>
                    <td>@repository.UpdatedAt.ToLongDateString()</td>
                    <td>@repository.Stars</td>
                </tr>
            }
        </tbody>
    </table>
}

<hr class="py-2" />

@if (repositories != null)
{
    @if (loadingCommits)
    {
        <div class="d-flex flex-row justify-content-center">
            <div class="spinner-border text-info" role="status">
                <span class="sr-only">Loading commits...</span>
            </div>
        </div>
    }
    else if (commitAggregate is null)
    {
        <h4 class="text-center">Select a row from the table above to load commits</h4>
    }
    else
    {
        @if (commitAggregate.Commits != null && commitAggregate.Commits.Any())
        {
            <h2>Commits for @commitAggregate.Repository</h2>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Sha</th>
                        <th scope="col">User</th>
                        <th scope="col">Message</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach (var commit in commitAggregate.Commits)
                    {
                        <tr>
                            <td>
                                <a href="@commit.HtmlUrl" target="_blank">@commit.Sha.Substring(0, 6)</a>
                            </td>
                            <td>@commit.CommitUser</td>
                            <td>@commit.CommitMessage</td>
                        </tr>
                    }
                </tbody>
            </table>
        }
        else
        {
            <h4>No commits found for repository @commitAggregate.Repository :(</h4>
        }
    }
}

@code {

    private string user = "microsoft";

    private IEnumerable<GitHubRepositoryViewModel> repositories;

    private GitHubCommitAggregateViewModel commitAggregate;

    private bool loadingCommits;

    private bool loadingRepositories;

    protected override async Task OnInitializedAsync()
    {
        loadingRepositories = true;

        // Add our stub data for now
        Console.WriteLine("Loading repositories...");
        repositories = await GitHubService.GetRepositoriesAsync(user);

        Console.WriteLine("Repositories loaded successfully!");
        loadingRepositories = false;
    }

    private async Task OnRowClick(string repositoryName)
    {
        loadingCommits = true;
        Console.WriteLine($"Loading commits for repository {repositoryName}...");

        commitAggregate = await GitHubService.GetCommitsAsync(user, repositoryName);

        Console.WriteLine("Commits loaded successfully!");
        loadingCommits = false;
    }

}
```

If we run this application now in all of its glory and navigate to the projects page, we see the first 10 repositories now being loaded, and we can verify our API calls by filtering on XHR from the dev tools console:

![initial_repos_load](/blog/blazor-basics-series/initial_repos_load.png)

Now, if we click on a table row, low and behold, the commit information for that repository loads, and we can again verify the network call from the dev tools console:

![commits_response](/blog/blazor-basics-series/commits_response.png)

And that folks, is our fully (read: semi) functional, external API calling Blazor application in its entirety. I want to iterate one more time, that we did not write a **single line** of JavaScript ourselves, and we've written a basic single page application that has the ability to call a live API and dynamically retrieve and load data in response to a user's action. While it may seem like a dream, let's take a minute to discuss how we might improve this solution, and possibly leave the implementation details as an exercise for you, the reader!

### Improvements to be made

#### Exception Handling

For starters, we are not handling exceptions gracefully in any manner within our project, so the first thing we would want to improve is our error handling. If the API gives us back a non-successful response code, you'll see in the page an error being thrown in the console, consequently crashing the application and forcing users to reload. Not a great user experience, so we might benefit from bullet proofing our API service to recover from those scenarios in a user friendly manner.

#### State

Next, notice what happens if you navigate away from the projects page after loading the data, and then navigate back to the projects page: the data is gone! Enter the problem of application state. Just as applications on the server might manage a user session and store the current state of the session, we typically implement a similar process on the frontend as well, allowing users to navigate at will from page to page in our application, saving their interactions that alter data on a view in any way along the way to provide a seamless experience without having to reload pages, or even the application itself. There are great libraries and design patterns built to handle this, namely the Redux implementation for Blazor, [Fluxor](https://github.com/mrpmorris/fluxor). State management is an entire discussion in and of itself, and a bit outside of the scope of what we've set out to conquer today. Take a look the repository and several of the examples to get an idea of how we might implement state management into what we've built here today.

#### Security

With our current implementation, **anyone** with access to a browser could, in theory, navigate to our page and have our application send a large amount of requests to the GitHub API. Thankfully, the folks at GitHub have thought ahead and rate limited unauthenticated client requests, such as the requests we're making. When interfacing with an external service, it's important to know **who** is initiating the network calls, as we have a due dilligence to protect not only our own applications, but our consumers and prosumers as well.

#### UI

While I love Bootstrap, it's also caused _a lot_ of eerily similarly looking sites on the web nowadays. We stuck with the default CSS implementation Microsoft bootstrapped for us, but we could easily swap that out for a different UI library, such as [Bulma](https://bulma.io/) with the help of [Blazorise](https://github.com/stsrki/Blazorise), or Material Design with the help of [MatBlazor](https://www.matblazor.com/).

### Wrapping up

Blazor allows us simple .NET developers an alternative to frontend development, sparring us from JavaScript with the help of WebAssembly. As a personal aside, I'm embracing Blazor with open arms. If you've ever had to development with a modern JS framework, you're no stranger to the quirks and headaches that JavaScript, as well as NPM, can cause. With Blazor, there's finally an escape from `node_modules` directories containing every dependency in the observable universe, `==` type coercion (seriously, STOP using `==` - it's 2020 guys, not 1997), and the insanity of NPM ([my favorite package](https://www.npmjs.com/package/is-even) for reference). In future posts, we'll explore Blazor in greater detail, cool libraries, and maybe some JS interop along the way. For now, happy coding!