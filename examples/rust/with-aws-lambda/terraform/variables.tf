variable "aws_region" {
  type    = string
  default = "us-west-1"
}

variable "api_gateway_name" {
  type    = string
  default = "Office Quotes Gateway"
}

variable "api_gateway_description" {
  type    = string
  default = "API Gateway for all things The Office quotes."
}

variable "api_gateway_usage_plan_name" {
  type    = string
  default = "OfficeQuotePlan"
}

variable "api_gatway_api_key_name" {
  type    = string
  default = "office_quotes_api_key"
}
