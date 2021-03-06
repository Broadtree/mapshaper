
var assert = require('assert');
var api = require("..");
var mproj = require("mproj");

function roundtrip(proj, xy) {
  it (proj, function() {
    var src = api.internal.getProjection('wgs84');
    var dest = api.internal.getProjection(proj);
    var fwd = api.internal.getProjTransform(src, dest);
    var inv = api.internal.getProjTransform(dest, src);
    var xy2 = fwd(xy[0], xy[1]);
    var xy3 = inv(xy2[0], xy2[1]);
    var e = 1e-7;
    almostEqual(xy[0], xy3[0], e);
    almostEqual(xy[1], xy3[1], e);
  });

}

function invalid(proj) {
  it('invalid: ' + proj, function() {
    assert.throws(function() {
      api.internal.getProjection(proj);
    });
  })
}

function almostEqual(a, b, e) {
  e = e || 1e-10;
  if (Math.abs(a - b) < e) {
    assert(true);
  } else {
    assert.equal(a, b)
  }
}

describe('mapshaper-projections.js', function() {
  describe('roundtrip tests', function () {
    roundtrip('albersusa', [-96, 40]);
    roundtrip('+proj=robin', [10, 0]);
    roundtrip('robin', [10, 0]);
    roundtrip('+proj=lcc +lon_0=-96 +lat_1=33 +lat_2=45 +lat_0=39', [-96, 40]);
    roundtrip('+proj=lcc +lon_0=-96 +lat_1=33 +lat_2=45 +lat_0=39 +ellps=sphere',
       [-96, 40]);
    roundtrip('webmercator', [-70, 20]);
    roundtrip('merc', [-70, 20]);
    roundtrip('etmerc', [10, -80]);
    roundtrip('+proj=tmerc +units=ft', [2, 3]);
    roundtrip('+proj=utm +zone=34 +south', [18.423889, -33.925278]);
  })

  describe('test aliases', function () {
    it('webmercator', function () {
      var a = api.internal.getProjection('webmercator');
      var b = api.internal.getProjection('+proj=merc +a=6378137');
      var lp = {lam: 0.3, phi: 0.2};
      assert.deepEqual(mproj.pj_fwd(lp, a), mproj.pj_fwd(lp, b));
    })
  })

});
