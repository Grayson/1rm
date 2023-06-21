JS_TARGET := es2016
JS_MODULE := es6

build: index.js
	# Fix imports
	sed -i'.orig' -E "s/from '(.*)'/from '\1.js'/g" index.js
	rm *.orig

clean:
	rm *.js *.js.map

index.js:
	tsc --strict --sourceMap  --target $(JS_TARGET) --module $(JS_MODULE) index.ts

serve:
	python3 -m http.server

dist: build
	mkdir -p dist
	cp *.{js,js.map} dist/
	cp index.html dist/