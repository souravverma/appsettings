/*
    Name:       ce-api-harness
    Template:   Jenkinsfile Template for Node.js
    Version:    v1.0
*/

// OpenShift project names
def aspire_code = '1t21'
def openshift_project_dev = "${aspire_code}-d"
def openshift_project_val = "${aspire_code}-v"
def openshift_project_prod = "${aspire_code}-p"

// designated branch names
def branch_prod = 'main'
def branch_val = 'val'
def branch_val2 = 'VAL2'
def branch_dev = 'dev'

// the name of the microservice in OpenShift
def microservice = 'ce-api-harness'
def deploymentName = 'ce-api-harness'
def microservice_val2 = 'ce-api-harness-testing'
def deploymentName_val2 = 'ce-api-harness-testing'
//npm configuration
def npm_user_credentialsId = '1t21-ce-api-npm-user'

//docker configuration
def docker_user_credentialsId = '1t21-ce-api-docker-user'
def docker_caas_registry = 'r-2e28-caas-prod-docker-virtual.artifactory.2b82.aws.cloud.airbus.corp'
def docker_airbus_registry = 'docker-airbus-virtual.artifactory.2b82.aws.cloud.airbus.corp'
def docker_ce_local_registry = 'r-1t21-core-elec-platform-docker-local.artifactory.2b82.aws.cloud.airbus.corp'
def caas_image = docker.image('airbus/airbus-nodejs-12-ubi8')

