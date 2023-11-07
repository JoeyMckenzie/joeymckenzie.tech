resource "aws_lambda_function" "quotes_lambda" {
  function_name    = "office-quotes"
  handler          = "not-applicable"
  runtime          = "provided"
  filename         = "office-quotes/target/lambda/office-quotes/bootstrap.zip"
  role             = aws_iam_role.lambda_execution_role.arn
  source_code_hash = filebase64sha256("../target/lambda/office-quotes/bootstrap.zip")

  environment {
    variables = {
      RUST_BACKTRACE = "1"
    }
  }
}

resource "aws_iam_role" "lambda_execution_role" {
  name = "office-quotes-lambda-role"

  assume_role_policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [
      {
        Action    = "sts:AssumeRole",
        Effect    = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "lambda_execution_policy" {
  name = "office-quotes-lambda-policy"

  description = "Policy for office quotes Lambda execution role"

  policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [
      {
        Action   = "logs:CreateLogGroup",
        Effect   = "Allow",
        Resource = "arn:aws:logs:${var.aws_region}:*:*"
      },
      {
        Action   = "logs:CreateLogStream",
        Effect   = "Allow",
        Resource = "arn:aws:logs:${var.aws_region}:*:log-group:/aws/lambda/office-quotes:*"
      },
      {
        Action   = "logs:PutLogEvents",
        Effect   = "Allow",
        Resource = "arn:aws:logs:${var.aws_region}:*:log-group:/aws/lambda/office-quotes:*:log-stream:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_execution_policy_attachment" {
  policy_arn = aws_iam_policy.lambda_execution_policy.arn
  role       = aws_iam_role.lambda_execution_role.name
}
