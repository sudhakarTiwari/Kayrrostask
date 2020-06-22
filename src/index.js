const KEY = "assets";
let assetStore = new AssetStore();

window.onload = function() {
  assetStore.restoreFromLocal();
  buildTable();
};

function AssetStore() {
  this.allAssets = [];
}

AssetStore.prototype.restoreFromLocal = function() {
  let val = localStorage.getItem(KEY);
  this.allAssets = val ? JSON.parse(val) : [];
};

AssetStore.prototype.save = function() {
  localStorage.setItem(KEY, JSON.stringify(this.allAssets));
};

AssetStore.prototype.add = function(asset) {
  this.allAssets.push(asset);
  this.save();
};

AssetStore.prototype.totalIncome = function(label) {
  let sum = 0;
  this.allAssets
    .filter(item => (label ? item.label === label : item))
    .forEach(item => {
      sum += item.income;
    });

  return sum;
};

AssetStore.prototype.getAllAssets = function() {
  return this.allAssets;
};

AssetStore.prototype.getAssetsByLabel = function(label) {
  const assets = this.allAssets.filter(item =>
    label ? item.label === label : item
  );

  return assets;
};

function Asset(name, category, income, area, label) {
  this.name = name;
  this.category = category;
  this.income = income;
  this.area = area;
  this.label = label;
}

// var a1 = new Asset("New", "Bridge", 100000, 343232423, "mid-income");
// var a2 = new Asset("New1", "Mall", 405000, 32423324, "mid-income");
// var a3 = new Asset("New2", "Hotel", 112000, 324234, "mid-income");

// assetStore.add(a1);
// assetStore.add(a2);
// assetStore.add(a3);

function buildTable() {
  const assets = assetStore.getAllAssets();
  console.log(assets);
  let htmlString = "";

  if (!assets.length) {
    htmlString = "<div class='no-data'>No Assets Found.</div>";
    document.querySelector(".assets-table").innerHTML = htmlString;
    return;
  }

  htmlString += `<table border="1">`;
  htmlString += `<tr>`;
  htmlString += `<th>#</th>`;
  htmlString += `<th>Company Name</th>`;
  htmlString += `<th>Category</th>`;
  htmlString += `<th>Income</th>`;
  htmlString += `<th>Area</th>`;
  htmlString += `<th>Labels</th>`;
  htmlString += `</tr>`;

  assets.forEach((asset, index) => {
    htmlString += `<tr>`;
    htmlString += `<td>${index + 1}</td>`;
    htmlString += `<td>${asset.name}</td>`;
    htmlString += `<td>${asset.category}</td>`;
    htmlString += `<td>${asset.income}</td>`;
    htmlString += `<td>${asset.area}</td>`;
    htmlString += `<td>${asset.label}</td>`;
    htmlString += `</tr>`;
  });

  let totalIncome = 0,
    totalArea = 0;

  assets.forEach(asset => {
    totalIncome += Number(asset.income);
    totalArea += Number(asset.area);
  });

  // Total
  htmlString += `<tr>`;
  htmlString += `<th>Total</th>`;
  htmlString += `<th>-</th>`;
  htmlString += `<th>-</th>`;
  htmlString += `<th>${totalIncome}</th>`;
  htmlString += `<th>${totalArea}</th>`;
  htmlString += `<th>-</th>`;
  htmlString += `</tr>`;

  htmlString += `</table>`;

  document.querySelector(".assets-table").innerHTML = htmlString;
}

document.querySelector("#button").addEventListener("click", function(e) {
  e.preventDefault();
  addAsset();
});

function addAsset() {
  const form = document.forms["asset-form"];
  const formData = new FormData(form);

  const name = formData.get("company-name");
  const area = formData.get("company-area");
  const labels = formData.get("company-label");
  const income = formData.get("company-income");
  const category = formData.get("company-category");

  let asset = new Asset(name, category, income, area, labels);
  assetStore.add(asset);
  buildTable();

  form.reset();
}
