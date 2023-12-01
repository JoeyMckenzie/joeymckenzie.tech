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
