pipeline {
    agent any
    environment {
        ENV_FILE=credentials('emote-resizer-env-file')
        PORT=8008
        IMAGE_NAME='emote-resizer-prod'
        CONTAINER_NAME='emote-resizer-prod-container'
    }
    stages {
        stage('Setup Environment') {
            steps {
                echo "Create environment file with credentials"
                sh '''
                cp $ENV_FILE .env
                '''
            }
        }
        stage('Build Image') {
            steps {
                echo "Build Docker image: ${IMAGE_NAME}"
                sh '''
                docker build -t $IMAGE_NAME:latest .
                '''
            }
        }
        stage('Run Container') {
            steps {
                echo "Run Docker container: ${CONTAINER_NAME} on port: ${PORT}"
                sh '''
                docker stop $CONTAINER_NAME || true && docker rm $CONTAINER_NAME || true
                docker run -d --name $CONTAINER_NAME -p $PORT:3000 $IMAGE_NAME:latest
                '''
            }
        }
    }
}
