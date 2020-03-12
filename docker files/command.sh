kubectl delete deployment kafkaserver
kubectl delete service kafka-manager
kubectl delete service kafkaserver
kubectl delete deployment kafka-manager


kubectl apply -f kafka-manager-service.yaml
kubectl apply -f kafkaserver-service.yaml
kubectl apply -f kafka-manager-deployment.yaml
kubectl apply -f kafkaserver-deployment.yaml
