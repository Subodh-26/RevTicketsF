pipeline {
    agent any
    
    environment {
        AWS_REGION = 'us-east-1'
        ECR_REGISTRY = '<AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com'
        BACKEND_IMAGE = 'revtickets-backend'
        FRONTEND_IMAGE = 'revtickets-frontend'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Subodh-26/RevTicketsF.git'
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }
        
        stage('Build Docker Images') {
            parallel {
                stage('Backend Image') {
                    steps {
                        dir('backend') {
                            sh """
                                docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} .
                                docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} ${BACKEND_IMAGE}:latest
                            """
                        }
                    }
                }
                stage('Frontend Image') {
                    steps {
                        dir('frontend') {
                            sh """
                                docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} .
                                docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${FRONTEND_IMAGE}:latest
                            """
                        }
                    }
                }
            }
        }
        
        stage('Push to ECR') {
            steps {
                script {
                    sh """
                        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
                        
                        docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} ${ECR_REGISTRY}/${BACKEND_IMAGE}:${IMAGE_TAG}
                        docker tag ${BACKEND_IMAGE}:latest ${ECR_REGISTRY}/${BACKEND_IMAGE}:latest
                        docker push ${ECR_REGISTRY}/${BACKEND_IMAGE}:${IMAGE_TAG}
                        docker push ${ECR_REGISTRY}/${BACKEND_IMAGE}:latest
                        
                        docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${ECR_REGISTRY}/${FRONTEND_IMAGE}:${IMAGE_TAG}
                        docker tag ${FRONTEND_IMAGE}:latest ${ECR_REGISTRY}/${FRONTEND_IMAGE}:latest
                        docker push ${ECR_REGISTRY}/${FRONTEND_IMAGE}:${IMAGE_TAG}
                        docker push ${ECR_REGISTRY}/${FRONTEND_IMAGE}:latest
                    """
                }
            }
        }
        
        stage('Deploy to EC2') {
            steps {
                script {
                    sh """
                        ssh -o StrictHostKeyChecking=no ec2-user@<EC2_IP> '
                            aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
                            
                            docker pull ${ECR_REGISTRY}/${BACKEND_IMAGE}:latest
                            docker pull ${ECR_REGISTRY}/${FRONTEND_IMAGE}:latest
                            
                            docker stop revtickets-backend revtickets-frontend || true
                            docker rm revtickets-backend revtickets-frontend || true
                            
                            docker run -d --name revtickets-backend -p 8080:8080 \
                                -e SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/revtickets \
                                -e SPRING_DATASOURCE_USERNAME=root \
                                -e SPRING_DATASOURCE_PASSWORD=root \
                                ${ECR_REGISTRY}/${BACKEND_IMAGE}:latest
                            
                            docker run -d --name revtickets-frontend -p 80:80 \
                                ${ECR_REGISTRY}/${FRONTEND_IMAGE}:latest
                        '
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
        always {
            sh 'docker system prune -f'
        }
    }
}
