Usage:
1. Build and push Docker image:
   docker build -t your-registry/household-dashboard:latest .
   docker push your-registry/household-dashboard:latest

2. Apply Kubernetes manifests:
   kubectl apply -f k8s/deployment.yaml
   kubectl apply -f k8s/ingress.yaml    # if you have an ingress controller

Notes:
- Replace YOUR_REGISTRY in k8s/deployment.yaml with your image registry.
- Service is ClusterIP by default and exposes container port 5174 on port 80 inside cluster.
- Ingress host should be updated to your DNS name. Requires ingress controller.
