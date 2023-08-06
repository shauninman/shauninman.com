
let results;

var index = new FlexSearch.Document({
	encode: function(str){
		const cjkItems = str.replace(/[\x00-\x7F]/g, "").split("");
		const asciiItems = str.toLowerCase().split(/\W+/);
		return cjkItems.concat(asciiItems);
  },
  document: {
    id: "id_str",
    index: ["full_text"],
    store: true
  }
});


const searchInput = document.getElementById('search-input');

function processData(data) {
  for (doc of data) {
    index.add({
        id_str: doc.id_str,
        created_at: doc.created_at,
        full_text: doc.full_text,
        favorite_count: doc.favorite_count,
        retweet_count: doc.retweet_count
    })
  };
  document.getElementById('loading').hidden = true;
  document.getElementById('search').hidden = false;
}

processData(searchDocuments);
let browseDocuments = searchDocuments.sort(function(a,b){
  return new Date(b.created_at) - new Date(a.created_at);
});

function sortResults(criterion) {
	// search
  if (criterion === 'newest-first') {
    results = results.sort(function(a,b){
      return new Date(b.created_at) - new Date(a.created_at);
    });
    renderResults();
  }
  if (criterion === 'oldest-first') {
    results = results.sort(function(a,b){
      return new Date(a.created_at) - new Date(b.created_at);
    });
    renderResults();
  }
  if (criterion === 'most-relevant') {
    results = results.sort(function(a,b){
      return a.index - b.index;
    });
    renderResults();
  }
  if (criterion === 'most-popular') {
    results = results.sort(function(a,b){
      return (+b.favorite_count + +b.retweet_count) - (+a.favorite_count + +a.retweet_count);
    });
    renderResults();
  }
  
  // browse
  if (criterion === 'newest-first-browse') {
    browseDocuments = browseDocuments.sort(function(a,b){
      return new Date(b.created_at) - new Date(a.created_at);
    });
    renderBrowse();
  }
  if (criterion === 'oldest-first-browse') {
    browseDocuments = browseDocuments.sort(function(a,b){
      return new Date(a.created_at) - new Date(b.created_at);
    });
    renderBrowse();
  }
  if (criterion === 'most-popular-browse') {
    browseDocuments = browseDocuments.sort(function(a,b){
      return (+b.favorite_count + +b.retweet_count) - (+a.favorite_count + +a.retweet_count);
    });
    renderBrowse();
  }
}

const pageSize = 50;
const pageMax = Math.floor(browseDocuments.length/pageSize) + 1;
let page = 1;
let browseIndex = (page - 1) * pageSize;

function onPageNumChange(e) {
  page = parseInt(e.target.value);
  browseIndex = (page - 1) * pageSize;
  renderBrowse();
}

document.getElementById('page-total').innerText = pageMax;
document.getElementById('page-num').addEventListener('input', onPageNumChange);
document.getElementById('page-num').value = +page;
document.getElementById('page-num').max = pageMax;
document.getElementById('page-num').min = 1;

function renderItem(item) {
	var full_text = item.full_text
		.replace(/([^>"])(http[^\s]+)/, '$1<a href="$2">$2</a>')	
		.replace(/@([a-z0-9_]+)/gi, '<a href="https://twitter.com/$1">@$1</a>');
	return `<div class="search_item">
  	    <p class="display_name">Shaun Inman</p>
  	    <p class="user_name">@shauninman</p>
  	    <p class="full_text">${full_text}</p>
		<p class="favorite_count">${item.favorite_count}</p>
		<p class="retweet_count">${item.retweet_count}</p>
  	    <a class="permalink created_at" href="status/${item.id_str}">${new Date(item.created_at).toLocaleString().replace(/([0-9]+\/[0-9]+\/[0-9]+),/, '$1')}</a>
	</div>`
	.replace(/\.\.\/\.\.\/tweets_media\//g,'tweets_media/');
}

function changePage(dir) {
	page += dir;
    browseIndex = (page - 1) * pageSize;
	document.getElementById('page-num').value = page
    renderBrowse();
}

function renderPagination(id) {
	var node = document.getElementById(id);
	node.innerHTML += '<p>';
	if (id!='output' && page>1) node.innerHTML += `<a href="#tabs" onclick="changePage(-1);">&larr; Previous</a> `;
	node.innerHTML += '<a href="#tabs">Top &uarr;</a> ';
	if (id!='output' && page<pageMax) node.innerHTML += `<a href="#tabs" onclick="changePage(1);">Next &rarr;</a> `;
	node.innerHTML += '</p>';
}

function renderResults() {
  const output = results.map(renderItem);
  document.getElementById('output').innerHTML = output.join('');
  if (results.length > 0) {
    // document.getElementById('output').innerHTML += '<a href="#tabs">Top &uarr;</a>';
	renderPagination('output');
  }
}

function onSearchChange(e) {
  results = index.search(e.target.value, { enrich: true });
  if (results.length > 0) {
    // limit search results to the top 100 by relevance
    results = results.slice(0,100);
    // preserve original search result order in the 'index' variable since that is ordered by relevance
    results = results[0].result.map((item, index) => { let result = item.doc; result.index = index; return result;});
  }
  renderResults();
}
searchInput.addEventListener('input', onSearchChange);

function searchTab() {
  const clickedTab = document.getElementById('search-tab');
  clickedTab.classList.add('active');
  const otherTab = document.getElementById('browse-tab');
  otherTab.classList.remove('active');
  document.getElementById('browse').hidden = true;
  document.getElementById('search').hidden = false;
}

function browseTab() {
  const clickedTab = document.getElementById('browse-tab');
  clickedTab.classList.add('active');
  const otherTab = document.getElementById('search-tab');
  otherTab.classList.remove('active');
  const searchContent = document.getElementById('search');
  document.getElementById('search').hidden = true;
  document.getElementById('browse').hidden = false;
}

function renderBrowse() {
  const output = browseDocuments.slice(browseIndex, browseIndex + pageSize).map(renderItem);
  document.getElementById('browse-output').innerHTML = output.join('');
  renderPagination('browse-output');
  // document.getElementById('browse-output').innerHTML += '<a href="#tabs">top &uarr;</a>';
}

document.addEventListener('click', function(event) {
	if (event.target.classList.contains('full_text')) {
		event.target.parentNode.querySelector('.permalink').click();
	}
});

renderBrowse();
browseTab();
