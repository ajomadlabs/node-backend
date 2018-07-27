test:
	cd AuthenticationService && npm run lint && npm test
	cd ImageThumbnailService && npm run lint && npm test
	cd JSONPatchService && npm run lint && npm test
images:
	docker build -t ajojohn/authservice ./AuthenticationService
	docker build -t ajojohn/imageservice ./ImageThumbnailService
	docker build -t ajojohn/patchservice ./JSONPatchService
push:
	docker push ajojohn/autheservice 
	docker push ajojohn/imageservice 
	docker push ajojohn/patchservice 
build-dev:
	docker-compose up
build-prod:
	docker-compose -f docker-compose-prod.yaml up
