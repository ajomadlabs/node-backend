test:
	cd AuthenticationService && npm test
images:
	docker build -t ajojohn/authservice ./AuthenticationService
	docker build -t ajojohn/imageservice ./ImageThumbnailService
	docker build -t ajojohn/patchservice ./JSONPatchService
push:
	docker push ajojohn/autheservice 
	docker push ajojohn/imageservice 
	docker push ajojohn/patchservice 

