System.register("chunks:///_virtual/bundle1975", [], function () {
  return {
    execute: function () {}
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/bundle1975', 'chunks:///_virtual/bundle1975'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});
//# sourceMappingURL=index.js.map