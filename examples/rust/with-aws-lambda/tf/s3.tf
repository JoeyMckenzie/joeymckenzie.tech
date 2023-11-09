resource "random_pet" "lambda_bucket_name" {
  prefix = "rust-lambda"
}

resource "aws_s3_bucket" "lambda_bucket" {
  bucket = random_pet.lambda_bucket_name.id
}

resource "aws_s3_bucket_ownership_controls" "lambda_bucket" {
  bucket = aws_s3_bucket.lambda_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "lambda_bucket" {
  depends_on = [aws_s3_bucket_ownership_controls.lambda_bucket]

  bucket = aws_s3_bucket.lambda_bucket.id
  acl    = "private"
}

### S3

data "archive_file" "lambda_office_quotes" {
  type = "zip"

  source_dir  = "${path.module}/../target/lambda/office-quotes"
  output_path = "${path.module}/bootstrap.zip"
}

resource "aws_s3_object" "lambda_office_quotes" {
  bucket = aws_s3_bucket.lambda_bucket.id

  key    = "bootstrap.zip"
  source = data.archive_file.lambda_office_quotes.output_path

  etag = filemd5(data.archive_file.lambda_office_quotes.output_path)
}
