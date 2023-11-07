# data "aws_iam_role" "api_gateway_logger_role" {
#   name = "api-gateway-logger-role"
# }
#
data "aws_api_gateway_domain_name" "this" {
  domain_name = "api.officequotes.com"
}

resource "aws_api_gateway_rest_api" "this" {
  name        = var.api_gateway_name
  description = var.api_gateway_description

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

# resource "aws_api_gateway_account" "this" {
#   cloudwatch_role_arn = data.aws_iam_role.api_gateway_logger_role.arn
# }

resource "aws_api_gateway_deployment" "this" {
  rest_api_id = aws_api_gateway_rest_api.this.id
}

resource "aws_api_gateway_stage" "this" {
  deployment_id        = aws_api_gateway_deployment.this.id
  rest_api_id          = aws_api_gateway_rest_api.this.id
  stage_name           = var.environment
  xray_tracing_enabled = true
}

resource "aws_api_gateway_method_settings" "all" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  stage_name  = aws_api_gateway_stage.this.stage_name
  method_path = "*/*"

  settings {
    metrics_enabled        = true
    logging_level          = "INFO"
    data_trace_enabled     = false
    throttling_rate_limit  = 10000
    throttling_burst_limit = 5000
  }
}

resource "aws_api_gateway_base_path_mapping" "this" {
  api_id      = aws_api_gateway_rest_api.this.id
  stage_name  = aws_api_gateway_stage.this.stage_name
  domain_name = data.aws_api_gateway_domain_name.this.domain_name
  base_path   = "/"
  depends_on  = [
    aws_api_gateway_stage.this
  ]
}
