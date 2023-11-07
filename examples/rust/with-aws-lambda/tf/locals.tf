# A `locals.tf` file defines resuable data that may be shared among configruation.
# Local files allow us to define things like constants, keys, data setup, etc. to be
# references by other files within our modules.
#
# An example here is defining a list of allowed client for our gateway instance that
# will in turn be used to generate a unique API Gateway key for each client at the
# usage plan level:
#
# ```tf
# resource "aws_api_gateway_api_key" "this" {
#   for_each = toset(local.gateway_clients)
#   name     = "${each.value}_${var.api_gatway_api_key_name}_${var.environment}"
# }
# ```
#
# These can also be defined within the module file itself:
#
# ```tf
# locals {
#   gateway_clients = [
#     "client_one",
#     "client_two"
#   ]
# }
#
# resource "aws_api_gateway_api_key" "this" {
#   for_each = toset(local.gateway_clients)
#   name     = "${each.value}_${var.api_gatway_api_key_name}_${var.environment}"
# }
# ```

locals {
  gateway_clients = [
    "client_one",
    "client_two"
  ]
}
