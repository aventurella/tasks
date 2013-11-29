BUILD_PATH = build
SRC_PATH = src
RESOURCE_PATH_SRC = $(SRC_PATH)/static
RESOURCE_PATH_BLD = $(BUILD_PATH)/static

STYLESRC = $(wildcard $(RESOURCE_PATH_SRC)/scss/*.scss)
STYLEOBJ = $(STYLESRC:$(RESOURCE_PATH_SRC)/scss/%.scss=$(RESOURCE_PATH_BLD)/css/%.css)

.PHONY: all
all: clean scripts styles finalize

.PHONY: styles
styles: prepare_styles $(STYLEOBJ)


prepare_styles:
	@-rm -rf $(RESOURCE_PATH_BLD)/css
	mkdir -p $(RESOURCE_PATH_BLD)/css

scripts:
	@r.js -o build.js dir=$(BUILD_PATH)

$(RESOURCE_PATH_BLD)/css/%.css: $(RESOURCE_PATH_SRC)/scss/%.scss
	sass --style compressed -C $< > $@

finalize:
	@-rm -rf $(RESOURCE_PATH_BLD)/scss
	@-rm -rf $(BUILD_PATH)/build.txt

clean:
	@-rm -rf $(BUILD_PATH)


.PHONY: serve
serve:
	cd $(SRC_PATH); python -m SimpleHTTPServer


.PHONY: watch
watch:
	sass --watch $(RESOURCE_PATH_SRC)/scss:$(RESOURCE_PATH_SRC)/css

.PHONE: count-js
count-js:
	@echo 'JavaScript Files:'
	@find . -name '*.js' -not -path "./src/static/js/vendor/*" | wc -l
	@echo 'JavaScript LOC:'
	@find . -name '*.js' -not -path "./src/static/js/vendor/*" | xargs cat | wc -l

.PHONE: count-html
count-html:
	@echo 'HTML Files:'
	@find . -name '*.html' -not -path "./src/static/js/vendor/*" | wc -l
	@echo 'HTML LOC:'
	@find . -name '*.html' -not -path "./src/static/js/vendor/*" | xargs cat | wc -l