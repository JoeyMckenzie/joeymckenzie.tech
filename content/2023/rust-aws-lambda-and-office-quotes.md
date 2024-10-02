---
title: 'Rust, AWS Lambda, and too many Office quotes'
description: 'Identity theft is not a joke, Jim!'
pubDate: 'Nov 02 2023'
heroImage: '/images/rust-aws-lambda-office-quotes/meme.jpeg'
category: 'aws'
keywords:
    - rust
    - aws lambda
    - terraform
---

Back from a hard fought battle against writer's block, I've been looking for a way to convince my boss to let me use
Rust at work.
Most of our infrastructure is on AWS (_surprised pikachu face_) and I've been writing a lot of new system features
designed
to run serverlessly with things like Lambda, Step Functions, SQS, SNS, and all the other band members we know and love.
We're a .NET shop, so moving to Rust wouldn't exactly be an overnight transition, nor would I want to force my zealotry
upon my fellow developers.

My days are mostly spent raising a newly added member to my family, and I needed a reason to stay up late staring at my
laptop
while watching The Office reruns. Then it dawned on me... what if I could combine my two favorite things in Rust and The
Office?
It might sound crazy, but we're all about technological experimentation around these parts.

The outcome of that experiment was a Lambda deployed to AWS fronted by an API Gateway available to make requests to and
get
random quotes from The Office out. A request might look like:

```shell
$ curl -l "https://{{gateway URL}}/quotes" | jq .
{
    "author": "Prison Mike",
    "quote": "The worst thing about prison was the Dementors."
}
```

