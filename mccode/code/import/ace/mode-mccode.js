ace.define("ace/mode/mccode_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var MccodeHighlightRules = function() {
    this.$rules = {
        "start" : [
          {
            token: ["mccode.keyword", "mccode.variable"],
            regex: "^(!file: )(.+)",
          },
          {
            token: ["mccode.keyword", "mccode.variable"],
            regex: "^(!type: )(.+)",
          },
          {
            token: ["mccode.text", "mccode.constant.other", "mccode.text"],
            regex: "^(\\s+)?(\\/\\w+)(\\s+(?:.+)?)?"
          },
          {
            token: "comment.mccode",
            regex: "^\\s*(?:(?:\\/\\/)|(?:#)).*",
          },
          {
            token: ["mccode.storage.type", "mccode.identifier", "mccode.keyword.operator", "mccode.identifier"],
            regex: "^(var)(\\s+[a-zA-Z_]\\w*\\s+)(=)(\\s+.+)",
          },
          {
            token: ["mccode.text", "mccode.text", "mccode.variable", "mccode.text", "mccode.variable", "mccode.text"],
            regex: "(\\$\\{)(?:(?:(\\{)(.+)(\\}))|(.+))(\\})",
          },
          {
            token: ["mccode.entity.name.function", "mccode.text"],
            regex: "(\\w+?)(\\(.*\\))",
          },
        ],
    };

};

oop.inherits(MccodeHighlightRules, TextHighlightRules);

exports.MccodeHighlightRules = MccodeHighlightRules;
});

ace.define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"], function(require, exports, module) {
"use strict";

var Range = require("../range").Range;

var MatchingBraceOutdent = function() {};

(function() {

    this.checkOutdent = function(line, input) {
        if (! /^\s+$/.test(line))
            return false;

        return /^\s*\}/.test(input);
    };

    this.autoOutdent = function(doc, row) {
        var line = doc.getLine(row);
        var match = line.match(/^(\s*\})/);

        if (!match) return 0;

        var column = match[1].length;
        var openBracePos = doc.findMatchingBracket({row: row, column: column});

        if (!openBracePos || openBracePos.row == row) return 0;

        var indent = this.$getIndent(doc.getLine(openBracePos.row));
        doc.replace(new Range(row, 0, row, column-1), indent);
    };

    this.$getIndent = function(line) {
        return line.match(/^\s*/)[0];
    };

}).call(MatchingBraceOutdent.prototype);

exports.MatchingBraceOutdent = MatchingBraceOutdent;
});



ace.define("ace/mode/mccode",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/mccode_highlight_rules","ace/mode/matching_brace_outdent", "ace/mode/behaviour/cstyle"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var HighlightRules = require("./mccode_highlight_rules").MccodeHighlightRules;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;
var CstyleBehaviour = require("./behaviour/cstyle").CstyleBehaviour;

var Mode = function() {
    this.HighlightRules = HighlightRules;
    this.$outdent = new MatchingBraceOutdent();
};
oop.inherits(Mode, TextMode);

(function() {

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        if (state == "start") {
            var match = line.match(/^.*[\{\(\[]\s*$/);
            if (match) {
                indent += tab;
            }
        }

        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };

    this.$behavior = new CstyleBehaviour();



    this.$id = "ace/mode/mccode";
}).call(Mode.prototype);

exports.Mode = Mode;
});                (function() {
                    ace.require(["ace/mode/mccode"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
