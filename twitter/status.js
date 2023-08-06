document.querySelectorAll('.tweet .full_text').forEach(node => {
	node.innerHTML = node.innerHTML.replace(/@([a-z0-9]+)/gi, '<a href="https://twitter.com/$1">@$1</a>');
});

document.getElementById('main').scrollIntoView();
