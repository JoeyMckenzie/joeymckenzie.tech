provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      aws-rust-example = "rust-lambda-api-gateway"
    }
  }
}