With the help [cargo lambda](https://www.cargo-lambda.info/guide/getting-started.html), I was surprised at how easy it
was to get up and running with Lambdas that were even more easily deployed to AWS. As an added bonus, I sprinkled in
some [Terraform](https://www.terraform.io/) because I'm lazy and don't know which buttons to click in AWS most of the
time. If you're following along, it'll help to have the following installed:

-   Cargo and cargo lambda installed (a quick `cargo install cargo-lambda` should do the trick)
-   Terraform CLI
-   An AWS account (I'm still on the free tier, for now...)

We'll touch the surface of a few things here, but won't be going into depth necessarily on any one topic. There's people
a lot smarter than myself that are ackshually qualified to talk about Rust, AWS, and Terraform.

## Getting started

First thing's first, we're gonna need some Rust code to deploy. Let's spin up a new project with cargo lambda:

```shell
$ cargo lambda new office-quotes
> Is this function an HTTP function? Yes
```

We're prompted about the compute context of our Rust-based Lambda, which in our case, will be from an API Gateway
request. Lambdas are compute services that can be triggered from any number of things in AWS like events from SNS. I
plan to eventually display some random Office quotes for anyone visiting my website, so I'll make it available over the
network for my website to utilize.

Cracking open our `main.rs` file, we'll see a pretty bare bones scaffolded Rust application:

```rust
use lambda_http::{run, service_fn, Body, Error, Request, RequestExt, Response};

/// This is the main body for the function.
/// Write your code inside it.
/// There are some code example in the following URLs:
/// - https://github.com/awslabs/aws-lambda-rust-runtime/tree/main/examples
async fn function_handler(event: Request) -> Result<Response<Body>, Error> {
    // Extract some useful information from the request
    let who = event
        .query_string_parameters_ref()
        .and_then(|params| params.first("name"))
        .unwrap_or("world");
    let message = format!("Hello {who}, this is an AWS Lambda HTTP request");

    // Return something that implements IntoResponse.
    // It will be serialized to the right response event automatically by the runtime
    let resp = Response::builder()
        .status(200)
        .header("content-type", "text/html")
        .body(message.into())
        .map_err(Box::new)?;
    Ok(resp)
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        // disable printing the name of the module in every log line.
        .with_target(false)
        // disabling time is handy because CloudWatch will add the ingestion time.
        .without_time()
        .init();

    run(service_fn(function_handler)).await
}
```

The `event` our function receives is an HTTP request from the API gateway that has a bunch of metadata
about the request, like query strings, path parameters, where the request came from, body of the request, etc. Luckily,
I ain't got time for all that noise - I want to simply return some quotes through a `GET` with an optional query
parameter `author` to get character specific quotes.

Next up, we're gonna need some quote data. Through the power of ChatGPT, I was able to generate a `quotes.json` file
that'll serve as our data source for quotes. When we eventually (inevitably?) choose to exercise our ability to
prematurely optimize our solution, we'll add in connectors to a plethora of different data sources on the off chance we
need to support multiple databases, caches, flat files, etc.

Our quotes file is pretty standard JSON:

#### quotes.json

```json
{
    "quotes": [
        {
            "quote": "Would I rather be feared or loved? Easy. Both. I want people to be afraid of how much they love me.",
            "author": "Michael Scott"
        },
        {
            "quote": "Whenever I'm about to do something, I think, 'Would an idiot do that?' and if they would, I do not do that thing.",
            "author": "Dwight Schrute"
        }
        // And many more...
    ]
}
```

Placing that at the root of our project directly next to `Cargo.toml` should do the trick so we can read it in, parse it
into a `struct` of sorts, and spit out some data on the other side when a request comes in. I'm gonna add a few crates
to help me out:

```
$ cargo add anyhow # To make error handling a little easier
$ cargo add rand # To help us pick random quotes if no author is provided via query param
$ cargo add serde --features macros # To help us read in JSON quotes to Rust structs
$ cargo add serde_json # To help us write data out in the response the AWS Rust runtime expects
```

With our crates in place, next let's add a file for parsing quote data from the quotes file:

#### src/quotes.rs

```rust
use std::{env::current_dir, fs::File, io::Read};

use anyhow::Context;
use rand::Rng;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct Quote {
    pub author: String,
    quote: String,
}

#[derive(Debug, Deserialize)]
pub struct QuotesData {
    quotes: Vec<Quote>,
}

impl QuotesData {
    pub fn get_random_quote(&self) -> Quote {
        let random_index = rand::thread_rng().gen_range(0..self.quotes.len());
        self.quotes[random_index].clone()
    }

    pub fn get_quote_by(&self, author: &str) -> Option<Quote> {
        self.quotes
            .clone()
            .into_iter()
            .find(|q| q.author.to_lowercase().contains(&author.to_lowercase()))
    }
}

pub fn get_quotes() -> anyhow::Result<QuotesData> {
    let quotes_file_path = current_dir().context("unable to determine current directory")?;

    let mut file = File::open(format!(
        "{}/quotes.json",
        quotes_file_path.to_str().unwrap()
    ))
        .context("unable to read quotes file")?;

    let mut file_contents = String::new();

    file.read_to_string(&mut file_contents)
        .context("unable to read the file contents into buffer")?;

    serde_json::from_str::<QuotesData>(&file_contents).context("unable to parse quotes")
}
```

Nothing too fancy here. We're defining a few `struct`s to hold our quote data in `Quote` and `QuoteData`, while `impl`'
ing some functions on `QuoteData` to get us a quote when asked for one either from a specific author, or a random quote.

Finally, we export a function for parsing the quotes file into our `QuotesData` stuct so we can do some logic with it
later. I should note that this isn't exactly the most exciting data, nor the most practical. You're probably already
asking yourself "wait... so we're parsing JSON data into Rust structs only to... return JSON data in the response?" Yes,
that's _exactly_ what we're doing. Don't ask me why.

Okay, so we have the ability to read the quotes file, now let's update our entrypoint into the function that will
determine the context of the request and grab a quote:

```rust
mod quotes;

use anyhow::Context;
use lambda_http::{run, service_fn, Body, Error, Request, RequestExt, Response};
use quotes::get_quotes;
use serde_json::json;
use tracing::info;

/// This is the main body for the function.
/// Write your code inside it.
/// There are some code example in the following URLs:
/// - https://github.com/awslabs/aws-lambda-rust-runtime/tree/main/examples
async fn function_handler(event: Request) -> Result<Response<Body>, Error> {
    info!("received request to get office quotes, loading quote data");

    // Load the quotes from our JSON file
    let quotes = get_quotes()?;

    // Grab a quote if an author name was sent along in the query params
    // If no author is sent, we'll grab a random quote from the JSON
    let quote = match event
        .query_string_parameters_ref()
        .and_then(|params| params.first("author"))
    {
        Some(author) => {
            info!("requested to retrieve quotes by author {author}");
            quotes.get_quote_by(author)
        }
        None => {
            info!("no author specified, retrieving a random quote");
            Some(quotes.get_random_quote())
        }
    };

    // Fineally, determine the response based on the authored quote we generated
    // If we successfully generated a quote, wrap it up in a nice JSON response
    // In the case an author was passed in via query param but no quote was found,
    // return an error response in JSON format with the help of serde_json's `json!()` macro
    match quote {
        Some(authored_quote) => {
            info!("quote retrieved by author {}", &authored_quote.author);

            let resp = Response::builder()
                .status(200)
                .header("content-type", "application/json")
                .body(
                    serde_json::to_string(&authored_quote)
                        .context("unable to serialize the hilarious quote")?
                        .into(),
                )
                .context("error attempting to build response body")?;

            Ok(resp)
        }
        None => {
            let resp = Response::builder()
                .status(404)
                .header("content-type", "application/json")
                .body(
                    json!({
                        "error": "Quote by that author does not exist."
                    })
                        .to_string()
                        .into(),
                )
                .context("error attempting build the error response")?;

            Ok(resp)
        }
    }
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        // disable printing the name of the module in every log line.
        .with_target(false)
        // disabling time is handy because CloudWatch will add the ingestion time.
        .without_time()
        .init();

    info!("bootstrapping lambda");

    run(service_fn(function_handler)).await
}
```

Again, nothing too fancy here. At the top level, we're inspecting the request for query parameters and if one was sent,
find a quote by that author from the JSON we parsed. If no author sent, generate a random quote. Finally, we'll return
JSON the API gateway based on the result of the request, falling back
to an error if an author was provided but no quote was found. I've sprinkled in some `.context()?` utilities to help us
early return from unexpected errors with the help of `anyhow`. In a more robust application, we'd probably want to do
some more fine-grained error handling. Cargo lambda conveniently bundles the `tracing` crate into our functions, so
we're
able to spit out some logs as well that will feed into a CloudWatch log group.

Now that we've got our function in place, let's test it out. `cargo lambda` has some sweet utilities to help us out,
including a `watch` command:

```shell
$ cargo lambda watch
INFO invoke server listening on [::]:9000
INFO starting lambda function function="_" manifest="Cargo.toml"
Compiling office-quotes v0.1.0 (/home/jmckenzie/typescript/joey-mckenzie-tech/examples/rust/with-aws-lambda)
Finished dev [unoptimized + debuginfo] target(s) in 1.40s
    Running `target/debug/office-quotes`
INFO bootstrapping lambda
```

And if we ping `localhost:9000`:

```shell
$ curl -l "localhost:9000" | jq .
{
  "author": "Michael Scott",
  "quote": "Would I rather be feared or loved? Easy. Both. I want people to be afraid of how much they love me."
}
```

Let's verify the query parameters are making it into the request as well:

```shell
$ curl -l "localhost:9000?author=kelly" | jq .
{
  "author": "Kelly Kapoor",
  "quote": "I talk a lot, so I've learned to just tune myself out..."
}
```

Lastly, let's check the error case where no author is found

```shell
$ curl -l "localhost:9000?author=ron" | jq .
{
  "error": "Quote by that author does not exist."
}
```

Nice! We've got ourselves an MVP, time to ship to production.

## Deploying to AWS

With our deployment approach, we'll do something akin to the following:

-   Build the output artifact with the help of `cargo lambda`
-   Package up the output into a zip file to store in S3
-   Upload the zip file into a bucket
-   Setup an Lambda function using the zip file as the source executable
-   Setup an API Gateway instance that proxies requests through to our Lambda function

Now doing all that stuff manually is not _too_ tedious, but I've been writing a lot Terraform lately and thought it
would fun to Terraform-erize this process. If you're not familiar with Terraform, it's
a [Hashicorp](https://www.hashicorp.com/) product with the goal of making provisioned infrastructure easier to main
through infrastructure as code, or IaC. Terraform uses a configuration language called Hashicorp Configuration
Language, or HCL, to define the who/what/when/where/why/how of our AWS infrastructure.

I like to think of Terraform as a recipe for what our AWS infrastructure should look like, while also having the ability
to plan and
apply those infrastructure changes for us, saving us an uncountable amount of mouse clicks navigating through the AWS
console.

An example piece of TF configuration might look like:

```hcl
resource "aws_lambda_function" "office_quotes" {
  function_name = "office-quotes"

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.lambda_office_quotes.key

  handler = "rust.handler"
  runtime = "provided.al2"

  source_code_hash = data.archive_file.lambda_office_quotes.output_base64sha256

  role = aws_iam_role.lambda_execution_policy.arn
}
```

Here, we're defining a resource that happens to be a Lambda function called `office_quotes`. That Lambda has a function
name of `office-quotes`, has its source files located in an S3 bucket (which we'll provision in just a minute), and runs
on an EC2 instance with the `provided.al2` runtime. There's some other stuff in there like the role, which defines the
execution policy invokers of the function should have, and an MD5 hash of the zip file output. I mentioned earlier that
this isn't necessarily a blog post about Terraform, so I'll leave
a [link](https://github.com/JoeyMckenzie/joeymckenzie.tech/tree/main/examples/rust/with-aws-lambda) to the example code
here.

Following the plan above, first thing we need is an S3 bucket we can store our zipped up function code in. I'll create
a `bucket.tf` configuration file that will do just that:

#### bucket.tf

```hcl
resource "random_pet" "lambda_bucket_name" {
  prefix = "rust-lambda"
}

resource "aws_s3_bucket" "lambda_bucket" {
  bucket = random_pet.lambda_bucket_name.id
}

resource "aws_s3_bucket_ownership_controls" "lambda_bucket" {
  bucket = aws_s3_bucket.lambda_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "lambda_bucket" {
  depends_on = [aws_s3_bucket_ownership_controls.lambda_bucket]

  bucket = aws_s3_bucket.lambda_bucket.id
  acl    = "private"
}

data "archive_file" "lambda_office_quotes" {
  type = "zip"

  source_dir  = "${path.module}/../target/lambda/office-quotes"
  output_path = "${path.module}/bootstrap.zip"
}

resource "aws_s3_object" "lambda_office_quotes" {
  bucket = aws_s3_bucket.lambda_bucket.id

  key    = "bootstrap.zip"
  source = data.archive_file.lambda_office_quotes.output_path

  etag = filemd5(data.archive_file.lambda_office_quotes.output_path)
}
```

The first few `resource`s defined above describe the bucket name with the help of a couple randomly generated names and
permissions on the bucket. The last few pieces of configuration define some `data` we're going to work with that happens
to be an archive file and an object that will exist in that bucket that's just the zip file of our function code.

You may have noticed that the `source_dir` of our `archive_file` data that we'll need doesn't actually exist yet - let's
build it! Within our parent directory (I usually stick all my Terraform specific stuff in a subdirectory of the project
I'm working in) let's run a quick `cargo lambda build --release` to build the output we need.

Once the build finishes, you should notice an exectuable file named `bootstrap` should be present in
your `target/lambda/office-quotes` folder. `cargo lambda` offers different build configurations as well, allowing output
formats to also be specified - we could also run the build with the `--output-format zip` flag to get a ready-to-upload
file with `bootstrap.zip`. Since we're leaning on Terraform to do the file zipping for us though, we'll take the default
generated executable instead.

With our bucket configuration in place, let's define our Lambda function configuration:

#### lambda.tf

```hcl
resource "aws_lambda_function" "office_quotes" {
  function_name = "office-quotes"

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.lambda_office_quotes.key

  handler = "rust.handler"
  runtime = "provided.al2"

  source_code_hash = data.archive_file.lambda_office_quotes.output_base64sha256

  role = aws_iam_role.lambda_execution_policy.arn
}

resource "aws_cloudwatch_log_group" "office_quotes" {
  name = "/aws/lambda/${aws_lambda_function.office_quotes.function_name}"

  retention_in_days = 1
}

resource "aws_iam_role" "lambda_execution_policy" {
  name               = "office-lambda-execution-role"
  assume_role_policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Sid       = ""
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role = aws_iam_role.lambda_execution_policy.name

  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
```

As we saw earlier, we'll use the same bit of function configuration and add a few things like CloudWatch logs and an
execution policy we'll expect services invoking the function to have.

Let's hookup the final piece of infrastructure we'll need for now in an API Gateway resource:

#### gateway.tf

```hcl
resource "aws_apigatewayv2_api" "office_gateway" {
  name = "office-gateway"

  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "office_gateway" {
  api_id = aws_apigatewayv2_api.office_gateway.id

  name        = "prod"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.office_gateway.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
    }
    )
  }
}

resource "aws_apigatewayv2_integration" "get_quote" {
  api_id = aws_apigatewayv2_api.office_gateway.id

  integration_uri    = aws_lambda_function.office_quotes.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "get_quote" {
  api_id = aws_apigatewayv2_api.office_gateway.id

  route_key = "GET /quotes"
  target    = "integrations/${aws_apigatewayv2_integration.get_quote.id}"
}

resource "aws_cloudwatch_log_group" "office_gateway" {
  name = "/aws/api-gateway/${aws_apigatewayv2_api.office_gateway.name}"

  retention_in_days = 1
}

resource "aws_lambda_permission" "office_gateway" {
  statement_id = "AllowExecutionFromAPIGateway"
  action       = "lambda:InvokeFunction"

  function_name = aws_lambda_function.office_quotes.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.office_gateway.execution_arn}/*/*"
}
```

Our API Gateway configuration is defined as a good ole fashioned HTTP API that has a route integration under
the `/quotes` path that will invoke our Lambda function. With the help of Terraform, we can reference bits of
infrastructure
created in other files without needing to hard code or manually point to things.

When we apply all of our Terraform infrastructure, we'll need a way to reference our created API Gateway without having
to step into the AWS Console and click our way through to the API Gateway dashboard. Let's add an `outputs.tf` file
that tell Terraform that once all of our infrastructure is created, output it to the console for us. The created
resources are also saved in our `terraform.tfstate` file as well, so we can also reference them there if need be.

```hcl
output "base_url" {
  description = "Base URL for API Gateway stage."

  value = aws_apigatewayv2_stage.office_gateway.invoke_url
}

output "lambda_bucket_name" {
  description = "Name of the S3 bucket used to store function code."

  value = aws_s3_bucket.lambda_bucket.id
}
```

While we're at it, we'll go ahead and print out our bucket name as well as everytime we'll destroy/apply infrastructure,
it'll change due to the random module we're leveraging to avoid clashing buckets. Now if we apply this plan, we should
see the fruits of our labor:

```shell
$ terraform apply -auto-approve

# A bunch of logs about planned infrastructure...

Apply complete! Resources: 15 added, 0 changed, 0 destroyed.

Outputs:

base_url = "https://dbyhxt543e.execute-api.us-west-1.amazonaws.com/prod"
lambda_bucket_name = "rust-lambda-choice-cricket"
```

And if I ping my URL (yours will be different) at the `/quotes` route:

```shell
$ curl -l "https://dbyhxt543e.execute-api.us-west-1.amazonaws.com/prod/quotes" | jq .
{
  "author": "Dwight Schrute",
  "quote": "Identity theft is not a joke, Jim! Millions of families suffer every year."
}
```

Success! Rust, running on Lambda, publicly available through an API Gateway. This is great and all, but we need a way
to reliably rebuild our infrastructure and apply changes. I'm going to define a `justfile`
using [just](https://github.com/casey/just)
at the root of our project directory as I'm not smart enough to use `make`.

#### justfile

```shell
alias b := build

default: dev

# build main
build:
    cargo lambda build --release && cp ./quotes.json ./target/lambda/office-quotes

# build main
build-deploy.sh: build
    just terraform/reapply

# run the dev server
dev:
    cargo watch -x run

# lint rust files
clippy:
    cargo clippy

# check rust files format
check:
    cargo fmt -v --check

# format rust files
format:
    cargo fmt -v

# run code quality tools
ci: check clippy
```

`just` is _just_ a convenient command runner, useful for aggregating things you'll run constantly in the terminal into a
single source command. Instead of having to swap between `terraform` and `cargo` commands, `just` will allow me define a
few
common commands to run so I can use things like `just build` or `just deploy` instead. I'm also going to define
another `justfile`
within our `terraform` directory that will house all of the `terraform` commands we'll need to run:

#### terraform/justfile

```shell
default: plan

# run the plan
plan:
    terraform plan

# apply the plan
apply:
    terraform apply -auto-approve && sed -i '' "s|^QUOTES_BASE_URL=.*|QUOTES_BASE_URL=$(terraform output -raw base_url)|" ../../../../.env

# destroy the plan
destroy:
    terraform destroy -auto-approve

# re-apply the plan
reapply: destroy apply

# format files
fmt:
    terraform fmt
```

One could argue it's may not be the most fruitful idea to `-auto-approve` TF commands as it's essentially a force
command,
and we'd be better served running these things in CI through something like Terraform Cloud. I'm a one band on the AWS
free tier,
though, so I'll cut a few corners.

Back in our root project directory, I can now run things like `just terraform/destory` or `just terraform/apply` without
needing
to swap directories to run the different commands from the different `justfile`s. Let's verify our infrastructure is
re-creatable,
as that's where the true power of Terraform shines (in my opinion). Reliably re-creatable infrastructure empowers us to
move
fast, especially when building in a multi-stage development environment.

```shell
$ just build-deploy.sh
cargo lambda build --release && cp ./quotes.json ./target/lambda/office-quotes
    Finished release [optimized] target(s) in 0.12s
just terraform/reapply
terraform destroy -auto-approve
// ...and a bunch of other TF output
```

With our single `build-deploy` command, we'll:

-   Compile our Rust code
-   Build the expected output we need to zip and deploy to S3
-   Copy over our JSON file for our Rust code to read from
-   Destroy/recreate all of the required AWS infrastructure
-   Deploy our zip file to the S3 bucket for our Lambda to use

Again, we'll see more output for the `base_url` and `lambda_bucket_name`, though with different IDs and names this time.
I won't necessarily verify everything in AWS console, but we now have:

-   A Lambda function that runs our zipped up Rust code from an S3 bucket
-   An API Gateway instance that forwards requests to that Lambda
-   CloudWatch log groups for both our API Gateway instance and our Lambda function

As a sanity check, let's make sure all the pipes are still hooked up by sending through another request to our gateway:

```shell
$ curl -l "https://jcojq5szvk.execute-api.us-west-1.amazonaws.com/prod?author=michael" | jq .
{
    "author": "Michael Scott",
    "quote": "I'm not superstitious...but I'm a little stitious."
}
```

Ez-pz, as the kids say! And with that, we've got Rust running on Lambda in AWS. The future of serverless Rust is looking
bright! You can find all the source code for this example on my website examples
in [GitHub](https://github.com/JoeyMckenzie/joeymckenzie.tech/tree/main/examples/rust/with-aws-lambda).

Until next time, friends!
