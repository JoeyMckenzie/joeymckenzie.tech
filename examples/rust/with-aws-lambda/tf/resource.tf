resource "aws_api_gateway_resource" "quotes_resource" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "quotes"
}

resource "aws_api_gateway_method" "quotes_get_method" {
  rest_api_id      = aws_api_gateway_rest_api.this.id
  resource_id      = aws_api_gateway_resource.quotes_resource.id
  http_method      = "GET"
  authorization    = "NONE"
  api_key_required = true
}

resource "aws_api_gateway_integration" "quotes_get_integration" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.quotes_resource.id
  http_method             = aws_api_gateway_method.quotes_get_method.http_method
  integration_http_method = "GET"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.quotes_lambda.invoke_arn
  passthrough_behavior    = "NEVER"
  credentials             = aws_iam_role.this.arn
}

resource "aws_api_gateway_method_response" "quotes_get_method_response" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.quotes_resource.id
  http_method = aws_api_gateway_method.quotes_get_method.http_method
  status_code = "200"
}

resource "aws_api_gateway_integration_response" "quotes_get_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  resource_id = aws_api_gateway_resource.quotes_resource.id
  http_method = aws_api_gateway_method.quotes_get_method.http_method
  status_code = aws_api_gateway_method_response.quotes_get_method_response.status_code
  response_templates = {
    "application/json" = <<EOF
#set ($parsedPayload = $util.parseJson($input.json('$.output')))
$parsedPayload
EOF
  }

  depends_on = [
    aws_api_gateway_integration.quotes_get_integration,
  ]
}
