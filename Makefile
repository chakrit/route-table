
BIN  := $(shell pwd)/node_modules/.bin
LOG  := $(shell pwd)/log

# files
TEST_FILES := $(wildcard test/*.js)

# cli opts
TAP_OPTS        = --timeout 1 --stderr
SUPERVISOR_OPTS = -q -n exit -e 'js|node|pegjs' -w . \
                  -i '.git,node_modules,public,script,lib-cov,html-report'
PEGJS_OPTS      = --track-line-and-column --cache


default: test

node_modules:
	npm install


# File transformations
lib/grammar.js: lib/grammar.pegjs
	$(BIN)/pegjs < lib/grammar.pegjs > lib/grammar.js


# Testing
test: lib/grammar.js | node_modules
	$(BIN)/tap $(TAP_OPTS) $(TEST_FILES)

tdd:
	$(BIN)/supervisor $(SUPERVISOR_OPTS) -x $(BIN)/tap -- $(TEST_FILES)


# Cleans
clean:
	-rm lib/grammar.js

.PHONY: clean tdd test

