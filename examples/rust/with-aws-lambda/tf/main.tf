resource "aws_apigatewayv2_api" "office_quotes_gateway" {
  name          = "office-quotes-api-gateway"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "office_quotes_gateway" {
  api_id      = aws_apigatewayv2_api.office_quotes_gateway.id
  name        = "prod"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.office_quotes_gateway.arn
    format          = jsonencode({
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

resource "aws_apigatewayv2_integration" "quotes" {
  api_id             = aws_apigatewayv2_api.office_quotes_gateway.id
  integration_uri    = aws_lambda_function.quotes_lambda.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "quotes" {
  api_id    = aws_apigatewayv2_api.office_quotes_gateway.id
  route_key = "GET /quotes"
  target    = "integrations/${aws_apigatewayv2_integration.quotes.id}"
}

resource "aws_cloudwatch_log_group" "office_quotes_gateway" {
  name              = "/aws/office_quotes_gateway/${aws_apigatewayv2_api.office_quotes_gateway.name}"
  retention_in_days = 1
}

resource "aws_lambda_permission" "office_quotes_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.quotes_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.office_quotes_gateway.execution_arn}/*/*"
}
