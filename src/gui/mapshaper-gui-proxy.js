/* mapshaper-gui-lib */

function ImportFileProxy(model) {
  // Try to match an imported dataset or layer.
  // TODO: think about handling import options
  return function importFile(src, opts) {
    var datasets = model.getDatasets();
    var retn = datasets.reduce(function(memo, d) {
      var lyr;
      if (memo) return memo; // already found a match
      // try to match import filename of this dataset
      if (d.info.input_files[0] == src) return d;
      // try to match name of a layer in this dataset
      lyr = utils.find(d.layers, function(lyr) {return lyr.name == src;});
      return lyr ? MapShaper.isolateLayer(lyr, d) : null;
    }, null);
    if (!retn) stop("Missing data layer [" + src + "]");
    return retn;
  };
}
