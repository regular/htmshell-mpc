bin := node_modules/.bin

build/mpc: build/mpc.gz
	printf 'cat \0440 | tail -n+2; exit 0\n' > $@
	printf '\033_HTMSHELL/1.0appendChild\ncontent-type:text/html\ncontent-encoding:gzip\ncontent-transfer-encoding:base64\n\n' >> $@
	cat $< | base64 >> $@
	printf '\033\\' >> $@
	chmod +x $@

build/mpc.gz: build/index.html
	gzip -vc $< > $@

build/index.html: index.pug build/bundle.js
	${bin}/pug index.pug -o build

build/bundle.js: client.js
	mkdir -p build
	${bin}/browserify client.js -o build/bundle.js

clean:
	rm -rf build
.PHONY: clean
