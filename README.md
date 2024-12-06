
# AWS Application Deployment Using Terraform

This repository provides a comprehensive guide and Terraform configuration to deploy a containerized application on AWS. The setup includes an EC2 instance, a public Application Load Balancer (ALB), and optional TLS support.

## Contents
- Prerequisites
- Project Overview
- Setup Steps
  - Build and Push Docker Image
  - Deploy AWS Infrastructure
- Testing the Application
- Enabling TLS Support
- Notes

## Prerequisites
1. **AWS Setup:** Ensure you have AWS CLI configured with programmatic access.
2. **Terraform Installed:** Install Terraform.
3. **Docker Installed:** Ensure Docker is installed and running on your local machine.
4. **Key Pair:** Create a key pair in AWS (if needed for SSH access).

## Project Overview
This project involves:

1. Building and containerizing an application using Docker.
2. Pushing the Docker image to AWS Elastic Container Registry (ECR).
3. Deploying infrastructure using Terraform:
  - VPC, subnets, and internet gateway.
  - An EC2 instance to host the Dockerized application.
  - An Application Load Balancer for scaling and high availability.

## Setup Steps
### 1. Build and Push Docker Image
#### i. Clone the repository:
    git clone <repo_url>
    cd <repo_name>

#### ii. Build the Docker image:
    docker build -t my-app .

#### iii. Tag the image for AWS Elastic Container Registry (ECR):
    docker tag my-app:latest public.ecr.aws/<your_ecr_id>/my-app:latest

#### iv. Authenticate Docker with AWS ECR:
    aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws

#### v. Push the Docker image to ECR:
    docker push public.ecr.aws/<your_ecr_id>/my-app:latest

### 2. Deploy AWS Infrastructure
#### i. Initialize Terraform:
    terraform init

#### ii. Update the key_name in the Terraform script:
- Replace my-app-key in the aws_instance resource with the name of your existing key pair.
- To skip the key pair, remove the key_name line. Note: Without a key pair, SSH access to the instance will not be possible, but the application will still run.

#### iii. Apply the Terraform configuration:
    terraform apply

#### iv. Confirm the resources to be created by typing "yes" when prompted.

## Testing the Application
### Endpoints for Testing
Once the infrastructure is deployed, use the following endpoints to test the application. Replace <ip_or_host> with either the EC2 instance’s public IP or the Load Balancer’s DNS name:

#### i. Public Cloud & Index Page
Displays the application’s index page, including the secret word.
``` 
http://<ip_or_host>[:port]/
```
#### ii. Docker Check
Verifies the application is running inside a Docker container.
```
http://<ip_or_host>[:port]/docker
```
#### iii. Secret Word Check
Retrieves the SECRET_WORD environment variable.
```
http://<ip_or_host>[:port]/secret_word
```
#### iv. Load Balancer Check
Confirms the request is routed through the ALB.
```
http://<ip_or_host>[:port]/loadbalanced
```
#### v. TLS Check
***Note:*** TLS is not enabled in this setup because it requires a valid domain name. To enable TLS, refer to the Enabling TLS Support section.
```
http://<ip_or_host>[:port]/loadbalanced
```
## Enabling TLS Support
If you have a domain name, you can enable TLS for secure communication:
#### i. Create an ACM Certificate:
- Request an ACM certificate in AWS Management Console or via CLI:
```
aws acm request-certificate --domain-name <your-domain-name> --validation-method DNS

```
#### ii. Update the Terraform Script:
- Replace the placeholder certificate ARN in the aws_lb_listener resource with the ARN of your ACM certificate.
- Uncomment or add the following block to enable HTTPS:
```
resource "aws_lb_listener" "https_listener" {
  load_balancer_arn = aws_lb.main_lb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = "<your_certificate_arn>"

  default_action {
    type = "forward"
    target_group_arn = aws_lb_target_group.app_target_group.arn
  }
}
```
#### iii. Apply the Terraform changes:
```
terraform apply
```
## Notes
- The Load Balancer (DNS name) is preferred for accessing the application as it supports scalability and fault tolerance.
- The EC2 instance is configured with a public IP, allowing direct access as well.
- ***Key Pair Usage:*** If the key pair is removed, SSH access to the instance will not be possible. However, the application will remain accessible via the Load Balancer or public IP.



    
    
