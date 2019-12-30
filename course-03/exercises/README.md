# Docker Hub Images 
https://hub.docker.com/u/ialmoqren

# Build and Push Docker Images

Move to `udacity-c3-deployment/docker/` and run these commands:

1. Build the images:
```
docker-compose -f docker-compose-build.yaml build
```

2. Push the images to docker hub:
```
docker-compose -f docker-compose-build.yaml push
```

# Deploy The Services

Now move to to `udacity-c3-deployment/k8s/` and run these commands:

1. Deploy config files
```
kubectl apply -f env-secret.yaml
kubectl apply -f env-configmap.yaml
kubectl apply -f aws-secret.yaml
```

2. Deploy the services
```
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f backend-feed-deployment.yaml
kubectl apply -f backend-feed-service.yaml
kubectl apply -f backend-user-deployment.yaml
kubectl apply -f backend-user-service.yaml
kubectl apply -f reverseproxy-deployment.yaml
kubectl apply -f reverseproxy-service.yaml
```

3. Check that everythhing is running ok
```
kubectl get pods
```

4. Forward ports
```
kubectl port-forward service/frontend 8100:8100
```

And in another terminal tab

```
kubectl port-forward service/reverseproxy 8080:8080
```


At this point, you should be able to see the frontend running at http://localhost:8100