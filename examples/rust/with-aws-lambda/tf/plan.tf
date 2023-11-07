resource "aws_api_gateway_usage_plan" "this" {
  name = "${var.api_gateway_usage_plan_name}-${upper(var.environment)}"
  api_stages {
    api_id = aws_api_gateway_rest_api.this.id
    stage  = aws_api_gateway_stage.this.stage_name
  }

  throttle_settings {
    burst_limit = 5
    rate_limit  = 10
  }
}

resource "aws_api_gateway_api_key" "this" {
  for_each = toset(local.gateway_clients)
  name     = "${each.value}_${var.api_gatway_api_key_name}_${var.environment}"
}

resource "aws_api_gateway_usage_plan_key" "this" {
  for_each      = aws_api_gateway_api_key.this
  key_id        = each.value.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.this.id
}