pipeline {
    agent none
    options {
        ansiColor('xterm')
        timeout(time: 2, unit: 'HOURS')
        buildDiscarder(logRotator(daysToKeepStr: '90', numToKeepStr: '20', artifactDaysToKeepStr: '90', artifactNumToKeepStr: '20'))
    }

    parameters {
        choice(
            name: 'TF_ACTION',
            choices: ['Deploy', 'Destroy'],
            description: 'Choose the deployment strategy to do')
        choice(
            name: 'DEPLOY_ENVIRONMENT',
            choices: ["auto", "dev", "val", "prod"],
            description: 'Choose the deployment environment')
        string(
            name: 'TF_REMOVE_LOCK_ID',
            defaultValue:"",
            description: 'Use it only when a lock has been not correctly released.')
    }
    environment {
        DOCKER_IMAGE = '1t21-ce-api-harness'
        K8S_NAMESPACE = "coreelec"
        TF_ACTION = "$params.TF_ACTION"
        TF_REMOVE_LOCK_ID = "$params.TF_REMOVE_LOCK_ID"
        DEPLOY_ENVIRONMENT = "$params.DEPLOY_ENVIRONMENT"
    }
	stages{
		stage ('Service Build & sonar analysis') {
            when {
				environment name: 'TF_ACTION', value: "Deploy"
            }
            agent {
                    label 'docker && linux && sonarscanner'
            }
            environment {
                NPM = credentials('1t21-ce-api-npm-user')
                HOME = '${WORKSPACE}'
                NPM_CONFIG_PREFIX='${WORKSPACE}/.npm-global'
            }
            stages {
                stage ('Install modules and run unit test coverage') {
                    steps {
                        script {
                            docker.withRegistry("https://${docker_caas_registry}", docker_user_credentialsId) {
                                caas_image.inside {
                                    //sh 'npm config set cafile airbus-ca.crt'
                                    sh 'node --version'
                                    sh 'npm ci --verbose'
                                    sh 'npm run build'
                                    sh 'npm run lint'
                                    sh 'npm run test'
                                    sh 'npm run test:cov'
                                    //sh 'npm run test:e2e'
                                    //sh 'npm run test:cov'
                                }
                            }
                        }
                    }
                }
                stage ('Run Sonar Analysis') {
                    steps {
                        script {
                            withSonarQubeEnv('Enterprise Devops Sonar') {
                                sh 'sonar-scanner -Dsonar.branch.name=$GIT_BRANCH'
                            }
                        }
                    }
                }
                stage('Quality Gate') {
                    steps {
                        script {
                            retry(3){
                                try {
                                    timeout(activity: true, time: 10, unit: 'SECONDS') {
                                        waitForQualityGate abortPipeline: true
                                    }
                                } catch (err) {
                                    // we re-throw as a different error, that would not
                                    // cause retry() to fail (workaround for issue JENKINS-51454)
                                     error 'Timeout!'
                                }
                            }
                        }
                    }
                }
            }
            post {
                always {
                   cleanWs()
                }
            }
		}
		stage('Docker Image') {
            agent {
                node {
                    label 'linux && docker'
                }
            }
            environment {
                NPM = credentials('1t21-ce-api-npm-user')
            }
            when {
                anyOf { branch branch_dev; tag "v*" }
                anyOf {
                    environment name: 'DEPLOY_ENVIRONMENT', value: "dev"
                    environment name: 'DEPLOY_ENVIRONMENT', value: "val"
                    environment name: 'DEPLOY_ENVIRONMENT', value: "auto"
                }
				environment name: 'TF_ACTION', value: "Deploy"
                beforeAgent true
            }
            stages {
                stage ('Build docker image') {
                    steps {
                        script {
                            if ("$GIT_BRANCH"== "dev") {
                                DOCKER_TAG="$GIT_BRANCH"
                            } else {
                                DOCKER_TAG="$TAG_NAME"
                            }
                            docker.withRegistry( "https://${docker_caas_registry}", docker_user_credentialsId ) {
								dockerImage = docker.build ("${docker_ce_local_registry}/${DOCKER_IMAGE}:${DOCKER_TAG}", "--build-arg NPM_USR=${env.NPM_USR} --build-arg NPM_PSW=${env.NPM_PSW} -f Dockerfile .")
							}
                        }
                    }
                }
                stage ('Publish docker image') {
                    steps {
                        script {
                            docker.withRegistry( "https://${docker_ce_local_registry}", docker_user_credentialsId ) {
								dockerImage.push()
							}
                        }
                    }
                }
            }
        }
		stage ("Deploy service in EKS Non-prod") {
			agent {
                node {
                    label 'aws && docker && linux && nonprod'
                }
            }
            when {
                anyOf { branch branch_dev; tag "v*" }
                beforeAgent true
				environment name: 'TF_ACTION', value: "Deploy"
            }
            stages {
				stage ("EKS Deployment in dev") {
					when {
					    branch branch_dev
					}
					agent {
						docker {
							label 'aws && docker && linux && nonprod'
							image "1t21-eks-deployer:$eks_deployer_non_prod_tag"
							registryUrl 'https://r-1t21-core-elec-platform-docker-local.artifactory.2b82.aws.cloud.airbus.corp'
						}
					}
					environment {
						K8S_ENVIRONMENT = "dev"
						K8S_USER_TOKEN = credentials('eks-dev-coreelec-token')
						BUILD_URL = "${BUILD_URL}"
						IMAGE_TAG = "dev"
						TF_REMOVE_LOCK_ID = "${TF_REMOVE_LOCK_ID}"
					}
					steps {
						script {
							sh "plan-and-deploy-micro-service ./deployment/eks-deployment-dev.json"
						}
					}
				}
                stage ("EKS Deployment in val") {
					when {
					    allOf {
                            tag "v*"
                                anyOf {
                                    environment name: 'DEPLOY_ENVIRONMENT', value: "auto"
                                    environment name: 'DEPLOY_ENVIRONMENT', value: "val"
                                }
                        }
					}
					agent {
						docker {
							label 'aws && docker && linux && nonprod'
							image "1t21-eks-deployer:$eks_deployer_non_prod_tag"
							registryUrl 'https://r-1t21-core-elec-platform-docker-local.artifactory.2b82.aws.cloud.airbus.corp'
						}
					}
					environment {
						K8S_ENVIRONMENT = "val"
						K8S_USER_TOKEN = credentials('eks-val-coreelec-token')
						BUILD_URL = "${BUILD_URL}"
						IMAGE_TAG = "$TAG_NAME"
						TF_REMOVE_LOCK_ID = "${TF_REMOVE_LOCK_ID}"
					}
					steps {
						script {
							sh "plan-and-deploy-micro-service ./deployment/eks-deployment-val.json"
						}
					}
				}
			}
        }
        stage ("Deploy service in EKS prod") {
            agent {
                node {
                    label 'aws && docker && linux && prod'
                }
            }
            when {
                tag "v*"
                environment name: 'DEPLOY_ENVIRONMENT', value: "prod"
                beforeAgent true
				environment name: 'TF_ACTION', value: "Deploy"
            }
            stages {
                stage ("EKS Deployment in prod") {
                    agent {
                        docker {
                            label 'aws && docker && linux && prod'
                            image "1t21-eks-deployer:$eks_deployer_prod_tag"
                            registryUrl 'https://r-1t21-core-elec-platform-docker-local.artifactory.2b82.aws.cloud.airbus.corp'
                        }
                    }
                    environment {
                        K8S_ENVIRONMENT = "prod"
                        K8S_USER_TOKEN = credentials('eks-prod-coreelec-token')
                        BUILD_URL = "${BUILD_URL}"
                        IMAGE_TAG = "$TAG_NAME"
                        TF_REMOVE_LOCK_ID = "${TF_REMOVE_LOCK_ID}"
                    }
                    steps {
                        script {
                            sh "plan-and-deploy-micro-service ./deployment/eks-deployment-prod.json"
                        }
                    }
                }
            }
        }
        stage ("Destroy Service in EKS Non-prod") {
            agent {
                node {
                    label 'aws && docker && linux && nonprod'
                }
            }
            when {
                anyOf { branch branch_dev; tag "v*" }
                beforeAgent true
				environment name: 'TF_ACTION', value: "Destroy"
            }
            stages {
                stage('Destroy mode selection') {
                    steps {
                        input message: "Destroy Service in EKS?", ok: "Destroy"
                    }
		        }
                stage ('Destroy mode in Dev'){
			        when {
                        branch branch_dev
			        }
                    agent { label 'aws && docker && linux && nonprod' } {
                        docker {
                            label 'aws && docker && linux && nonprod'
                            image "1t21-eks-deployer:$eks_deployer_non_prod_tag"
                            registryUrl 'https://r-1t21-core-elec-platform-docker-local.artifactory.2b82.aws.cloud.airbus.corp'
                        }
                    }
			        options {
			            skipDefaultCheckout()
			        }
                    environment {
                        K8S_ENVIRONMENT = "dev"
                        K8S_USER_TOKEN = credentials('eks-dev-coreelec-token')
                        BUILD_URL = "${BUILD_URL}"
                        IMAGE_TAG = "dev"
                        TF_REMOVE_LOCK_ID = "${TF_REMOVE_LOCK_ID}"
                    }
                    steps {
                        sh "destroy-micro-service ./deployment/eks-deployment-dev.json"
                    }
                }
                stage ('Destroy mode in Val'){
			        when {
                        tag "v*"
                        environment name: 'DEPLOY_ENVIRONMENT', value: "val"
			        }
                    agent { label 'aws && docker && linux && nonprod' } {
                        docker {
                            label 'aws && docker && linux && nonprod'
                            image "1t21-eks-deployer:$eks_deployer_non_prod_tag"
                            registryUrl 'https://r-1t21-core-elec-platform-docker-local.artifactory.2b82.aws.cloud.airbus.corp'
                        }
                    }
			        options {
			            skipDefaultCheckout()
			        }
                    environment {
                        K8S_ENVIRONMENT = "val"
                        K8S_USER_TOKEN = credentials('eks-val-coreelec-token')
                        BUILD_URL = "${BUILD_URL}"
                        IMAGE_TAG = "$TAG_NAME"
                        TF_REMOVE_LOCK_ID = "${TF_REMOVE_LOCK_ID}"
                    }
                    steps {
                        sh "destroy-micro-service ./deployment/eks-deployment-val.json"
                    }
                }
            }
        }
        stage ("Destroy Service in EKS prod") {
            agent {
                node {
                    label 'aws && docker && linux && prod'
                }
            }
            when {
                tag "v*"
                environment name: 'DEPLOY_ENVIRONMENT', value: "prod"
                beforeAgent true
				environment name: 'TF_ACTION', value: "Destroy"
            }
            stages {
                stage('Destroy mode selection') {
                    steps {
                        input message: "Destroy Service in EKS prod?", ok: "Destroy"
                    }
		        }
                stage ('Destroy mode in prod'){
                    agent { label 'aws && docker && linux && prod' } {
                        docker {
                            label 'aws && docker && linux && prod'
                            image "1t21-eks-deployer:$eks_deployer_prod_tag"
                            registryUrl 'https://r-1t21-core-elec-platform-docker-local.artifactory.2b82.aws.cloud.airbus.corp'
                        }
                    }
                    options {
                        skipDefaultCheckout()
                    }
                    environment {
                        K8S_ENVIRONMENT = "prod"
                        K8S_USER_TOKEN = credentials('eks-prod-coreelec-token')
                        BUILD_URL = "${BUILD_URL}"
                        IMAGE_TAG = "$TAG_NAME"
                        TF_REMOVE_LOCK_ID = "${TF_REMOVE_LOCK_ID}"
                    }
                    steps {
                        sh "destroy-micro-service ./deployment/eks-deployment-prod.json"
                    }
                }
            }
        }
		stage ("OpenShift") {
			agent {
                node {
                    label 'openshift'
                }
            }
            when {
                anyOf { branch branch_dev; branch branch_val; branch branch_val2; branch branch_prod }
                beforeAgent true
            }
			stages {
                stage('Build on OpenShift in Dev') {
                    when {
                        branch branch_dev
                    }
                    steps {
                        script {
                            openshift.withCluster() {
                                openshift.withProject(openshift_project_dev) {
                                    timeout(5) {
                                        def bc = openshift.selector("bc", microservice).startBuild("--wait")
                                    }
                                }
                            }
                        }
                    }
                }
                stage('Deploy to OpenShift in Dev') {
                    when {
                        branch branch_dev
                    }
                    steps {
                        script {
                            openshift.withCluster() {
                                openshift.withProject(openshift_project_dev) {
                                    def dc = openshift.selector("dc", deploymentName)
                                    dc.rollout().latest()
                                    dc.rollout().status()
                                }
                            }
                        }
                    }
                }
                stage('Build on OpenShift in Val') {
                    when {
                        branch branch_val
                    }
                    steps {
                        script {
                            openshift.withCluster() {
                                openshift.withProject(openshift_project_val) {
                                    timeout(5) {
                                        def bc = openshift.selector("bc", microservice).startBuild("--wait")
                                    }
                                }
                            }
                        }
                    }
                }
                stage('Deploy to OpenShift in Val') {
                    when {
                        branch branch_val
                    }
                    steps {
                        script {
                            openshift.withCluster() {
                                openshift.withProject(openshift_project_val) {
                                    def dc = openshift.selector("dc", deploymentName)
                                    dc.rollout().latest()
                                    dc.rollout().status()
                                }
                            }
                        }
                    }
                }
                 stage('Build on OpenShift in VAL2') {
                    when {
                        branch branch_val2
                    }
                    steps {
                        script {
                            openshift.withCluster() {
                                openshift.withProject(openshift_project_dev) {
                                    timeout(5) {
                                        def bc = openshift.selector("bc", microservice_val2).startBuild("--wait")
                                    }
                                }
                            }
                        }
                    }
                }
                stage('Deploy to OpenShift in VAL2') {
                    when {
                        branch branch_val2
                    }
                    steps {
                        script {
                            openshift.withCluster() {
                                openshift.withProject(openshift_project_dev) {
                                    def dc = openshift.selector("dc", deploymentName_val2)
                                    dc.rollout().latest()
                                    dc.rollout().status()
                                }
                            }
                        }
                    }
                }
                stage('Build on OpenShift in Prod') {
                    when {
                        branch branch_prod
                    }
                    steps {
                        script {
                            openshift.withCluster() {
                                openshift.withProject(openshift_project_prod) {
                                    timeout(5) {
                                        def bc = openshift.selector("bc", microservice).startBuild("--wait")
                                    }
                                }
                            }
                        }
                    }
                }
                stage('Promote to Prod?') {
                    when {
                        branch branch_prod
                    }
                    steps {
                        input message: "Promote to Prod?", ok: "Promote"
                    }
                }
                stage('Deploy to OpenShift in Prod') {
                    when {
                        branch branch_prod
                    }
                    steps {
                        script {
                            openshift.withCluster() {
                                openshift.withProject(openshift_project_prod) {
                                    def dc = openshift.selector("dc", deploymentName)
                                    dc.rollout().latest()
                                    dc.rollout().status()
                                }
                            }
                        }
                    }
                }
            }
		}
	}
    post {
        success {
            script{
                if (env.BRANCH_NAME == "${branch_dev}" || env.BRANCH_NAME == "${branch_val}" || env.BRANCH_NAME == "${branch_prod}") {
                    mail bcc: '', body: "<b>Informations about the Build:</b><br>Project: ${env.JOB_NAME} <br>Build Number: ${env.BUILD_NUMBER} <br> URL de build: ${env.BUILD_URL}", cc: '', charset: 'UTF-8', from: 'jenkins-notification@airbus.com', mimeType: 'text/html', replyTo: '', subject: "SUCCESS CI: Project name -> ${env.JOB_NAME}", to: "dl-art-elec-lostininstallation@airbus.com";
                } else if(env.TAG_NAME != null) {
                    if(env.TAG_NAME.startsWith('v')) {
                      mail bcc: '', body: "<b>Informations about the Build:</b><br>Project: ${env.JOB_NAME} <br>Build Number: ${env.BUILD_NUMBER} <br> URL de build: ${env.BUILD_URL}", cc: '', charset: 'UTF-8', from: 'jenkins-notification@airbus.com', mimeType: 'text/html', replyTo: '', subject: "SUCCESS CI: Project name -> ${env.JOB_NAME}", to: "dl-art-elec-lostininstallation@airbus.com";
                    }
                }
            }
        }
        failure {
            script{
                if (env.BRANCH_NAME == "${branch_dev}" || env.BRANCH_NAME == "${branch_val}" || env.BRANCH_NAME == "${branch_prod}") {
                    mail bcc: '', body: "<b>Informations about the Build:</b><br>Project: ${env.JOB_NAME} <br>Build Number: ${env.BUILD_NUMBER} <br> URL de build: ${env.BUILD_URL}", cc: '', charset: 'UTF-8', from: 'jenkins-notification@airbus.com', mimeType: 'text/html', replyTo: '', subject: "FAILED CI: Project name -> ${env.JOB_NAME}", to: "dl-art-elec-enablers@airbus.com,dl-art-elec-lostininstallation@airbus.com";
                } else if(env.TAG_NAME != null) {
                    if(env.TAG_NAME.startsWith('v')) {
                      mail bcc: '', body: "<b>Informations about the Build:</b><br>Project: ${env.JOB_NAME} <br>Build Number: ${env.BUILD_NUMBER} <br> URL de build: ${env.BUILD_URL}", cc: '', charset: 'UTF-8', from: 'jenkins-notification@airbus.com', mimeType: 'text/html', replyTo: '', subject: "FAILED CI: Project name -> ${env.JOB_NAME}", to: "dl-art-elec-enablers@airbus.com,dl-art-elec-lostininstallation@airbus.com";
                    }
                }
            }
        }
    }
}
