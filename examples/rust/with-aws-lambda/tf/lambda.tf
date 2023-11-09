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
  name              = "/aws/lambda/${aws_lambda_function.office_quotes.function_name}"
  retention_in_days = 30
}

resource "aws_iam_role" "lambda_execution_policy" {
  name = "office-lambda-execution-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role       = aws_iam_role.lambda_execution_policy.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
